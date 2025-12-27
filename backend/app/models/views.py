"""
SQL 视图定义 - 复杂查询封装
"""
from app.models.base import fetch_all, fetch_one, get_db
import json


# === 视图定义 SQL ===
VIEWS_SQL = """
-- 课程作业统计视图
CREATE OR REPLACE VIEW v_course_assignment_stats AS
SELECT
    c.id AS course_id,
    c.course_name,
    COUNT(DISTINCT a.id) AS assignment_count,
    COUNT(DISTINCT s.id) AS submission_count,
    COALESCE(AVG(s.score), 0) AS avg_score,
    COUNT(DISTINCT s.student_id) AS student_count
FROM courses c
LEFT JOIN courses_assignments ca ON c.id = ca.courses_id
LEFT JOIN assignments a ON ca.assignment_id = a.id
LEFT JOIN assignment_submissions s ON a.id = s.assignment_id
GROUP BY c.id, c.course_name;

-- 作业统计视图
CREATE OR REPLACE VIEW v_assignment_stats AS
SELECT
    a.id AS assignment_id,
    a.title,
    a.type,
    COUNT(DISTINCT ac.id) AS code_count,
    COUNT(DISTINCT s.id) AS submission_count,
    COALESCE(AVG(s.score), 0) AS avg_score,
    MIN(s.submitted_at) AS first_submission,
    MAX(s.submitted_at) AS last_submission
FROM assignments a
LEFT JOIN assignment_codes ac ON a.id = ac.assignment_id
LEFT JOIN assignment_submissions s ON a.id = s.assignment_id
GROUP BY a.id, a.title, a.type;

-- 学生提交统计视图
CREATE OR REPLACE VIEW v_student_submission_stats AS
SELECT
    s.assignment_id,
    s.student_id,
    COUNT(*) AS submission_count,
    COALESCE(MAX(s.score), 0) AS max_score,
    COALESCE(AVG(s.score), 0) AS avg_score,
    MIN(s.submitted_at) AS first_submit,
    MAX(s.submitted_at) AS last_submit
FROM assignment_submissions s
GROUP BY s.assignment_id, s.student_id;
"""


async def init_views():
    """初始化视图"""
    conn = await get_db()
    try:
        for sql in VIEWS_SQL.split(";"):
            sql = sql.strip()
            if sql:
                await conn.execute(sql)
    finally:
        await conn.close()


class CourseAssignmentStats:
    """课程作业统计视图"""

    @staticmethod
    async def get_all():
        """获取所有课程统计"""
        rows = await fetch_all("SELECT * FROM v_course_assignment_stats ORDER BY courses_id")
        return rows

    @staticmethod
    async def get_by_course(course_id: str):
        """获取指定课程统计"""
        row = await fetch_one(
            "SELECT * FROM v_course_assignment_stats WHERE courses_id = $1",
            course_id
        )
        return row


class AssignmentStats:
    """作业统计视图"""

    @staticmethod
    async def get_all():
        """获取所有作业统计"""
        rows = await fetch_all("SELECT * FROM v_assignment_stats ORDER BY assignment_id")
        return rows

    @staticmethod
    async def get_by_assignment(assignment_id: str):
        """获取指定作业统计"""
        row = await fetch_one(
            "SELECT * FROM v_assignment_stats WHERE assignment_id = $1",
            assignment_id
        )
        return row


class StudentSubmissionStats:
    """学生提交统计视图"""

    @staticmethod
    async def get_by_assignment(assignment_id: str):
        """获取指定作业的学生提交统计"""
        rows = await fetch_all(
            "SELECT * FROM v_student_submission_stats WHERE assignment_id = $1 ORDER BY student_id",
            assignment_id
        )
        return rows

    @staticmethod
    async def get_by_student(student_id: str):
        """获取指定学生的所有提交统计"""
        rows = await fetch_all(
            "SELECT * FROM v_student_submission_stats WHERE student_id = $1 ORDER BY assignment_id",
            student_id
        )
        return rows
