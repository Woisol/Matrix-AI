"""
存储过程 (PROCEDURE) - 复杂业务逻辑
"""
from app.models.base import fetch_one, get_db


# === 存储过程定义 SQL ===
PROCEDURES_SQL = """
-- 计算作业得分统计的存储过程
CREATE OR REPLACE PROCEDURE calculate_assignment_stats(IN p_assignment_id VARCHAR(50))
LANGUAGE plpgsql
AS $$
DECLARE
    v_submission_count INTEGER;
    v_avg_score FLOAT;
    v_max_score FLOAT;
    v_min_score FLOAT;
BEGIN
    SELECT
        COUNT(*)::INTEGER,
        COALESCE(AVG(score), 0)::FLOAT,
        COALESCE(MAX(score), 0)::FLOAT,
        COALESCE(MIN(score), 0)::FLOAT
    INTO v_submission_count, v_avg_score, v_max_score, v_min_score
    FROM assignment_submissions
    WHERE assignment_id = p_assignment_id;

    RAISE NOTICE 'Assignment: %, Submissions: %, Avg: %, Max: %, Min: %',
        p_assignment_id, v_submission_count, v_avg_score, v_max_score, v_min_score;
END;
$$;

-- 更新课程完成状态的存储过程
CREATE OR REPLACE PROCEDURE update_course_completion(IN p_courses_id VARCHAR(50))
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_assignments INTEGER;
    v_completed_assignments INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER INTO v_total_assignments
    FROM courses_assignments WHERE courses_id = p_courses_id;

    IF v_total_assignments = 0 THEN
        UPDATE courses SET completed = FALSE WHERE id = p_courses_id;
        RETURN;
    END IF;

    -- 计算已完成的作业数（至少有一次提交且平均分>=60）
    SELECT COUNT(DISTINCT s.assignment_id)::INTEGER INTO v_completed_assignments
    FROM assignment_submissions s
    JOIN courses_assignments ca ON s.assignment_id = ca.assignment_id
    WHERE ca.courses_id = p_courses_id
    GROUP BY s.assignment_id
    HAVING AVG(s.score) >= 60;

    -- 如果所有作业都完成，则标记课程为完成
    IF v_completed_assignments >= v_total_assignments THEN
        UPDATE courses SET completed = TRUE WHERE id = p_courses_id;
    ELSE
        UPDATE courses SET completed = FALSE WHERE id = p_courses_id;
    END IF;
END;
$$;

-- 批量创建作业提交的存储过程
CREATE OR REPLACE PROCEDURE batch_create_submissions(
    IN p_assignment_id VARCHAR(50),
    IN p_student_ids TEXT[],  -- 数组
    IN p_default_code TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_student_id VARCHAR(50);
BEGIN
    FOREACH v_student_id IN ARRAY p_student_ids
    LOOP
        INSERT INTO assignment_submissions (id, assignment_id, student_id, submit_code, submitted_at)
        VALUES (
            p_assignment_id || '_' || v_student_id || '_' || now()::TEXT,
            p_assignment_id,
            v_student_id,
            p_default_code,
            now()
        );
    END LOOP;
END;
$$;

-- 清理过期作业的存储过程
CREATE OR REPLACE PROCEDURE cleanup_expired_assignments(IN p_days INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted_count INTEGER := 0;
BEGIN
    -- 删除30天前截止且没有提交的作业
    DELETE FROM assignments a
    WHERE a.end_date < now() - (p_days || ' days')::INTERVAL
    AND NOT EXISTS (
        SELECT 1 FROM assignment_submissions s WHERE s.assignment_id = a.id
    );

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % expired assignments', v_deleted_count;
END;
$$;
"""


async def init_procedures():
    """初始化存储过程"""
    conn = await get_db()
    try:
        for sql in PROCEDURES_SQL.split(";"):
            sql = sql.strip()
            if sql:
                await conn.execute(sql)
    finally:
        await conn.close()


class AssignmentProcedures:
    """作业相关存储过程"""

    @staticmethod
    async def calculate_stats(assignment_id: str):
        """计算作业得分统计"""
        conn = await get_db()
        try:
            await conn.execute("CALL calculate_assignment_stats($1)", assignment_id)
        finally:
            await conn.close()

    @staticmethod
    async def batch_create_submissions(assignment_id: str, student_ids: list, default_code: str = ""):
        """批量创建提交记录"""
        conn = await get_db()
        try:
            await conn.execute(
                "CALL batch_create_submissions($1, $2, $3)",
                assignment_id, student_ids, default_code
            )
        finally:
            await conn.close()


class CourseProcedures:
    """课程相关存储过程"""

    @staticmethod
    async def update_completion(course_id: str):
        """更新课程完成状态"""
        conn = await get_db()
        try:
            await conn.execute("CALL update_course_completion($1)", course_id)
        finally:
            await conn.close()


class MaintenanceProcedures:
    """维护相关存储过程"""

    @staticmethod
    async def cleanup_expired(days: int = 30):
        """清理过期作业"""
        conn = await get_db()
        try:
            await conn.execute("CALL cleanup_expired_assignments($1)", days)
        finally:
            await conn.close()
