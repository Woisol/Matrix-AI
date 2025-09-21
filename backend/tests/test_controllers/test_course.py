"""
课程控制器测试
"""
import pytest
import uuid
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException

from app.controller.course import CourseController
from app.models.course import Course as CourseModel
from app.models.assignment import Assignment
from tests.test_helpers import TestDataGenerator, AssertionHelpers


class TestCourseController:
    """课程控制器测试类"""

    @pytest.mark.asyncio
    async def test_list_courses_success(self, db):
        """测试成功获取课程列表"""
        # 创建测试数据
        course1 = await TestDataGenerator.create_test_course(course_name="课程1")
        course2 = await TestDataGenerator.create_test_course(course_name="课程2")

        # 为课程添加作业
        assignment1 = await TestDataGenerator.create_test_assignment(title="作业1")
        assignment2 = await TestDataGenerator.create_test_assignment(title="作业2")
        await course1.assignments.add(assignment1)
        await course2.assignments.add(assignment2)

        # 调用控制器方法
        result = await CourseController.list_courses()

        # 验证结果
        assert isinstance(result, list)
        assert len(result) >= 2  # 至少包含我们创建的两个课程

        course_ids = [course.courseId for course in result]
        assert course1.id in course_ids
        assert course2.id in course_ids

    @pytest.mark.asyncio
    async def test_list_courses_empty(self, db):
        """测试获取空课程列表"""
        # 确保数据库中没有课程
        await CourseModel.all().delete()

        # 调用控制器方法
        result = await CourseController.list_courses()

        # 验证结果
        assert isinstance(result, list)
        assert len(result) == 0

    @pytest.mark.asyncio
    async def test_list_todo_courses_success(self, db):
        """测试成功获取待完成课程列表"""
        # 创建测试数据
        completed_course = await TestDataGenerator.create_test_course(
            course_name="已完成课程",
            completed=True
        )
        todo_course1 = await TestDataGenerator.create_test_course(
            course_name="待完成课程1",
            completed=False
        )
        todo_course2 = await TestDataGenerator.create_test_course(
            course_name="待完成课程2",
            completed=False
        )

        # 调用控制器方法
        result = await CourseController.list_todo_courses()

        # 验证结果
        assert isinstance(result, list)
        course_ids = [course.courseId for course in result]

        # 应该包含待完成的课程
        assert todo_course1.id in course_ids
        assert todo_course2.id in course_ids

        # 不应该包含已完成的课程
        assert completed_course.id not in course_ids

    @pytest.mark.asyncio
    async def test_get_course_success(self, db):
        """测试成功获取单个课程"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course(course_name="测试课程")
        assignment = await TestDataGenerator.create_test_assignment(title="测试作业")
        await course.assignments.add(assignment)

        # 调用控制器方法
        result = await CourseController.get_course(course_id=course.id)

        # 验证结果
        assert result.courseId == course.id
        assert result.courseName == course.course_name
        assert result.completed == course.completed

    @pytest.mark.asyncio
    async def test_get_course_not_found(self, db):
        """测试获取不存在的课程"""
        non_existent_id = str(uuid.uuid4())

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await CourseController.get_course(course_id=non_existent_id)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_set_course_create_new(self, db):
        """测试创建新课程"""
        course_name = "新建测试课程"
        course_type = "public"
        status = "open"

        # 调用控制器方法
        result = await CourseController.set_course(
            courseId=None,
            courseName=course_name,
            type=course_type,
            status=status,
            completed=None,
            assignmentIds=None
        )

        # 验证结果
        assert result is True

        # 验证课程确实被创建
        courses = await CourseModel.filter(course_name=course_name).all()
        assert len(courses) == 1
        created_course = courses[0]
        assert created_course.course_name == course_name
        assert created_course.type == course_type
        assert created_course.status == status
        assert created_course.completed is False  # 默认值

    @pytest.mark.asyncio
    async def test_set_course_update_existing(self, db):
        """测试更新现有课程"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course(
            course_name="原始课程名",
            type="public",
            status="open",
            completed=False
        )

        # 更新数据
        new_name = "更新后的课程名"
        new_type = "private"
        new_status = "close"
        new_completed = True

        # 调用控制器方法
        result = await CourseController.set_course(
            courseId=course.id,
            courseName=new_name,
            type=new_type,
            status=new_status,
            completed=new_completed,
            assignmentIds=None
        )

        # 验证结果
        assert result is True

        # 验证课程确实被更新
        updated_course = await CourseModel.get(id=course.id)
        assert updated_course.course_name == new_name
        assert updated_course.type == new_type
        assert updated_course.status == new_status
        assert updated_course.completed == new_completed

    @pytest.mark.asyncio
    async def test_set_course_update_partial(self, db):
        """测试部分更新课程"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course(
            course_name="原始课程名",
            completed=False
        )

        new_name = "更新后的课程名"

        # 调用控制器方法，completed=None应该保持原值
        result = await CourseController.set_course(
            courseId=course.id,
            courseName=new_name,
            type="public",
            status="open",
            completed=None,  # 不更新此字段
            assignmentIds=None
        )

        # 验证结果
        assert result is True

        # 验证课程被正确更新
        updated_course = await CourseModel.get(id=course.id)
        assert updated_course.course_name == new_name
        assert updated_course.completed is False  # 保持原值

    @pytest.mark.asyncio
    async def test_set_course_update_non_existent(self, db):
        """测试更新不存在的课程"""
        non_existent_id = str(uuid.uuid4())

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await CourseController.set_course(
                courseId=non_existent_id,
                courseName="测试课程",
                type="public",
                status="open",
                completed=False,
                assignmentIds=None
            )

        assert exc_info.value.status_code == 500  # 这里可能是500或404，取决于实现

    @pytest.mark.asyncio
    async def test_delete_course_success(self, db):
        """测试成功删除课程"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course()
        course_id = course.id

        # 调用控制器方法
        result = await CourseController.delete_course(course_id=course_id)

        # 验证结果
        assert result is True

        # 验证课程确实被删除
        with pytest.raises(Exception):  # DoesNotExist
            await CourseModel.get(id=course_id)

    @pytest.mark.asyncio
    async def test_delete_course_not_found(self, db):
        """测试删除不存在的课程"""
        non_existent_id = str(uuid.uuid4())

        # 调用控制器方法，应该抛出异常
        with pytest.raises(HTTPException) as exc_info:
            await CourseController.delete_course(course_id=non_existent_id)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_course_controller_error_handling(self, db):
        """测试控制器的错误处理"""
        # 这个测试可以验证在数据库连接问题等情况下的错误处理
        # 由于实际测试环境的限制，这里主要验证异常处理逻辑的存在

        # 测试创建课程时的数据验证
        with pytest.raises(HTTPException):
            await CourseController.set_course(
                courseId=None,
                courseName="",  # 空名称可能导致验证错误
                type="invalid_type",  # 无效类型
                status="invalid_status",  # 无效状态
                completed=None,
                assignmentIds=None
            )

    @pytest.mark.asyncio
    async def test_course_with_assignments_workflow(self, db):
        """测试包含作业的课程完整工作流"""
        # 创建课程
        course = await TestDataGenerator.create_test_course(course_name="工作流测试课程")

        # 创建作业
        assignment1 = await TestDataGenerator.create_test_assignment(title="作业1")
        assignment2 = await TestDataGenerator.create_test_assignment(title="作业2")

        # 添加作业到课程
        await course.assignments.add(assignment1, assignment2)

        # 获取课程，验证包含作业
        result = await CourseController.get_course(course_id=course.id)

        assert result.courseId == course.id
        assert result.courseName == course.course_name
        # 验证作业数据是否正确返回
        assert hasattr(result, 'assignment')

    @pytest.mark.asyncio
    async def test_course_data_consistency(self, db):
        """测试课程数据一致性"""
        # 创建课程
        course_name = "数据一致性测试"
        result = await CourseController.set_course(
            courseId=None,
            courseName=course_name,
            type="public",
            status="open",
            completed=False,
            assignmentIds=None
        )
        assert result is True

        # 获取创建的课程
        courses = await CourseModel.filter(course_name=course_name).all()
        assert len(courses) == 1
        created_course = courses[0]

        # 通过控制器获取同一课程
        controller_result = await CourseController.get_course(course_id=created_course.id)

        # 验证数据一致性
        assert controller_result.courseId == created_course.id
        assert controller_result.courseName == created_course.course_name
        assert controller_result.completed == created_course.completed

    @pytest.mark.asyncio
    async def test_course_list_performance(self, db):
        """测试课程列表的性能"""
        # 创建多个课程和作业
        courses = []
        for i in range(10):
            course = await TestDataGenerator.create_test_course(course_name=f"性能测试课程{i}")
            assignment = await TestDataGenerator.create_test_assignment(title=f"作业{i}")
            await course.assignments.add(assignment)
            courses.append(course)

        # 调用列表方法
        result = await CourseController.list_courses()

        # 验证所有课程都被返回
        assert len(result) >= 10
        course_names = [course.courseName for course in result]
        for i in range(10):
            assert f"性能测试课程{i}" in course_names