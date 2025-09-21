"""
测试工具和助手函数
"""
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from faker import Faker

from app.models.course import Course
from app.models.assignment import Assignment, AssignmentCode, AssignmentSubmission, AssignTypeEnum, SubmitScoreStatusEnum
from app.models.user import User
from app.models.analysis import Analysis


fake = Faker("zh_CN")


class TestDataGenerator:
    """测试数据生成器"""

    @staticmethod
    async def create_test_user(
        username: Optional[str] = None,
        code_style: Optional[str] = None,
        knowledge_status: Optional[str] = None
    ) -> User:
        """创建测试用户"""
        return await User.create(
            username=username or fake.user_name(),
            code_style=code_style or fake.text(max_nb_chars=200),
            knowledge_status=knowledge_status or fake.text(max_nb_chars=200)
        )

    @staticmethod
    async def create_test_course(
        course_id: Optional[str] = None,
        course_name: Optional[str] = None,
        type: str = "public",
        status: str = "open",
        completed: bool = False
    ) -> Course:
        """创建测试课程"""
        return await Course.create(
            id=course_id or str(uuid.uuid4()),
            course_name=course_name or fake.catch_phrase(),
            type=type,
            status=status,
            completed=completed
        )

    @staticmethod
    async def create_test_assignment(
        assignment_id: Optional[str] = None,
        title: Optional[str] = None,
        description: Optional[str] = None,
        type: AssignTypeEnum = AssignTypeEnum.PROGRAM,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Assignment:
        """创建测试作业"""
        return await Assignment.create(
            id=assignment_id or str(uuid.uuid4()),
            title=title or fake.sentence(nb_words=4),
            description=description or fake.text(max_nb_chars=500),
            type=type,
            start_date=start_date or datetime.now(timezone.utc),
            end_date=end_date or (datetime.now(timezone.utc) + timedelta(days=7))
        )

    @staticmethod
    async def create_test_assignment_code(
        assignment: Assignment,
        original_code: Optional[str] = None,
        sample_input: Optional[str] = None,
        sample_expect_output: Optional[str] = None
    ) -> AssignmentCode:
        """创建测试作业代码"""
        return await AssignmentCode.create(
            id=str(uuid.uuid4()),
            assignment=assignment,
            original_code=original_code or '["print(\\"Hello World\\")"]',
            sample_input=sample_input or '[""]',
            sample_expect_output=sample_expect_output or '["Hello World\\n"]'
        )

    @staticmethod
    async def create_test_assignment_submission(
        assignment: Assignment,
        student_id: Optional[str] = None,
        score: Optional[float] = None,
        sample_real_output: Optional[str] = None,
        submit_code: Optional[str] = None
    ) -> AssignmentSubmission:
        """创建测试作业提交"""
        return await AssignmentSubmission.create(
            id=str(uuid.uuid4()),
            assignment=assignment,
            student_id=student_id or str(uuid.uuid4()),
            score=score or fake.random.uniform(0, 100),
            sample_real_output=sample_real_output or '["Hello World\\n"]',
            submit_code=submit_code or '["print(\\"Hello World\\")"]'
        )

    @staticmethod
    async def create_test_analysis(
        assignment: Assignment,
        resolution: Optional[Dict[str, Any]] = None,
        knowledge_analysis: Optional[Dict[str, Any]] = None,
        code_analysis: Optional[Dict[str, Any]] = None,
        learning_suggestions: Optional[Dict[str, Any]] = None
    ) -> Analysis:
        """创建测试分析"""
        return await Analysis.create(
            assignment=assignment,
            resolution=resolution or {"solution": fake.text()},
            knowledge_analysis=knowledge_analysis or {"knowledge": fake.text()},
            code_analysis=code_analysis or {"code": fake.text()},
            learning_suggestions=learning_suggestions or {"suggestions": fake.text()}
        )

    @staticmethod
    async def create_full_test_course_with_assignment(
        course_name: Optional[str] = None,
        assignment_title: Optional[str] = None
    ) -> tuple[Course, Assignment, AssignmentCode]:
        """创建完整的测试课程（包含作业和代码）"""
        # 创建课程
        course = await TestDataGenerator.create_test_course(course_name=course_name)

        # 创建作业
        assignment = await TestDataGenerator.create_test_assignment(title=assignment_title)

        # 建立课程和作业的关系
        await course.assignments.add(assignment)

        # 创建作业代码
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)

        return course, assignment, assignment_code


class AssertionHelpers:
    """断言助手类"""

    @staticmethod
    def assert_course_data(actual: Dict[str, Any], expected: Course):
        """断言课程数据"""
        assert actual["courseId"] == expected.id
        assert actual["courseName"] == expected.course_name
        assert actual["completed"] == expected.completed

    @staticmethod
    def assert_assignment_data(actual: Dict[str, Any], expected: Assignment):
        """断言作业数据"""
        assert actual["assignId"] == expected.id
        assert actual["title"] == expected.title
        assert actual["description"] == expected.description
        assert actual["type"] == expected.type.value

    @staticmethod
    def assert_response_success(response, expected_status: int = 200):
        """断言响应成功"""
        assert response.status_code == expected_status
        if response.status_code != 204:  # No Content 响应没有 body
            assert response.json() is not None

    @staticmethod
    def assert_response_error(response, expected_status: int, expected_detail: str = None):
        """断言响应错误"""
        assert response.status_code == expected_status
        if expected_detail:
            error_data = response.json()
            assert "detail" in error_data
            assert expected_detail in error_data["detail"]


class MockHelpers:
    """Mock助手类"""

    @staticmethod
    def mock_ai_response(content: str = None) -> str:
        """模拟AI响应"""
        return content or fake.text(max_nb_chars=1000)

    @staticmethod
    def mock_openai_response(response_content: str = None) -> Dict[str, Any]:
        """模拟OpenAI API响应"""
        return {
            "choices": [{
                "message": {
                    "content": response_content or fake.text(max_nb_chars=500)
                }
            }]
        }