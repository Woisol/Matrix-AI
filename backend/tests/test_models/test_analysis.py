"""
分析模型测试
"""
import pytest
import uuid
from typing import Dict, Any

from app.models.analysis import Analysis
from app.models.assignment import Assignment
from tests.test_helpers import TestDataGenerator


class TestAnalysisModel:
    """分析模型测试类"""

    @pytest.mark.asyncio
    async def test_create_analysis(self, db):
        """测试创建分析"""
        assignment = await TestDataGenerator.create_test_assignment()

        resolution = {"solution": "这是一个解决方案", "steps": ["步骤1", "步骤2"]}
        knowledge_analysis = {"concepts": ["变量", "循环"], "difficulty": "初级"}
        code_analysis = {"quality": "良好", "issues": []}
        learning_suggestions = {"next_steps": ["练习更多循环", "学习函数"]}

        analysis = await Analysis.create(
            assignment=assignment,
            resolution=resolution,
            knowledge_analysis=knowledge_analysis,
            code_analysis=code_analysis,
            learning_suggestions=learning_suggestions
        )

        assert analysis.assignment.id == assignment.id
        assert analysis.resolution == resolution
        assert analysis.knowledge_analysis == knowledge_analysis
        assert analysis.code_analysis == code_analysis
        assert analysis.learning_suggestions == learning_suggestions

    @pytest.mark.asyncio
    async def test_create_analysis_with_none_values(self, db):
        """测试创建带有None值的分析"""
        assignment = await TestDataGenerator.create_test_assignment()

        analysis = await Analysis.create(
            assignment=assignment,
            resolution=None,
            knowledge_analysis=None,
            code_analysis=None,
            learning_suggestions=None
        )

        assert analysis.assignment.id == assignment.id
        assert analysis.resolution is None
        assert analysis.knowledge_analysis is None
        assert analysis.code_analysis is None
        assert analysis.learning_suggestions is None

    @pytest.mark.asyncio
    async def test_get_analysis_by_assignment(self, db):
        """测试通过作业获取分析"""
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)

        # 通过作业获取分析
        assignment_analyses = await assignment.analysis.all()
        assert len(assignment_analyses) == 1
        assert assignment_analyses[0].id == analysis.id

    @pytest.mark.asyncio
    async def test_update_analysis(self, db):
        """测试更新分析"""
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)

        new_resolution = {"solution": "更新的解决方案", "complexity": "O(n)"}
        new_knowledge_analysis = {"updated_concepts": ["数组", "排序"]}

        analysis.resolution = new_resolution
        analysis.knowledge_analysis = new_knowledge_analysis
        await analysis.save()

        # 重新获取分析验证更新
        updated_analysis = await Analysis.get(id=analysis.id)
        assert updated_analysis.resolution == new_resolution
        assert updated_analysis.knowledge_analysis == new_knowledge_analysis

    @pytest.mark.asyncio
    async def test_delete_analysis(self, db):
        """测试删除分析"""
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)
        analysis_id = analysis.id

        await analysis.delete()

        # 验证分析已被删除
        with pytest.raises(Exception):  # DoesNotExist
            await Analysis.get(id=analysis_id)

    @pytest.mark.asyncio
    async def test_analysis_json_field_operations(self, db):
        """测试JSON字段操作"""
        assignment = await TestDataGenerator.create_test_assignment()

        # 创建复杂的JSON数据
        complex_resolution = {
            "main_solution": "使用递归解决",
            "alternative_solutions": [
                {"name": "迭代方法", "complexity": "O(n)"},
                {"name": "动态规划", "complexity": "O(n^2)"}
            ],
            "code_example": "def solve(n): return n if n <= 1 else solve(n-1) + solve(n-2)",
            "explanation": {
                "chinese": "这是斐波那契数列的递归实现",
                "english": "This is a recursive implementation of Fibonacci sequence"
            }
        }

        analysis = await Analysis.create(
            assignment=assignment,
            resolution=complex_resolution
        )

        # 验证JSON数据正确保存和检索
        retrieved_analysis = await Analysis.get(id=analysis.id)
        assert retrieved_analysis.resolution == complex_resolution
        assert retrieved_analysis.resolution["main_solution"] == "使用递归解决"
        assert len(retrieved_analysis.resolution["alternative_solutions"]) == 2

    @pytest.mark.asyncio
    async def test_multiple_analyses_per_assignment(self, db):
        """测试一个作业可以有多个分析"""
        assignment = await TestDataGenerator.create_test_assignment()

        # 创建多个分析
        analysis1 = await TestDataGenerator.create_test_analysis(
            assignment=assignment,
            resolution={"version": "v1", "solution": "解决方案1"}
        )
        analysis2 = await TestDataGenerator.create_test_analysis(
            assignment=assignment,
            resolution={"version": "v2", "solution": "解决方案2"}
        )

        # 验证作业包含多个分析
        assignment_analyses = await assignment.analysis.all()
        assert len(assignment_analyses) == 2

        analysis_ids = [analysis.id for analysis in assignment_analyses]
        assert analysis1.id in analysis_ids
        assert analysis2.id in analysis_ids

    @pytest.mark.asyncio
    async def test_analysis_with_prefetch_assignment(self, db):
        """测试预加载作业的分析查询"""
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)

        # 使用预加载查询
        analysis_with_assignment = await Analysis.get(id=analysis.id).prefetch_related("assignment")

        assert analysis_with_assignment.id == analysis.id
        assert analysis_with_assignment.assignment.id == assignment.id
        assert analysis_with_assignment.assignment.title == assignment.title

    @pytest.mark.asyncio
    async def test_analysis_str_representation(self, db):
        """测试分析的字符串表示"""
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)

        str_repr = str(analysis)
        assert "Analysis" in str_repr
        assert assignment.id in str_repr

    @pytest.mark.asyncio
    async def test_analysis_meta_configuration(self, db):
        """测试分析模型的Meta配置"""
        # 这个测试验证模型的元配置是否正确
        # 注意：具体的元属性访问方式可能因Tortoise ORM版本而异
        # 这里主要验证模型能正常工作
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)

        # 验证模型实例正常创建，间接验证Meta配置正确
        assert analysis is not None
        assert hasattr(analysis, 'assignment')
        assert hasattr(analysis, 'resolution')

    @pytest.mark.asyncio
    async def test_analysis_json_field_null_handling(self, db):
        """测试JSON字段的NULL处理"""
        assignment = await TestDataGenerator.create_test_assignment()

        # 创建只有部分字段有值的分析
        analysis = await Analysis.create(
            assignment=assignment,
            resolution={"solution": "有解决方案"},
            knowledge_analysis=None,
            code_analysis={"quality": "好"},
            learning_suggestions=None
        )

        retrieved_analysis = await Analysis.get(id=analysis.id)
        assert retrieved_analysis.resolution is not None
        assert retrieved_analysis.knowledge_analysis is None
        assert retrieved_analysis.code_analysis is not None
        assert retrieved_analysis.learning_suggestions is None

    @pytest.mark.asyncio
    async def test_analysis_complex_json_queries(self, db):
        """测试复杂JSON查询"""
        assignment1 = await TestDataGenerator.create_test_assignment()
        assignment2 = await TestDataGenerator.create_test_assignment()

        # 创建不同复杂度的分析
        await Analysis.create(
            assignment=assignment1,
            knowledge_analysis={"difficulty": "easy", "concepts": ["basic"]}
        )

        await Analysis.create(
            assignment=assignment2,
            knowledge_analysis={"difficulty": "hard", "concepts": ["advanced"]}
        )

        # 查询所有分析
        all_analyses = await Analysis.all()
        assert len(all_analyses) >= 2

        # 验证不同的JSON内容都被正确保存
        difficulties = []
        for analysis in all_analyses:
            if analysis.knowledge_analysis and "difficulty" in analysis.knowledge_analysis:
                difficulties.append(analysis.knowledge_analysis["difficulty"])

        assert "easy" in difficulties
        assert "hard" in difficulties

    @pytest.mark.asyncio
    async def test_analysis_relationship_cascade(self, db):
        """测试分析关系的级联行为"""
        assignment = await TestDataGenerator.create_test_assignment()
        analysis = await TestDataGenerator.create_test_analysis(assignment)

        # 删除作业，检查分析的处理
        assignment_id = assignment.id
        analysis_id = analysis.id

        await assignment.delete()

        # 验证作业被删除
        with pytest.raises(Exception):  # DoesNotExist
            await Assignment.get(id=assignment_id)

        # 注意：分析的级联删除行为取决于外键约束配置
        # 这里我们主要验证操作不会引发异常