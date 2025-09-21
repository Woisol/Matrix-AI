"""
作业模型测试
"""
import pytest
import uuid
from datetime import datetime, timezone, timedelta

from app.models.assignment import Assignment, AssignmentCode, AssignmentSubmission, AssignTypeEnum, SubmitScoreStatusEnum
from app.models.course import Course
from tests.test_helpers import TestDataGenerator, AssertionHelpers


class TestAssignmentModel:
    """作业模型测试类"""

    @pytest.mark.asyncio
    async def test_create_assignment(self, db):
        """测试创建作业"""
        assignment_id = str(uuid.uuid4())
        title = "测试作业"
        description = "这是一个测试作业"
        assign_type = AssignTypeEnum.PROGRAM
        start_date = datetime.now(timezone.utc)
        end_date = start_date + timedelta(days=7)

        assignment = await Assignment.create(
            id=assignment_id,
            title=title,
            description=description,
            type=assign_type,
            start_date=start_date,
            end_date=end_date
        )

        assert assignment.id == assignment_id
        assert assignment.title == title
        assert assignment.description == description
        assert assignment.type == assign_type
        assert assignment.start_date == start_date
        assert assignment.end_date == end_date
        assert isinstance(assignment.created_at, datetime)
        assert isinstance(assignment.updated_at, datetime)

    @pytest.mark.asyncio
    async def test_create_assignment_with_enum_types(self, db):
        """测试使用枚举类型创建作业"""
        # 测试 PROGRAM 类型
        program_assignment = await TestDataGenerator.create_test_assignment(
            type=AssignTypeEnum.PROGRAM
        )
        assert program_assignment.type == AssignTypeEnum.PROGRAM

        # 测试 CHOOSE 类型
        choose_assignment = await TestDataGenerator.create_test_assignment(
            type=AssignTypeEnum.CHOOSE
        )
        assert choose_assignment.type == AssignTypeEnum.CHOOSE

    @pytest.mark.asyncio
    async def test_get_assignment_by_id(self, db):
        """测试通过ID获取作业"""
        assignment = await TestDataGenerator.create_test_assignment()

        retrieved_assignment = await Assignment.get(id=assignment.id)

        assert retrieved_assignment.id == assignment.id
        assert retrieved_assignment.title == assignment.title
        assert retrieved_assignment.description == assignment.description
        assert retrieved_assignment.type == assignment.type

    @pytest.mark.asyncio
    async def test_update_assignment(self, db):
        """测试更新作业"""
        assignment = await TestDataGenerator.create_test_assignment()

        new_title = "更新后的作业标题"
        new_description = "更新后的作业描述"
        new_end_date = assignment.end_date + timedelta(days=3)

        assignment.title = new_title
        assignment.description = new_description
        assignment.end_date = new_end_date
        old_updated_at = assignment.updated_at
        await assignment.save()

        # 重新获取作业验证更新
        updated_assignment = await Assignment.get(id=assignment.id)
        assert updated_assignment.title == new_title
        assert updated_assignment.description == new_description
        assert updated_assignment.end_date == new_end_date
        assert updated_assignment.updated_at > old_updated_at

    @pytest.mark.asyncio
    async def test_delete_assignment(self, db):
        """测试删除作业"""
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_id = assignment.id

        await assignment.delete()

        # 验证作业已被删除
        with pytest.raises(Exception):  # DoesNotExist
            await Assignment.get(id=assignment_id)

    @pytest.mark.asyncio
    async def test_assignment_str_representation(self, db):
        """测试作业的字符串表示"""
        assignment = await TestDataGenerator.create_test_assignment(title="字符串测试作业")

        str_repr = str(assignment)
        assert "Assignment" in str_repr
        assert assignment.id in str_repr
        assert assignment.title in str_repr


class TestAssignmentCodeModel:
    """作业代码模型测试类"""

    @pytest.mark.asyncio
    async def test_create_assignment_code(self, db):
        """测试创建作业代码"""
        assignment = await TestDataGenerator.create_test_assignment()

        code_id = str(uuid.uuid4())
        original_code = '["print(\\"Hello World\\")"]'
        sample_input = '[""]'
        sample_expect_output = '["Hello World\\n"]'

        assignment_code = await AssignmentCode.create(
            id=code_id,
            assignment=assignment,
            original_code=original_code,
            sample_input=sample_input,
            sample_expect_output=sample_expect_output
        )

        assert assignment_code.id == code_id
        assert assignment_code.assignment.id == assignment.id
        assert assignment_code.original_code == original_code
        assert assignment_code.sample_input == sample_input
        assert assignment_code.sample_expect_output == sample_expect_output

    @pytest.mark.asyncio
    async def test_assignment_code_relationship(self, db):
        """测试作业代码关系"""
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)

        # 通过作业获取代码
        codes = await assignment.codes.all()
        assert len(codes) == 1
        assert codes[0].id == assignment_code.id

    @pytest.mark.asyncio
    async def test_assignment_with_prefetch_codes(self, db):
        """测试预加载代码的作业查询"""
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)

        # 使用预加载查询
        assignment_with_codes = await Assignment.get(id=assignment.id).prefetch_related("codes")

        assert assignment_with_codes.id == assignment.id
        codes = await assignment_with_codes.codes.all()
        assert len(codes) == 1
        assert codes[0].id == assignment_code.id

    @pytest.mark.asyncio
    async def test_assignment_code_str_representation(self, db):
        """测试作业代码的字符串表示"""
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)

        str_repr = str(assignment_code)
        assert "AssignmentCode" in str_repr
        assert assignment_code.id in str_repr
        assert assignment.id in str_repr


class TestAssignmentSubmissionModel:
    """作业提交模型测试类"""

    @pytest.mark.asyncio
    async def test_create_assignment_submission(self, db):
        """测试创建作业提交"""
        assignment = await TestDataGenerator.create_test_assignment()

        submission_id = str(uuid.uuid4())
        student_id = str(uuid.uuid4())
        score = 85.5
        sample_real_output = '["Hello World\\n"]'
        submit_code = '["print(\\"Hello World\\")"]'

        submission = await AssignmentSubmission.create(
            id=submission_id,
            assignment=assignment,
            student_id=student_id,
            score=score,
            sample_real_output=sample_real_output,
            submit_code=submit_code
        )

        assert submission.id == submission_id
        assert submission.assignment.id == assignment.id
        assert submission.student_id == student_id
        assert submission.score == score
        assert submission.sample_real_output == sample_real_output
        assert submission.submit_code == submit_code
        assert isinstance(submission.submitted_at, datetime)

    @pytest.mark.asyncio
    async def test_assignment_submission_relationship(self, db):
        """测试作业提交关系"""
        assignment = await TestDataGenerator.create_test_assignment()
        submission = await TestDataGenerator.create_test_assignment_submission(assignment)

        # 通过作业获取提交
        submissions = await assignment.submissions.all()
        assert len(submissions) == 1
        assert submissions[0].id == submission.id

    @pytest.mark.asyncio
    async def test_multiple_submissions_per_assignment(self, db):
        """测试一个作业的多个提交"""
        assignment = await TestDataGenerator.create_test_assignment()

        # 创建多个提交
        submissions = []
        for i in range(3):
            submission = await TestDataGenerator.create_test_assignment_submission(
                assignment=assignment,
                student_id=f"student_{i}",
                score=80.0 + i * 5
            )
            submissions.append(submission)

        # 验证所有提交都关联到同一个作业
        assignment_submissions = await assignment.submissions.all()
        assert len(assignment_submissions) == 3

        submission_ids = [sub.id for sub in assignment_submissions]
        for submission in submissions:
            assert submission.id in submission_ids

    @pytest.mark.asyncio
    async def test_assignment_with_prefetch_submissions(self, db):
        """测试预加载提交的作业查询"""
        assignment = await TestDataGenerator.create_test_assignment()
        submission = await TestDataGenerator.create_test_assignment_submission(assignment)

        # 使用预加载查询
        assignment_with_submissions = await Assignment.get(id=assignment.id).prefetch_related("submissions")

        assert assignment_with_submissions.id == assignment.id
        submissions = await assignment_with_submissions.submissions.all()
        assert len(submissions) == 1
        assert submissions[0].id == submission.id

    @pytest.mark.asyncio
    async def test_assignment_submission_str_representation(self, db):
        """测试作业提交的字符串表示"""
        assignment = await TestDataGenerator.create_test_assignment()
        submission = await TestDataGenerator.create_test_assignment_submission(assignment)

        str_repr = str(submission)
        assert "AssignmentSubmission" in str_repr
        assert submission.id in str_repr
        assert assignment.id in str_repr
        assert submission.student_id in str_repr


class TestAssignmentRelationships:
    """作业关系测试类"""

    @pytest.mark.asyncio
    async def test_full_assignment_workflow(self, db):
        """测试完整的作业工作流"""
        # 创建课程
        course = await TestDataGenerator.create_test_course()

        # 创建作业
        assignment = await TestDataGenerator.create_test_assignment()
        await course.assignments.add(assignment)

        # 创建作业代码
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)

        # 创建作业提交
        submission = await TestDataGenerator.create_test_assignment_submission(assignment)

        # 验证所有关系
        # 1. 课程包含作业
        course_assignments = await course.assignments.all()
        assert len(course_assignments) == 1
        assert course_assignments[0].id == assignment.id

        # 2. 作业包含代码
        assignment_codes = await assignment.codes.all()
        assert len(assignment_codes) == 1
        assert assignment_codes[0].id == assignment_code.id

        # 3. 作业包含提交
        assignment_submissions = await assignment.submissions.all()
        assert len(assignment_submissions) == 1
        assert assignment_submissions[0].id == submission.id

    @pytest.mark.asyncio
    async def test_cascade_delete_behavior(self, db):
        """测试级联删除行为"""
        # 创建完整的作业结构
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        submission = await TestDataGenerator.create_test_assignment_submission(assignment)

        # 删除作业
        await assignment.delete()

        # 验证相关的代码和提交是否被正确处理
        # 注意：具体行为取决于外键约束配置
        # 这里我们只验证作业确实被删除了
        with pytest.raises(Exception):  # DoesNotExist
            await Assignment.get(id=assignment.id)

    @pytest.mark.asyncio
    async def test_assignment_filter_operations(self, db):
        """测试作业过滤操作"""
        # 创建不同类型的作业
        program_assignment = await TestDataGenerator.create_test_assignment(
            title="编程作业",
            type=AssignTypeEnum.PROGRAM
        )
        choose_assignment = await TestDataGenerator.create_test_assignment(
            title="选择题作业",
            type=AssignTypeEnum.CHOOSE
        )

        # 按类型过滤
        program_assignments = await Assignment.filter(type=AssignTypeEnum.PROGRAM).all()
        program_ids = [assign.id for assign in program_assignments]
        assert program_assignment.id in program_ids

        choose_assignments = await Assignment.filter(type=AssignTypeEnum.CHOOSE).all()
        choose_ids = [assign.id for assign in choose_assignments]
        assert choose_assignment.id in choose_ids

    @pytest.mark.asyncio
    async def test_assignment_date_filters(self, db):
        """测试作业日期过滤"""
        now = datetime.now(timezone.utc)
        past_date = now - timedelta(days=10)
        future_date = now + timedelta(days=10)

        # 创建过期和未过期的作业
        expired_assignment = await TestDataGenerator.create_test_assignment(
            title="过期作业",
            end_date=past_date
        )
        active_assignment = await TestDataGenerator.create_test_assignment(
            title="活跃作业",
            end_date=future_date
        )

        # 过滤过期作业
        expired_assignments = await Assignment.filter(end_date__lt=now).all()
        expired_ids = [assign.id for assign in expired_assignments]
        assert expired_assignment.id in expired_ids

        # 过滤活跃作业
        active_assignments = await Assignment.filter(end_date__gt=now).all()
        active_ids = [assign.id for assign in active_assignments]
        assert active_assignment.id in active_ids