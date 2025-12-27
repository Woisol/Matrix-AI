"""
SQL 视图定义 - 复杂查询封装
"""
from app.models.base import fetch_all, fetch_one, get_db


# === 视图定义 SQL ===
VIEWS_SQL = """
-- 作业详情视图（包含课程ID、测试样例、截止时间）
CREATE OR REPLACE VIEW v_assignment_detail AS
SELECT
    a.id AS assignment_id,
    a.title,
    a.description,
    a.end_date AS ddl,
    a.type AS assignment_type,
    ca.courses_id AS course_id,
    ac.sample_input,
    ac.sample_expect_output,
    ac.original_code
FROM assignments a
LEFT JOIN courses_assignments ca ON a.id = ca.assignment_id
LEFT JOIN assignment_codes ac ON a.id = ac.assignment_id;
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


class AssignmentDetail:
    """作业详情视图"""

    @staticmethod
    async def get_by_assignment(assignment_id: str):
        """获取指定作业的详情"""
        row = await fetch_one(
            "SELECT * FROM v_assignment_detail WHERE assignment_id = $1",
            assignment_id
        )
        return row
