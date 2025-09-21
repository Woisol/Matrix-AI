"""
课程模型测试
"""
import pytest
import uuid
from datetime import datetime, timezone

from app.models.course import Course
from app.models.assignment import Assignment
from tests.test_helpers import TestDataGenerator, AssertionHelpers


class TestCourseModel:
    """课程模型测试类"""

    @pytest.mark.asyncio
    async def test_create_course(self, db):
        """测试创建课程"""
        course_id = str(uuid.uuid4())
        course_name = "测试课程"
        course_type = "public"
        status = "open"
        completed = False

        course = await Course.create(
            id=course_id,
            course_name=course_name,
            type=course_type,
            status=status,
            completed=completed
        )

        assert course.id == course_id
        assert course.course_name == course_name
        assert course.type == course_type
        assert course.status == status
        assert course.completed == completed
        assert isinstance(course.created_at, datetime)
        assert isinstance(course.updated_at, datetime)

    @pytest.mark.asyncio
    async def test_create_course_with_defaults(self, db):
        """测试使用默认值创建课程"""
        course_id = str(uuid.uuid4())
        course_name = "默认设置课程"

        course = await Course.create(
            id=course_id,
            course_name=course_name
        )

        assert course.id == course_id
        assert course.course_name == course_name
        assert course.type == "public"  # 默认值
        assert course.status == "open"  # 默认值
        assert course.completed is False  # 默认值

    @pytest.mark.asyncio
    async def test_get_course_by_id(self, db):
        """测试通过ID获取课程"""
        course = await TestDataGenerator.create_test_course()

        retrieved_course = await Course.get(id=course.id)

        assert retrieved_course.id == course.id
        assert retrieved_course.course_name == course.course_name
        assert retrieved_course.type == course.type
        assert retrieved_course.status == course.status
        assert retrieved_course.completed == course.completed

    @pytest.mark.asyncio
    async def test_update_course(self, db):
        """测试更新课程"""
        course = await TestDataGenerator.create_test_course()

        new_name = "更新后的课程名称"
        new_status = "close"
        new_completed = True

        course.course_name = new_name
        course.status = new_status
        course.completed = new_completed
        old_updated_at = course.updated_at
        await course.save()

        # 重新获取课程验证更新
        updated_course = await Course.get(id=course.id)
        assert updated_course.course_name == new_name
        assert updated_course.status == new_status
        assert updated_course.completed == new_completed
        assert updated_course.updated_at > old_updated_at

    @pytest.mark.asyncio
    async def test_delete_course(self, db):
        """测试删除课程"""
        course = await TestDataGenerator.create_test_course()
        course_id = course.id

        await course.delete()

        # 验证课程已被删除
        with pytest.raises(Exception):  # DoesNotExist
            await Course.get(id=course_id)

    @pytest.mark.asyncio
    async def test_course_assignment_relationship(self, db):
        """测试课程和作业的多对多关系"""
        # 创建课程和作业
        course = await TestDataGenerator.create_test_course()
        assignment1 = await TestDataGenerator.create_test_assignment()
        assignment2 = await TestDataGenerator.create_test_assignment()

        # 建立关系
        await course.assignments.add(assignment1, assignment2)

        # 验证关系
        course_assignments = await course.assignments.all()
        assert len(course_assignments) == 2
        assignment_ids = [assign.id for assign in course_assignments]
        assert assignment1.id in assignment_ids
        assert assignment2.id in assignment_ids

        # 从作业侧验证关系
        assignment1_courses = await assignment1.courses.all()
        assert len(assignment1_courses) == 1
        assert assignment1_courses[0].id == course.id

    @pytest.mark.asyncio
    async def test_course_assignment_remove_relationship(self, db):
        """测试移除课程和作业的关系"""
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment()

        # 建立关系
        await course.assignments.add(assignment)

        # 验证关系存在
        course_assignments = await course.assignments.all()
        assert len(course_assignments) == 1

        # 移除关系
        await course.assignments.remove(assignment)

        # 验证关系已移除
        course_assignments_after = await course.assignments.all()
        assert len(course_assignments_after) == 0

    @pytest.mark.asyncio
    async def test_course_with_prefetch_assignments(self, db):
        """测试预加载作业的课程查询"""
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment()
        await course.assignments.add(assignment)

        # 使用预加载查询
        course_with_assignments = await Course.get(id=course.id).prefetch_related("assignments")

        assert course_with_assignments.id == course.id
        # 验证预加载的作业数据可以访问
        assignments = await course_with_assignments.assignments.all()
        assert len(assignments) == 1
        assert assignments[0].id == assignment.id

    @pytest.mark.asyncio
    async def test_list_courses(self, db):
        """测试获取课程列表"""
        # 创建多个课程
        courses = []
        for i in range(3):
            course = await TestDataGenerator.create_test_course(
                course_name=f"列表课程 {i}"
            )
            courses.append(course)

        all_courses = await Course.all()

        # 验证创建的课程都在列表中
        course_ids = [course.id for course in all_courses]
        for course in courses:
            assert course.id in course_ids

    @pytest.mark.asyncio
    async def test_filter_courses_by_type(self, db):
        """测试按类型过滤课程"""
        # 创建不同类型的课程
        public_course = await TestDataGenerator.create_test_course(
            course_name="公开课程",
            type="public"
        )
        private_course = await TestDataGenerator.create_test_course(
            course_name="私有课程",
            type="private"
        )

        # 过滤公开课程
        public_courses = await Course.filter(type="public").all()
        public_course_ids = [course.id for course in public_courses]
        assert public_course.id in public_course_ids

        # 过滤私有课程
        private_courses = await Course.filter(type="private").all()
        private_course_ids = [course.id for course in private_courses]
        assert private_course.id in private_course_ids

    @pytest.mark.asyncio
    async def test_filter_completed_courses(self, db):
        """测试过滤已完成课程"""
        # 创建已完成和未完成的课程
        completed_course = await TestDataGenerator.create_test_course(
            course_name="已完成课程",
            completed=True
        )
        incomplete_course = await TestDataGenerator.create_test_course(
            course_name="未完成课程",
            completed=False
        )

        # 过滤已完成课程
        completed_courses = await Course.filter(completed=True).all()
        completed_course_ids = [course.id for course in completed_courses]
        assert completed_course.id in completed_course_ids

        # 过滤未完成课程
        incomplete_courses = await Course.filter(completed=False).all()
        incomplete_course_ids = [course.id for course in incomplete_courses]
        assert incomplete_course.id in incomplete_course_ids

    @pytest.mark.asyncio
    async def test_course_str_representation(self, db):
        """测试课程的字符串表示"""
        course = await TestDataGenerator.create_test_course(course_name="字符串测试课程")

        str_repr = str(course)
        assert "Course" in str_repr
        assert course.id in str_repr
        assert course.course_name in str_repr

    @pytest.mark.asyncio
    async def test_course_meta_configuration(self, db):
        """测试课程模型的Meta配置"""
        # 这个测试验证模型的元配置是否正确
        assert Course._meta.table == "courses"
        assert Course._meta.table_description == "课程表"

    @pytest.mark.asyncio
    async def test_course_field_constraints(self, db):
        """测试课程字段约束"""
        course_id = "a" * 100  # 超过50字符限制

        # 这应该会失败，因为ID超过了最大长度
        with pytest.raises(Exception):  # ValidationError 或类似错误
            await Course.create(
                id=course_id,
                course_name="测试课程"
            )

    @pytest.mark.asyncio
    async def test_course_name_constraints(self, db):
        """测试课程名称约束"""
        course_name = "a" * 250  # 超过200字符限制

        # 这应该会失败，因为课程名称超过了最大长度
        with pytest.raises(Exception):  # ValidationError 或类似错误
            await Course.create(
                id=str(uuid.uuid4()),
                course_name=course_name
            )