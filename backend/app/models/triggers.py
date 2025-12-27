"""
触发器 (TRIGGER) - 自动维护数据一致性
"""
from app.models.base import get_db


# === 触发器函数 SQL ===
TRIGGER_FUNCTIONS_SQL = """
-- 自动更新 updated_at 时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新提交时自动设置时间的函数
CREATE OR REPLACE FUNCTION update_submitted_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.submitted_at IS NULL THEN
        NEW.submitted_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 自动计算分析分数的函数
CREATE OR REPLACE FUNCTION auto_calculate_analysis_score()
RETURNS TRIGGER AS $$
DECLARE
    v_score FLOAT;
BEGIN
    -- 如果提交分数已设置，自动更新分析记录
    IF NEW.score IS NOT NULL THEN
        -- 更新或创建分析记录
        UPDATE assignment_analysis
        SET code_analysis = jsonb_set(
            COALESCE(code_analysis, '{}'::jsonb),
            '{score}',
            to_jsonb(NEW.score)
        )
        WHERE assignment_id = NEW.assignment_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 级联删除的函数
CREATE OR REPLACE FUNCTION cascade_delete_submissions()
RETURNS TRIGGER AS $$
BEGIN
    -- 删除相关的提交记录
    DELETE FROM assignment_submissions WHERE assignment_id = OLD.id;
    -- 删除相关的代码记录
    DELETE FROM assignment_codes WHERE assignment_id = OLD.id;
    -- 删除相关的分析记录
    DELETE FROM assignment_analysis WHERE assignment_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 统计作业提交数的函数
CREATE OR REPLACE FUNCTION update_submission_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 可以在这里更新缓存的统计信息
        NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
"""

# === 触发器定义 SQL ===
TRIGGERS_SQL = """
-- 课程 updated_at 触发器
DROP TRIGGER IF EXISTS trg_update_course_updated_at ON courses;
CREATE TRIGGER trg_update_course_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 作业 updated_at 触发器
DROP TRIGGER IF EXISTS trg_update_assignment_updated_at ON assignments;
CREATE TRIGGER trg_update_assignment_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 提交 submitted_at 触发器
DROP TRIGGER IF EXISTS trg_update_submission_submitted_at ON assignment_submissions;
CREATE TRIGGER trg_update_submission_submitted_at
    BEFORE INSERT ON assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_submitted_at_column();

-- 提交分数更新时自动更新分析
DROP TRIGGER IF EXISTS trg_submission_score_update ON assignment_submissions;
CREATE TRIGGER trg_submission_score_update
    AFTER INSERT OR UPDATE OF score ON assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_analysis_score();

-- 删除作业时级联删除
DROP TRIGGER IF EXISTS trg_assignment_cascade_delete ON assignments;
CREATE TRIGGER trg_assignment_cascade_delete
    BEFORE DELETE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION cascade_delete_submissions();
"""


async def init_triggers():
    """初始化触发器函数和触发器"""
    conn = await get_db()
    try:
        # 先创建函数
        for sql in TRIGGER_FUNCTIONS_SQL.split(";"):
            sql = sql.strip()
            if sql:
                await conn.execute(sql)

        # 再创建触发器
        for sql in TRIGGERS_SQL.split(";"):
            sql = sql.strip()
            if sql:
                await conn.execute(sql)
    finally:
        await conn.close()


class TriggerManager:
    """触发器管理"""

    @staticmethod
    async def reinstall_all():
        """重新安装所有触发器"""
        await init_triggers()

    @staticmethod
    async def enable_triggers(enable: bool = True):
        """启用/禁用所有触发器"""
        conn = await get_db()
        try:
            if enable:
                await conn.execute("ALTER TABLE courses ENABLE TRIGGER ALL")
                await conn.execute("ALTER TABLE assignments ENABLE TRIGGER ALL")
                await conn.execute("ALTER TABLE assignment_submissions ENABLE TRIGGER ALL")
            else:
                await conn.execute("ALTER TABLE courses DISABLE TRIGGER ALL")
                await conn.execute("ALTER TABLE assignments DISABLE TRIGGER ALL")
                await conn.execute("ALTER TABLE assignment_submissions DISABLE TRIGGER ALL")
        finally:
            await conn.close()
