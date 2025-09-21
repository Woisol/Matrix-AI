"""
课程路由API测试
"""
import pytest
import uuid
import json
from httpx import AsyncClient

from app.main import app
from tests.test_helpers import TestDataGenerator, AssertionHelpers


class TestCourseRoutes:
    """课程路由API测试类"""

    @pytest.mark.asyncio
    async def test_list_courses_success(self, client: AsyncClient, db):
        """测试获取课程列表API"""
        # 创建测试数据
        course1 = await TestDataGenerator.create_test_course(course_name="API测试课程1")
        course2 = await TestDataGenerator.create_test_course(course_name="API测试课程2")

        # 发送请求
        response = await client.get("/courses")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()

        assert isinstance(data, list)
        course_names = [course["courseName"] for course in data]
        assert "API测试课程1" in course_names
        assert "API测试课程2" in course_names

    @pytest.mark.asyncio
    async def test_list_courses_empty(self, client: AsyncClient, db):
        """测试获取空课程列表API"""
        # 清空数据库
        from app.models.course import Course
        await Course.all().delete()

        # 发送请求
        response = await client.get("/courses")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0

    @pytest.mark.asyncio
    async def test_list_todo_courses_success(self, client: AsyncClient, db):
        """测试获取待完成课程列表API"""
        # 创建测试数据
        completed_course = await TestDataGenerator.create_test_course(
            course_name="已完成课程",
            completed=True
        )
        todo_course = await TestDataGenerator.create_test_course(
            course_name="待完成课程",
            completed=False
        )

        # 发送请求
        response = await client.get("/courses/todo")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()

        course_names = [course["courseName"] for course in data]
        assert "待完成课程" in course_names
        assert "已完成课程" not in course_names

    @pytest.mark.asyncio
    async def test_get_course_success(self, client: AsyncClient, db):
        """测试获取单个课程API"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course(course_name="单个课程测试")
        assignment = await TestDataGenerator.create_test_assignment(title="测试作业")
        await course.assignments.add(assignment)

        # 发送请求
        response = await client.get(f"/courses/{course.id}")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()

        assert data["courseId"] == course.id
        assert data["courseName"] == course.course_name
        assert data["completed"] == course.completed

    @pytest.mark.asyncio
    async def test_get_course_not_found(self, client: AsyncClient, db):
        """测试获取不存在的课程API"""
        non_existent_id = str(uuid.uuid4())

        # 发送请求
        response = await client.get(f"/courses/{non_existent_id}")

        # 验证响应
        AssertionHelpers.assert_response_error(response, 404, "not found")

    @pytest.mark.asyncio
    async def test_create_course_success(self, client: AsyncClient, db):
        """测试创建课程API"""
        course_data = {
            "courseId": None,
            "courseName": "API创建的课程",
            "type": "public",
            "status": "open",
            "completed": False,
            "assignmentIds": None
        }

        # 发送请求
        response = await client.post("/courses", json=course_data)

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data is True

        # 验证课程确实被创建
        from app.models.course import Course
        courses = await Course.filter(course_name="API创建的课程").all()
        assert len(courses) == 1
        created_course = courses[0]
        assert created_course.course_name == "API创建的课程"
        assert created_course.type == "public"
        assert created_course.status == "open"

    @pytest.mark.asyncio
    async def test_update_course_success(self, client: AsyncClient, db):
        """测试更新课程API"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course(
            course_name="原始课程名",
            type="public",
            completed=False
        )

        update_data = {
            "courseId": course.id,
            "courseName": "更新后的课程名",
            "type": "private",
            "status": "close",
            "completed": True,
            "assignmentIds": None
        }

        # 发送请求
        response = await client.post("/courses", json=update_data)

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data is True

        # 验证课程确实被更新
        from app.models.course import Course
        updated_course = await Course.get(id=course.id)
        assert updated_course.course_name == "更新后的课程名"
        assert updated_course.type == "private"
        assert updated_course.status == "close"
        assert updated_course.completed is True

    @pytest.mark.asyncio
    async def test_create_course_validation_error(self, client: AsyncClient, db):
        """测试创建课程时的验证错误"""
        # 发送无效数据
        invalid_data = {
            "courseId": None,
            "courseName": "",  # 空名称
            "type": "invalid_type",
            "status": "invalid_status",
            "completed": False,
            "assignmentIds": None
        }

        # 发送请求
        response = await client.post("/courses", json=invalid_data)

        # 验证响应
        assert response.status_code >= 400  # 应该返回错误状态码

    @pytest.mark.asyncio
    async def test_delete_course_success(self, client: AsyncClient, db):
        """测试删除课程API"""
        # 创建测试课程
        course = await TestDataGenerator.create_test_course(course_name="待删除课程")
        course_id = course.id

        # 发送请求
        response = await client.delete(f"/courses/{course_id}")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data is True

        # 验证课程确实被删除
        from app.models.course import Course
        with pytest.raises(Exception):  # DoesNotExist
            await Course.get(id=course_id)

    @pytest.mark.asyncio
    async def test_delete_course_not_found(self, client: AsyncClient, db):
        """测试删除不存在的课程API"""
        non_existent_id = str(uuid.uuid4())

        # 发送请求
        response = await client.delete(f"/courses/{non_existent_id}")

        # 验证响应
        AssertionHelpers.assert_response_error(response, 404, "not found")

    @pytest.mark.asyncio
    async def test_course_api_content_type(self, client: AsyncClient, db):
        """测试API的Content-Type处理"""
        course_data = {
            "courseId": None,
            "courseName": "Content-Type测试课程",
            "type": "public",
            "status": "open",
            "completed": False,
            "assignmentIds": None
        }

        # 测试JSON Content-Type
        response = await client.post(
            "/courses",
            json=course_data,
            headers={"Content-Type": "application/json"}
        )

        AssertionHelpers.assert_response_success(response)

    @pytest.mark.asyncio
    async def test_course_api_error_handling(self, client: AsyncClient, db):
        """测试API错误处理"""
        # 测试无效的JSON数据
        response = await client.post(
            "/courses",
            content="invalid json",
            headers={"Content-Type": "application/json"}
        )

        assert response.status_code >= 400

    @pytest.mark.asyncio
    async def test_course_api_with_assignments(self, client: AsyncClient, db):
        """测试包含作业的课程API"""
        # 创建课程和作业
        course = await TestDataGenerator.create_test_course(course_name="包含作业的课程")
        assignment1 = await TestDataGenerator.create_test_assignment(title="作业1")
        assignment2 = await TestDataGenerator.create_test_assignment(title="作业2")
        await course.assignments.add(assignment1, assignment2)

        # 获取课程
        response = await client.get(f"/courses/{course.id}")

        AssertionHelpers.assert_response_success(response)
        data = response.json()

        assert data["courseId"] == course.id
        assert "assignment" in data  # 应该包含作业数据

    @pytest.mark.asyncio
    async def test_course_api_pagination_like_behavior(self, client: AsyncClient, db):
        """测试类似分页的行为（创建多个课程）"""
        # 创建多个课程
        course_names = []
        for i in range(20):
            course_name = f"分页测试课程{i}"
            course_names.append(course_name)
            await TestDataGenerator.create_test_course(course_name=course_name)

        # 获取所有课程
        response = await client.get("/courses")

        AssertionHelpers.assert_response_success(response)
        data = response.json()

        # 验证所有课程都被返回
        assert len(data) >= 20
        returned_names = [course["courseName"] for course in data]
        for course_name in course_names:
            assert course_name in returned_names

    @pytest.mark.asyncio
    async def test_course_api_concurrent_requests(self, client: AsyncClient, db):
        """测试并发请求"""
        import asyncio

        # 创建测试课程
        course = await TestDataGenerator.create_test_course(course_name="并发测试课程")

        # 并发发送多个获取请求
        async def make_request():
            return await client.get(f"/courses/{course.id}")

        # 发送10个并发请求
        tasks = [make_request() for _ in range(10)]
        responses = await asyncio.gather(*tasks)

        # 验证所有请求都成功
        for response in responses:
            AssertionHelpers.assert_response_success(response)
            data = response.json()
            assert data["courseId"] == course.id

    @pytest.mark.asyncio
    async def test_course_api_field_validation(self, client: AsyncClient, db):
        """测试字段验证"""
        # 测试必需字段缺失
        incomplete_data = {
            "courseId": None,
            # "courseName": "缺失字段测试",  # 故意缺失
            "type": "public",
            "status": "open"
        }

        response = await client.post("/courses", json=incomplete_data)

        # 应该返回验证错误
        assert response.status_code >= 400

    @pytest.mark.asyncio
    async def test_course_api_integration_workflow(self, client: AsyncClient, db):
        """测试完整的API工作流程"""
        # 1. 创建课程
        create_data = {
            "courseId": None,
            "courseName": "集成测试课程",
            "type": "public",
            "status": "open",
            "completed": False,
            "assignmentIds": None
        }

        create_response = await client.post("/courses", json=create_data)
        AssertionHelpers.assert_response_success(create_response)

        # 2. 获取课程列表，验证课程被创建
        list_response = await client.get("/courses")
        AssertionHelpers.assert_response_success(list_response)
        courses = list_response.json()

        created_course = None
        for course in courses:
            if course["courseName"] == "集成测试课程":
                created_course = course
                break

        assert created_course is not None
        course_id = created_course["courseId"]

        # 3. 获取单个课程
        get_response = await client.get(f"/courses/{course_id}")
        AssertionHelpers.assert_response_success(get_response)
        course_data = get_response.json()
        assert course_data["courseName"] == "集成测试课程"

        # 4. 更新课程
        update_data = {
            "courseId": course_id,
            "courseName": "更新后的集成测试课程",
            "type": "private",
            "status": "close",
            "completed": True,
            "assignmentIds": None
        }

        update_response = await client.post("/courses", json=update_data)
        AssertionHelpers.assert_response_success(update_response)

        # 5. 验证更新
        updated_get_response = await client.get(f"/courses/{course_id}")
        AssertionHelpers.assert_response_success(updated_get_response)
        updated_data = updated_get_response.json()
        assert updated_data["courseName"] == "更新后的集成测试课程"
        assert updated_data["completed"] is True

        # 6. 删除课程
        delete_response = await client.delete(f"/courses/{course_id}")
        AssertionHelpers.assert_response_success(delete_response)

        # 7. 验证删除
        final_get_response = await client.get(f"/courses/{course_id}")
        AssertionHelpers.assert_response_error(final_get_response, 404)