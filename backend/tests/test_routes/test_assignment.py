"""
作业路由API测试
"""
import pytest
import uuid
import json
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient
from unittest.mock import patch

from app.main import app
from tests.test_helpers import TestDataGenerator, AssertionHelpers


class TestAssignmentRoutes:
    """作业路由API测试类"""

    @pytest.mark.asyncio
    async def test_get_assignment_success(self, client: AsyncClient, db):
        """测试获取作业API"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(title="API测试作业")
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        # 发送请求
        response = await client.get(f"/courses/{course.id}/assignments/{assignment.id}")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()

        assert data["assignId"] == assignment.id
        assert data["title"] == assignment.title
        assert data["description"] == assignment.description

    @pytest.mark.asyncio
    async def test_get_assignment_not_found(self, client: AsyncClient, db):
        """测试获取不存在的作业API"""
        course = await TestDataGenerator.create_test_course()
        non_existent_id = str(uuid.uuid4())

        # 发送请求
        response = await client.get(f"/courses/{course.id}/assignments/{non_existent_id}")

        # 验证响应
        AssertionHelpers.assert_response_error(response, 404, "not found")

    @pytest.mark.asyncio
    async def test_create_assignment_success(self, client: AsyncClient, db):
        """测试创建作业API"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()

        assignment_data = {
            "assignId": None,
            "courseId": course.id,
            "title": "API创建的作业",
            "description": "这是通过API创建的作业",
            "assignOriginalCode": '["print(\\"Hello API\\")"]',
            "testSample": {
                "input": [""],
                "expectOutput": ["Hello API\\n"]
            },
            "ddl": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        }

        # 发送请求
        response = await client.post(f"/courses/{course.id}/assignments", json=assignment_data)

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data is True

        # 验证作业确实被创建
        from app.models.assignment import Assignment
        assignments = await Assignment.filter(title="API创建的作业").all()
        assert len(assignments) == 1

    @pytest.mark.asyncio
    async def test_create_assignment_invalid_course(self, client: AsyncClient, db):
        """测试在不存在的课程中创建作业API"""
        non_existent_course_id = str(uuid.uuid4())

        assignment_data = {
            "assignId": None,
            "courseId": non_existent_course_id,
            "title": "测试作业",
            "description": "测试描述",
            "assignOriginalCode": '["print(\\"test\\")"]',
            "testSample": {
                "input": [""],
                "expectOutput": ["test\\n"]
            },
            "ddl": None
        }

        # 发送请求
        response = await client.post(f"/courses/{non_existent_course_id}/assignments", json=assignment_data)

        # 验证响应
        AssertionHelpers.assert_response_error(response, 404, "Course with id")

    @pytest.mark.asyncio
    async def test_update_assignment_success(self, client: AsyncClient, db):
        """测试更新作业API"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(title="原始作业")
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        update_data = {
            "assignId": assignment.id,
            "courseId": course.id,
            "title": "更新后的作业",
            "description": "更新后的描述",
            "assignOriginalCode": '["print(\\"Updated Hello\\")"]',
            "testSample": {
                "input": ["updated"],
                "expectOutput": ["Updated Hello\\n"]
            },
            "ddl": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat()
        }

        # 发送请求
        response = await client.post(f"/courses/{course.id}/assignments", json=update_data)

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data is True

        # 验证作业确实被更新
        from app.models.assignment import Assignment
        updated_assignment = await Assignment.get(id=assignment.id)
        assert updated_assignment.title == "更新后的作业"

    @pytest.mark.asyncio
    async def test_delete_assignment_success(self, client: AsyncClient, db):
        """测试删除作业API"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(title="待删除作业")
        await course.assignments.add(assignment)
        assignment_id = assignment.id

        # 发送请求
        response = await client.delete(f"/courses/{course.id}/assignments/{assignment_id}")

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data is True

        # 验证作业确实被删除
        from app.models.assignment import Assignment
        with pytest.raises(Exception):  # DoesNotExist
            await Assignment.get(id=assignment_id)

    @pytest.mark.asyncio
    async def test_delete_assignment_not_found(self, client: AsyncClient, db):
        """测试删除不存在的作业API"""
        course = await TestDataGenerator.create_test_course()
        non_existent_id = str(uuid.uuid4())

        # 发送请求
        response = await client.delete(f"/courses/{course.id}/assignments/{non_existent_id}")

        # 验证响应
        AssertionHelpers.assert_response_error(response, 404, "Assignment with id")

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.run_code')
    async def test_playground_submission_success(self, mock_run_code, client: AsyncClient, db):
        """测试代码测试提交API"""
        # Mock代码执行结果
        expected_output = "Hello Playground\\n"
        mock_run_code.return_value = expected_output

        submission_data = {
            "codeFile": {
                "fileName": "test.py",
                "content": "print('Hello Playground')",
                "language": "python"
            },
            "input": "",
            "language": "python"
        }

        # 发送请求
        response = await client.post("/playground/submission", json=submission_data)

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()
        assert data == expected_output

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.run_code')
    async def test_playground_submission_error(self, mock_run_code, client: AsyncClient, db):
        """测试代码测试提交错误API"""
        # Mock代码执行异常
        mock_run_code.side_effect = Exception("Code execution failed")

        submission_data = {
            "codeFile": {
                "fileName": "error.py",
                "content": "invalid code",
                "language": "python"
            },
            "input": "",
            "language": "python"
        }

        # 发送请求
        response = await client.post("/playground/submission", json=submission_data)

        # 验证响应
        AssertionHelpers.assert_response_error(response, 500)

    @pytest.mark.asyncio
    @patch('app.models.playground.Playground.judge_code')
    async def test_submit_assignment_success(self, mock_judge_code, client: AsyncClient, db):
        """测试作业提交API"""
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
            score=95.0,
            testRealOutput=["Hello Submit\\n"]
        )
        mock_judge_code.return_value = mock_judge_result

        submission_data = {
            "codeFile": {
                "fileName": "solution.py",
                "content": "print('Hello Submit')",
                "language": "python"
            }
        }

        # 发送请求
        response = await client.post(
            f"/courses/{course.id}/assignments/{assignment.id}/submission",
            json=submission_data
        )

        # 验证响应
        AssertionHelpers.assert_response_success(response)
        data = response.json()

        assert data["score"] == 95.0
        assert len(data["submitCode"]) == 1
        assert data["submitCode"][0]["fileName"] == "solution.py"

    @pytest.mark.asyncio
    async def test_submit_assignment_deadline_passed(self, client: AsyncClient, db):
        """测试提交已过期作业API"""
        # 创建已过期的作业
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(
            end_date=datetime.now(timezone.utc) - timedelta(days=1)  # 已过期
        )
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        submission_data = {
            "codeFile": {
                "fileName": "solution.py",
                "content": "print('Hello Submit')",
                "language": "python"
            }
        }

        # 发送请求
        response = await client.post(
            f"/courses/{course.id}/assignments/{assignment.id}/submission",
            json=submission_data
        )

        # 验证响应
        AssertionHelpers.assert_response_error(response, 400, "Deadline has passed")

    @pytest.mark.asyncio
    async def test_assignment_api_validation(self, client: AsyncClient, db):
        """测试作业API数据验证"""
        course = await TestDataGenerator.create_test_course()

        # 测试缺少必需字段
        invalid_data = {
            "assignId": None,
            "courseId": course.id,
            # "title": "缺失标题",  # 故意缺失
            "description": "测试描述",
            "assignOriginalCode": '["print(\\"test\\")"]',
            "testSample": {
                "input": [""],
                "expectOutput": ["test\\n"]
            }
        }

        response = await client.post(f"/courses/{course.id}/assignments", json=invalid_data)

        # 应该返回验证错误
        assert response.status_code >= 400

    @pytest.mark.asyncio
    async def test_assignment_api_json_validation(self, client: AsyncClient, db):
        """测试作业API JSON数据验证"""
        course = await TestDataGenerator.create_test_course()

        # 测试无效的JSON格式原始代码
        invalid_json_data = {
            "assignId": None,
            "courseId": course.id,
            "title": "JSON测试作业",
            "description": "测试JSON验证",
            "assignOriginalCode": "invalid json string",  # 无效的JSON
            "testSample": {
                "input": [""],
                "expectOutput": ["test\\n"]
            }
        }

        response = await client.post(f"/courses/{course.id}/assignments", json=invalid_json_data)

        # 可能成功创建（控制器会处理无效JSON），但会有警告
        # 或者返回错误状态码，取决于实现
        # 这里主要测试API不会崩溃
        assert response.status_code in [200, 400, 422]

    @pytest.mark.asyncio
    async def test_assignment_api_concurrent_operations(self, client: AsyncClient, db):
        """测试作业API并发操作"""
        import asyncio

        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment()
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        # 并发获取同一个作业
        async def get_assignment():
            return await client.get(f"/courses/{course.id}/assignments/{assignment.id}")

        tasks = [get_assignment() for _ in range(5)]
        responses = await asyncio.gather(*tasks)

        # 验证所有请求都成功
        for response in responses:
            AssertionHelpers.assert_response_success(response)
            data = response.json()
            assert data["assignId"] == assignment.id

    @pytest.mark.asyncio
    async def test_assignment_api_integration_workflow(self, client: AsyncClient, db):
        """测试作业API完整工作流程"""
        # 1. 创建课程
        course = await TestDataGenerator.create_test_course(course_name="API集成测试课程")

        # 2. 创建作业
        create_data = {
            "assignId": None,
            "courseId": course.id,
            "title": "API集成测试作业",
            "description": "完整工作流程测试",
            "assignOriginalCode": '["print(\\"Integration Test\\")"]',
            "testSample": {
                "input": [""],
                "expectOutput": ["Integration Test\\n"]
            },
            "ddl": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        }

        create_response = await client.post(f"/courses/{course.id}/assignments", json=create_data)
        AssertionHelpers.assert_response_success(create_response)

        # 3. 获取创建的作业
        from app.models.assignment import Assignment
        assignments = await Assignment.filter(title="API集成测试作业").all()
        assignment = assignments[0]

        get_response = await client.get(f"/courses/{course.id}/assignments/{assignment.id}")
        AssertionHelpers.assert_response_success(get_response)
        assignment_data = get_response.json()
        assert assignment_data["title"] == "API集成测试作业"

        # 4. 更新作业
        update_data = {
            "assignId": assignment.id,
            "courseId": course.id,
            "title": "更新后的API集成测试作业",
            "description": "更新后的描述",
            "assignOriginalCode": '["print(\\"Updated Integration Test\\")"]',
            "testSample": {
                "input": [""],
                "expectOutput": ["Updated Integration Test\\n"]
            },
            "ddl": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat()
        }

        update_response = await client.post(f"/courses/{course.id}/assignments", json=update_data)
        AssertionHelpers.assert_response_success(update_response)

        # 5. 验证更新
        updated_get_response = await client.get(f"/courses/{course.id}/assignments/{assignment.id}")
        AssertionHelpers.assert_response_success(updated_get_response)
        updated_data = updated_get_response.json()
        assert updated_data["title"] == "更新后的API集成测试作业"

        # 6. 删除作业
        delete_response = await client.delete(f"/courses/{course.id}/assignments/{assignment.id}")
        AssertionHelpers.assert_response_success(delete_response)

        # 7. 验证删除
        final_get_response = await client.get(f"/courses/{course.id}/assignments/{assignment.id}")
        AssertionHelpers.assert_response_error(final_get_response, 404)

    @pytest.mark.asyncio
    async def test_assignment_with_submission_workflow(self, client: AsyncClient, db):
        """测试包含提交的作业工作流程"""
        # 创建测试数据
        course = await TestDataGenerator.create_test_course()
        assignment = await TestDataGenerator.create_test_assignment(
            end_date=datetime.now(timezone.utc) + timedelta(days=7)
        )
        assignment_code = await TestDataGenerator.create_test_assignment_code(assignment)
        await course.assignments.add(assignment)

        # 1. 获取作业（无提交记录）
        get_response = await client.get(f"/courses/{course.id}/assignments/{assignment.id}")
        AssertionHelpers.assert_response_success(get_response)
        data = get_response.json()
        assert data["submit"] is None

        # 2. 提交作业（需要Mock判题）
        with patch('app.models.playground.Playground.judge_code') as mock_judge:
            from app.schemas.assignment import JudgeResult
            mock_judge.return_value = JudgeResult(
                score=88.0,
                testRealOutput=["Test Output\\n"]
            )

            submission_data = {
                "codeFile": {
                    "fileName": "solution.py",
                    "content": "print('Test Output')",
                    "language": "python"
                }
            }

            submit_response = await client.post(
                f"/courses/{course.id}/assignments/{assignment.id}/submission",
                json=submission_data
            )
            AssertionHelpers.assert_response_success(submit_response)

        # 3. 再次获取作业（应该有提交记录）
        final_get_response = await client.get(f"/courses/{course.id}/assignments/{assignment.id}")
        AssertionHelpers.assert_response_success(final_get_response)
        final_data = final_get_response.json()
        assert final_data["submit"] is not None
        assert final_data["submit"]["score"] == 88.0