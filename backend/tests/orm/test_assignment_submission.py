"""
作业提交表测试 - assignment_submissions 表 CRUD 和外键关系验证
"""
import unittest
from datetime import datetime
from tests.orm.conftest import AsyncORMTestCase


class TestAssignmentSubmissionTable(AsyncORMTestCase):
    """作业提交表测试类"""

    async def test_create_submission(self):
        """测试创建提交记录"""
        # 先创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_sub_001", "提交测试作业", "program"
        )

        # 创建提交记录
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id, score, sample_real_output, submit_code) "
            "VALUES ($1, $2, $3, $4, $5, $6)",
            "sub_001", "assign_for_sub_001", "student_001", 85.5,
            '["output1", "output2"]',
            'print("solution")'
        )

        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_001"
        )
        self.assertIsNotNone(submission)
        self.assertEqual(submission['id'], "sub_001")
        self.assertEqual(submission['assignment_id'], "assign_for_sub_001")
        self.assertEqual(submission['student_id'], "student_001")
        self.assertEqual(submission['score'], 85.5)
        self.assertEqual(submission['sample_real_output'], '["output1", "output2"]')
        self.assertEqual(submission['submit_code'], 'print("solution")')

    async def test_submission_fk_constraint(self):
        """测试提交记录外键约束"""
        # 尝试创建引用不存在的作业的提交记录
        with self.assertRaises(Exception):
            await self.execute(
                "INSERT INTO assignment_submissions (id, assignment_id, student_id) "
                "VALUES ($1, $2, $3)",
                "sub_fk_test", "nonexistent_assign", "student_001"
            )

    async def test_submission_score_field(self):
        """测试分数字段"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_score", "分数测试作业", "program"
        )

        # 0 分
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id, score) VALUES ($1, $2, $3, $4)",
            "sub_score_0", "assign_for_score", "student_001", 0.0
        )

        # 100 分
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id, score) VALUES ($1, $2, $3, $4)",
            "sub_score_100", "assign_for_score", "student_002", 100.0
        )

        # 未评分 (NULL)
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id) VALUES ($1, $2, $3)",
            "sub_score_null", "assign_for_score", "student_003"
        )

        sub_0 = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_score_0"
        )
        sub_100 = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_score_100"
        )
        sub_null = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_score_null"
        )

        self.assertEqual(sub_0['score'], 0.0)
        self.assertEqual(sub_100['score'], 100.0)
        self.assertIsNone(sub_null['score'])

    async def test_submission_field_constraints(self):
        """测试提交记录字段长度限制"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_long_sub", "长字段测试作业", "program"
        )

        # id 最大 50 字符
        long_id = "s" * 50
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id) VALUES ($1, $2, $3)",
            long_id, "assign_for_long_sub", "student_001"
        )
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            long_id
        )
        self.assertIsNotNone(submission)
        self.assertEqual(len(submission['id']), 50)

        # student_id 最大 50 字符
        long_student = "t" * 50
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id) VALUES ($1, $2, $3)",
            "sub_long_student", "assign_for_long_sub", long_student
        )
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_long_student"
        )
        self.assertIsNotNone(submission)
        self.assertEqual(len(submission['student_id']), 50)

        # sample_real_output 最大 10000 字符
        long_output = "o" * 10000
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id, sample_real_output) VALUES ($1, $2, $3, $4)",
            "sub_long_output", "assign_for_long_sub", "student_002", long_output
        )
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_long_output"
        )
        self.assertIsNotNone(submission)
        self.assertEqual(len(submission['sample_real_output']), 10000)

        # submit_code 最大 10000 字符
        long_code = "c" * 10000
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id, submit_code) VALUES ($1, $2, $3, $4)",
            "sub_long_code", "assign_for_long_sub", "student_003", long_code
        )
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_long_code"
        )
        self.assertIsNotNone(submission)
        self.assertEqual(len(submission['submit_code']), 10000)

    async def test_submission_read_write(self):
        """测试提交记录读写操作"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_sub_rw", "读写测试作业", "program"
        )

        # 创建
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id, score) VALUES ($1, $2, $3, $4)",
            "sub_rw", "assign_for_sub_rw", "student_001", 0.0
        )

        # 读取
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_rw"
        )
        self.assertIsNotNone(submission)
        self.assertEqual(submission['score'], 0.0)

        # 更新
        await self.execute(
            "UPDATE assignment_submissions SET score = $1, sample_real_output = $2, submit_code = $3 WHERE id = $4",
            95.0, '["updated_output"]', 'print("updated")', "sub_rw"
        )

        updated = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_rw"
        )
        self.assertEqual(updated['score'], 95.0)
        self.assertEqual(updated['sample_real_output'], '["updated_output"]')
        self.assertEqual(updated['submit_code'], 'print("updated")')

    async def test_submission_timestamp(self):
        """测试提交记录时间戳"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_sub_ts", "时间戳测试作业", "program"
        )

        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id) VALUES ($1, $2, $3)",
            "sub_ts", "assign_for_sub_ts", "student_001"
        )

        submission = await self.fetchrow(
            "SELECT submitted_at FROM assignment_submissions WHERE id = $1",
            "sub_ts"
        )

        # 验证时间戳字段存在且不为 NULL
        self.assertIsNotNone(submission['submitted_at'])

    async def test_multiple_submissions_for_assignment(self):
        """测试一个作业可以有多个提交记录"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_multi_sub", "多提交测试作业", "program"
        )

        # 多个学生提交
        for i in range(5):
            await self.execute(
                "INSERT INTO assignment_submissions (id, assignment_id, student_id, score) VALUES ($1, $2, $3, $4)",
                f"sub_multi_{i}", "assign_multi_sub", f"student_{i:03d}", 60.0 + i * 8
            )

        # 验证所有提交都属于同一个作业
        submissions = await self.fetchall(
            "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY id",
            "assign_multi_sub"
        )
        self.assertEqual(len(submissions), 5)
        for i, sub in enumerate(submissions):
            self.assertEqual(sub['assignment_id'], "assign_multi_sub")
            self.assertEqual(sub['student_id'], f"student_{i:03d}")
            self.assertEqual(sub['score'], 60.0 + i * 8)

    async def test_submission_delete(self):
        """测试删除提交记录"""
        # 创建父作业和提交
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_sub_delete", "删除提交测试", "program"
        )
        await self.execute(
            "INSERT INTO assignment_submissions (id, assignment_id, student_id) VALUES ($1, $2, $3)",
            "sub_delete", "assign_for_sub_delete", "student_001"
        )

        # 验证存在
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_delete"
        )
        self.assertIsNotNone(submission)

        # 删除
        await self.execute(
            "DELETE FROM assignment_submissions WHERE id = $1",
            "sub_delete"
        )

        # 验证删除
        submission = await self.fetchrow(
            "SELECT * FROM assignment_submissions WHERE id = $1",
            "sub_delete"
        )
        self.assertIsNone(submission)


if __name__ == '__main__':
    unittest.main()
