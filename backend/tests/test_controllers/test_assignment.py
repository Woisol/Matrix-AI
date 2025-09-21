"""
作业控制器测试
"""
import pytest
import uuid
import json
from datetime import datetime, timezone, timedelta
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi import HTTPException

from app.controller.assignment import AssignmentController
from app.models.assignment import Assignment as AssignmentModel, AssignmentCode, AssignmentSubmission
from app.models.course import Course as CourseModel
from app.schemas.assignment import TestSubmitRequest, SubmitRequest, TestSampleCreate, CodeFileInfo, CodeLanguage
from tests.test_helpers import TestDataGenerator, MockHelpers


class TestAssignmentController:
    """作业控制器测试类"""

    @pytest.mark.asyncio
    async def test_get_assignment_success(self, db):
        """测试成功获取作业"""
        # 创建测试数据
        assignment = await TestDataGenerator.create_test_assignment(title="测试作业")
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        submission = await TestDataGenerator.create_test_assignment_submission(assignment)

        # 调用控制器方法
        result = await AssignmentController.get_assignment(assign_id=assignment.id)

        # 验证结果
        assert result.assignId == assignment.id
        assert result.title == assignment.title
        assert result.description == assignment.description
        assert result.ddl == assignment.end_date
        assert result.submit is not None
        assert result.submit.score == submission.score

    @pytest.mark.asyncio
    async def test_get_assignment_no_code(self, db):
        """测试获取没有代码的作业"""
        # 创建只有作业没有代码的测试数据
        assignment = await TestDataGenerator.create_test_assignment()

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.get_assignment(assign_id=assignment.id)

        assert exc_info.value.status_code == 404
        assert "Code for assignment" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_assignment_not_found(self, db):
        """测试获取不存在的作业"""
        non_existent_id = str(uuid.uuid4())

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.get_assignment(assign_id=non_existent_id)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_assignment_without_submission(self, db):
        """测试获取没有提交记录的作业"""
        # 创建只有作业和代码，没有提交的测试数据
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)

        # 调用控制器方法
        result = await AssignmentController.get_assignment(assign_id=assignment.id)

        # 验证结果
        assert result.assignId == assignment.id
        assert result.submit is None  # 没有提交记录

    @pytest.mark.asyncio
    async def test_set_assignment_create_new(self, db):
        """测试创建新作业"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course()

        title = "新建测试作业"
        description = "这是一个新建的测试作业"
        original_code = '["print(\\"Hello World\\")"]'
        test_sample = TestSampleCreate(
            input=[""],
            expectOutput=["Hello World\\n"]
        )
        ddl = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

        # 调用控制器方法
        result = await AssignmentController.set_assignment(
            assignId=None,
            courseId=course.id,
            title=title,
            description=description,
            assignOriginalCode=original_code,
            testSample=test_sample,
            ddl=ddl
        )

        # 验证结果
        assert result is True

        # 验证作业确实被创建
        assignments = await AssignmentModel.filter(title=title).all()
        assert len(assignments) == 1
        created_assignment = assignments[0]
        assert created_assignment.title == title
        assert created_assignment.description == description

        # 验证作业代码被创建
        codes = await created_assignment.codes.all()
        assert len(codes) == 1
        assert codes[0].original_code == original_code

    @pytest.mark.asyncio
    async def test_set_assignment_update_existing(self, db):
        """测试更新现有作业"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(title="原始作业")
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        # 更新数据
        new_title = "更新后的作业"
        new_description = "更新后的描述"
        new_code = '["print(\\"Updated Hello World\\")"]'
        new_test_sample = TestSampleCreate(
            input=["updated"],
            expectOutput=["Updated Hello World\\n"]
        )
        new_ddl = (datetime.now(timezone.utc) + timedelta(days=10)).isoformat()

        # 调用控制器方法
        result = await AssignmentController.set_assignment(
            assignId=assignment.id,
            courseId=course.id,
            title=new_title,
            description=new_description,
            assignOriginalCode=new_code,
            testSample=new_test_sample,
            ddl=new_ddl
        )

        # 验证结果
        assert result is True

        # 验证作业被更新
        updated_assignment = await AssignmentModel.get(id=assignment.id).prefetch_related("codes")
        assert updated_assignment.title == new_title
        assert updated_assignment.description == new_description

        # 验证代码被更新
        codes = await updated_assignment.codes.all()
        assert len(codes) == 1
        assert codes[0].original_code == new_code

    @pytest.mark.asyncio
    async def test_set_assignment_course_not_found(self, db):
        """测试在不存在的课程中创建作业"""
        non_existent_course_id = str(uuid.uuid4())

        test_sample = TestSampleCreate(
            input=[""],
            expectOutput=["Hello World\\n"]
        )

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.set_assignment(
                assignId=None,
                courseId=non_existent_course_id,
                title="测试作业",
                description="测试描述",
                assignOriginalCode='["print(\\"test\\")"]',
                testSample=test_sample,
                ddl=None
            )

        assert exc_info.value.status_code == 404
        assert "Course with id" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_delete_assignment_success(self, db):
        """测试成功删除作业"""
        # 创建测试作业
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment()
        await course.assignments.add(assignment)
        assignment_id = assignment.id

        # 调用控制器方法
        result = await AssignmentController.delete_assignment(
            course_id=course.id,
            assign_id=assignment_id
        )

        # 验证结果
        assert result is True

        # 验证作业确实被删除
        with pytest.raises(Exception):  # DoesNotExist
            await AssignmentModel.get(id=assignment_id)

    @pytest.mark.asyncio
    async def test_delete_assignment_not_found(self, db):
        """测试删除不存在的作业"""
        course = await TestDataGenerator.create_test_course()
        non_existent_id = str(uuid.uuid4())

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.delete_assignment(
                course_id=course.id,
                assign_id=non_existent_id
            )

        assert exc_info.value.status_code == 404
        assert "Assignment with id" in exc_info.value.detail

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.run_code')
    async def test_test_submit_success(self, mock_run_code, db):
        """测试代码测试提交成功"""
        # Mock代码执行结果
        expected_output = "Hello World\\n"
        mock_run_code.return_value = expected_output

        # 创建测试请求
        from app.schemas.assignment import CodeLanguage

        code_file = CodeFileInfo(
            fileName="test.cpp",
            content="#include <iostream>\nint main() { return 0; }"
        )

        test_request = TestSubmitRequest(
            codeFile=code_file,
            input="",
            language=CodeLanguage.C_CPP
        )

        # 调用控制器方法
        result = await AssignmentController.test_submit(submitRequest=test_request)

        # 验证结果
        assert result == expected_output
        mock_run_code.assert_called_once_with(
            code=code_file.content,
            input=test_request.input,
            language=test_request.language
        )

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.run_code')
    async def test_test_submit_error(self, mock_run_code, db):
        """测试代码测试提交失败"""
        # Mock代码执行异常
        mock_run_code.side_effect = Exception("Code execution failed")

        code_file = CodeFileInfo(
            fileName="test.cpp",
            content="invalid code"
        )

        test_request = TestSubmitRequest(
            codeFile=code_file,
            input="",
            language=CodeLanguage.C_CPP
        )

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.test_submit(submitRequest=test_request)

        assert exc_info.value.status_code == 500
        assert "Internal server error" in exc_info.value.detail

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.judge_code')
    async def test_submit_code_success_new_submission(self, mock_judge_code, db):
        """测试代码提交成功（新提交）"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(
            end_date=datetime.now(timezone.utc) + timedelta(days=7)  # 未过期
        )
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        # Mock判题结果
        from app.schemas.assignment import JudgeResult
        mock_judge_result = JudgeResult(
            score=100.0,
            testRealOutput=["Hello World\\n"]
        )
        mock_judge_code.return_value = mock_judge_result

        # 创建提交请求
        code_file = CodeFileInfo(
            fileName="solution.cpp",
            content="#include <iostream>\nint main() { std::cout << \"Hello World\" << std::endl; return 0; }"
        )

        submit_request = SubmitRequest(codeFile=code_file)

        # 调用控制器方法
        result = await AssignmentController.submit_code(
            course_id=course.id,
            assign_id=assignment.id,
            submitRequest=submit_request
        )

        # 验证结果
        assert result.score == 100.0
        assert result.submitCode[0].fileName == code_file.fileName

        # 验证提交记录被创建
        submissions = await assignment.submissions.all()
        assert len(submissions) == 1
        assert submissions[0].score == 100.0

    @pytest.mark.asyncio
    async def test_submit_code_deadline_passed(self, db):
        """测试提交代码时截止日期已过"""
        # 创建已过期的作业
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(
            end_date=datetime.now(timezone.utc) - timedelta(days=1)  # 已过期
        )
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        code_file = CodeFileInfo(
            fileName="solution.cpp",
            content="#include <iostream>\nint main() { std::cout << \"Hello World\" << std::endl; return 0; }"
        )

        submit_request = SubmitRequest(codeFile=code_file)

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.submit_code(
                course_id=course.id,
                assign_id=assignment.id,
                submitRequest=submit_request
            )

        assert exc_info.value.status_code == 400
        assert "Deadline has passed" in exc_info.value.detail

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.judge_code')
    async def test_submit_code_update_existing_submission(self, mock_judge_code, db):
        """测试代码提交成功（更新现有提交）"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(
            end_date=datetime.now(timezone.utc) + timedelta(days=7)
        )
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        existing_submission = await TestDataGenerator.create_test_assignment_submission(
            assignment=assignment,
            score=50.0
        )
        await course.assignments.add(assignment)

        # Mock新的判题结果
        from app.schemas.assignment import JudgeResult
        mock_judge_result = JudgeResult(
            score=95.0,
            testRealOutput=["Updated Hello World\\n"]
        )
        mock_judge_code.return_value = mock_judge_result

        code_file = CodeFileInfo(
            fileName="updated_solution.cpp",
            content="#include <iostream>\nint main() { std::cout << \"Updated Hello World\" << std::endl; return 0; }"
        )

        submit_request = SubmitRequest(codeFile=code_file)

        # 调用控制器方法
        result = await AssignmentController.submit_code(
            course_id=course.id,
            assign_id=assignment.id,
            submitRequest=submit_request
        )

        # 验证结果
        assert result.score == 95.0

        # 验证提交记录被更新（而不是创建新的）
        submissions = await assignment.submissions.all()
        assert len(submissions) == 1  # 仍然只有一个提交记录
        assert submissions[0].score == 95.0  # 分数被更新

    @pytest.mark.asyncio
    async def test_submit_code_no_assignment_code(self, db):
        """测试提交代码时作业没有代码配置"""
        # 创建没有代码的作业
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment()
        await course.assignments.add(assignment)

        code_file = CodeFileInfo(
            fileName="solution.cpp",
            content="#include <iostream>\nint main() { std::cout << \"Hello World\" << std::endl; return 0; }"
        )

        submit_request = SubmitRequest(codeFile=code_file)

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await AssignmentController.submit_code(
                course_id=course.id,
                assign_id=assignment.id,
                submitRequest=submit_request
            )

        assert exc_info.value.status_code == 404
        assert "Code for assignment" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_assignment_controller_json_handling(self, db):
        """测试JSON数据处理"""
        course = await TestDataGenerator.create_test_course()

        # 测试有效的JSON数据
        valid_original_code = '["print(\\"test\\")"]'
        test_sample = TestSampleCreate(
            input=["test_input"],
            expectOutput=["test_output"]
        )

        result = await AssignmentController.set_assignment(
            assignId=None,
            courseId=course.id,
            title="JSON测试作业",
            description="测试JSON处理",
            assignOriginalCode=valid_original_code,
            testSample=test_sample,
            ddl=None
        )

        assert result is True

        # 验证数据正确保存
        assignments = await AssignmentModel.filter(title="JSON测试作业").all()
        assignment = assignments[0]
        codes = await assignment.codes.all()
        assert codes[0].original_code == valid_original_code

    @pytest.mark.asyncio
    async def test_assignment_workflow_integration(self, db):
        """测试作业完整工作流程集成"""
        # 1. 创建课程
        course = await TestDataGenerator.create_test_course(course_name="集成测试课程")

        # 2. 创建作业
        test_sample = TestSampleCreate(
            input=[""],
            expectOutput=["Hello Integration\\n"]
        )

        create_result = await AssignmentController.set_assignment(
            assignId=None,
            courseId=course.id,
            title="集成测试作业",
            description="这是一个集成测试作业",
            assignOriginalCode='["print(\\"Hello Integration\\")"]',
            testSample=test_sample,
            ddl=(datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        )
        assert create_result is True

        # 3. 获取创建的作业
        assignments = await AssignmentModel.filter(title="集成测试作业").all()
        assignment = assignments[0]

        get_result = await AssignmentController.get_assignment(assign_id=assignment.id)
        assert get_result.title == "集成测试作业"

        # 4. 删除作业
        delete_result = await AssignmentController.delete_assignment(
            course_id=course.id,
            assign_id=assignment.id
        )
        assert delete_result is True