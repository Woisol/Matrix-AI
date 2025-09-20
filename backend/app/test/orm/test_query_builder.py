"""
测试 QueryBuilder 查询构建器功能
"""

import pytest
from datetime import datetime
from app.test.orm.conftest import TestUser, TestCourse, create_multiple_users, create_multiple_courses
from app.utils.orm import QueryBuilder, QueryType, get_connection_pool


class TestQueryBuilder:
    """测试 QueryBuilder 查询构建器"""
    
    async def test_query_builder_basic_select(self, clean_tables):
        """测试基础 SELECT 查询"""
        await create_multiple_users(3)
        
        query_builder = TestUser.query()
        assert query_builder._query_type == QueryType.SELECT
        assert query_builder._select_fields == ["*"]
        assert query_builder.table_name == "test_users"
        
        results = await query_builder.execute()
        assert len(results) == 3
    
    async def test_query_builder_select_specific_fields(self, clean_tables):
        """测试选择特定字段"""
        await create_multiple_users(2)
        
        results = await TestUser.query().select("username", "email").execute()
        
        assert len(results) == 2
        for result in results:
            assert "username" in result
            assert "email" in result
            # 其他字段不应该在结果中（除非数据库返回了所有字段）
    
    async def test_query_builder_where_conditions(self, clean_tables):
        """测试 WHERE 条件"""
        users = await create_multiple_users(5)
        
        # 等值条件
        active_users = await TestUser.query().where_eq("is_active", True).execute()
        assert len(active_users) == 3  # 偶数索引的用户是活跃的
        
        # 自定义条件
        young_users = await TestUser.query().where("age < $1", 23).execute()
        assert len(young_users) == 3  # age = 20, 21, 22
        
        # 多个条件
        young_active_users = await (TestUser.query()
                                   .where_eq("is_active", True)
                                   .where("age < $1", 23)
                                   .execute())
        assert len(young_active_users) == 2  # age = 20, 22 且活跃
    
    async def test_query_builder_where_in(self, clean_tables):
        """测试 WHERE IN 条件"""
        await create_multiple_users(5)
        
        # IN 条件
        specific_ages = await TestUser.query().where_in("age", [20, 22, 24]).execute()
        assert len(specific_ages) == 3
        
        # 空列表应该返回空结果
        empty_result = await TestUser.query().where_in("age", []).execute()
        assert len(empty_result) == 0
    
    async def test_query_builder_where_like(self, clean_tables):
        """测试 WHERE LIKE 条件"""
        await create_multiple_users(5)
        
        # LIKE 条件
        user_pattern = await TestUser.query().where_like("username", "user_%").execute()
        assert len(user_pattern) == 5  # 所有用户都匹配 user_% 模式
        
        # 更具体的模式
        specific_users = await TestUser.query().where_like("username", "user_1%").execute()
        assert len(specific_users) == 1  # 只有 user_1
    
    async def test_query_builder_where_between(self, clean_tables):
        """测试 WHERE BETWEEN 条件"""
        await create_multiple_users(5)
        
        # BETWEEN 条件
        middle_ages = await TestUser.query().where_between("age", 21, 23).execute()
        assert len(middle_ages) == 3  # age = 21, 22, 23
    
    async def test_query_builder_order_by(self, clean_tables):
        """测试 ORDER BY 排序"""
        await create_multiple_users(5)
        
        # 升序排序
        asc_users = await TestUser.query().order_by("age", "ASC").execute()
        ages = [user["age"] for user in asc_users]
        assert ages == sorted(ages)
        
        # 降序排序
        desc_users = await TestUser.query().order_by("age", "DESC").execute()
        ages = [user["age"] for user in desc_users]
        assert ages == sorted(ages, reverse=True)
        
        # 多字段排序
        multi_sort = await (TestUser.query()
                           .order_by("is_active", "DESC")
                           .order_by("age", "ASC")
                           .execute())
        assert len(multi_sort) == 5
    
    async def test_query_builder_limit_offset(self, clean_tables):
        """测试 LIMIT 和 OFFSET"""
        await create_multiple_users(10)
        
        # 只取前3个
        limited = await TestUser.query().limit(3).execute()
        assert len(limited) == 3
        
        # 跳过前5个，取3个
        offset_limited = await TestUser.query().offset(5).limit(3).execute()
        assert len(offset_limited) == 3
        
        # 跳过前15个（超过总数）
        over_offset = await TestUser.query().offset(15).execute()
        assert len(over_offset) == 0
    
    async def test_query_builder_count(self, clean_tables):
        """测试 COUNT 查询"""
        await create_multiple_users(7)
        
        # 总数统计
        total_count = await TestUser.query().count()
        assert total_count == 7
        
        # 条件统计
        active_count = await TestUser.query().where_eq("is_active", True).count()
        assert active_count == 4  # 偶数索引用户 + 第0个
        
        inactive_count = await TestUser.query().where_eq("is_active", False).count()
        assert inactive_count == 3
    
    async def test_query_builder_first(self, clean_tables):
        """测试获取第一条记录"""
        users = await create_multiple_users(5)
        
        # 获取第一个用户
        first_user = await TestUser.query().order_by("age", "ASC").first()
        assert first_user is not None
        assert first_user["age"] == 20  # 最小年龄
        
        # 没有匹配记录时
        no_match = await TestUser.query().where_eq("age", 999).first()
        assert no_match is None
    
    async def test_query_builder_joins(self, sample_user):
        """测试 JOIN 查询"""
        # 创建课程
        courses = await create_multiple_courses(sample_user.id, 3)
        
        pool = get_connection_pool()
        
        # 基础 JOIN
        joined_results = await (TestUser.query()
                               .select("test_users.username", "test_courses.course_name")
                               .join("test_courses", "test_users.id = test_courses.user_id")
                               .where_eq("test_users.id", sample_user.id)
                               .execute())
        
        assert len(joined_results) == 3  # 用户有3个课程
        
        # LEFT JOIN（应该包含没有课程的用户）
        await create_multiple_users(2)  # 创建没有课程的用户
        
        left_joined = await (TestUser.query()
                            .select("test_users.username", "test_courses.course_name")
                            .left_join("test_courses", "test_users.id = test_courses.user_id")
                            .execute())
        
        assert len(left_joined) >= 3  # 至少包含有课程的用户
    
    async def test_query_builder_group_by_having(self, clean_tables):
        """测试 GROUP BY 和 HAVING"""
        # 创建多个用户，年龄有重复
        for i in range(6):
            user = TestUser(
                username=f"group_user_{i}",
                email=f"group_user_{i}@example.com",
                age=20 + (i % 3)  # 年龄：20, 21, 22, 20, 21, 22
            )
            await user.save()
        
        # 按年龄分组统计
        grouped = await (TestUser.query()
                        .select("age", "COUNT(*) as count")
                        .group_by("age")
                        .order_by("age", "ASC")
                        .execute())
        
        assert len(grouped) == 3  # 3个不同的年龄组
        for group in grouped:
            assert group["count"] == 2  # 每个年龄组有2个用户
        
        # 使用 HAVING 过滤分组
        having_filtered = await (TestUser.query()
                                .select("age", "COUNT(*) as count")
                                .group_by("age")
                                .having("COUNT(*) > $1", 1)
                                .execute())
        
        assert len(having_filtered) == 3  # 所有组都有超过1个用户
    
    async def test_query_builder_complex_query(self, clean_tables):
        """测试复杂查询"""
        # 创建测试数据
        await create_multiple_users(10)
        
        # 复杂的查询：活跃用户，年龄在22-25之间，按年龄排序，取前3个
        complex_result = await (TestUser.query()
                               .select("username", "age", "is_active")
                               .where_eq("is_active", True)
                               .where_between("age", 22, 25)
                               .order_by("age", "ASC")
                               .limit(3)
                               .execute())
        
        assert len(complex_result) <= 3
        for user in complex_result:
            assert user["is_active"] is True
            assert 22 <= user["age"] <= 25
    
    async def test_query_builder_insert(self, clean_tables):
        """测试 INSERT 查询构建"""
        pool = get_connection_pool()
        query_builder = QueryBuilder("test_users", pool)
        
        # 设置为 INSERT 查询
        query_builder._query_type = QueryType.INSERT
        query_builder = query_builder.values(
            username="insert_test",
            email="insert@example.com",
            age=30,
            is_active=True
        )
        
        # 构建 INSERT SQL
        sql, params = query_builder.build_insert()
        
        assert "INSERT INTO test_users" in sql
        assert "VALUES" in sql
        assert "RETURNING *" in sql
        assert len(params) == 4
        assert "insert_test" in params
        assert "insert@example.com" in params
    
    async def test_query_builder_update(self, sample_user):
        """测试 UPDATE 查询构建"""
        pool = get_connection_pool()
        query_builder = QueryBuilder("test_users", pool)
        
        # 设置为 UPDATE 查询
        query_builder._query_type = QueryType.UPDATE
        query_builder = (query_builder
                        .values(email="updated@example.com", age=35)
                        .where_eq("id", sample_user.id))
        
        # 构建 UPDATE SQL
        sql, params = query_builder.build_update()
        
        assert "UPDATE test_users" in sql
        assert "SET" in sql
        assert "WHERE" in sql
        assert "RETURNING *" in sql
        assert "updated@example.com" in params
        assert 35 in params
        assert sample_user.id in params
    
    async def test_query_builder_delete(self, sample_user):
        """测试 DELETE 查询构建"""
        pool = get_connection_pool()
        query_builder = QueryBuilder("test_users", pool)
        
        # 设置为 DELETE 查询
        query_builder._query_type = QueryType.DELETE
        query_builder = query_builder.where_eq("id", sample_user.id)
        
        # 构建 DELETE SQL
        sql, params = query_builder.build_delete()
        
        assert "DELETE FROM test_users" in sql
        assert "WHERE" in sql
        assert sample_user.id in params
    
    async def test_query_builder_chaining(self, clean_tables):
        """测试查询构建器的链式调用"""
        await create_multiple_users(10)
        
        # 测试方法链式调用
        result = await (TestUser.query()
                       .select("username", "age")
                       .where_eq("is_active", True)
                       .where("age > $1", 21)
                       .order_by("age", "ASC")
                       .limit(3)
                       .offset(1)
                       .execute())
        
        assert len(result) <= 3
        for user in result:
            assert "username" in user
            assert "age" in user
    
    async def test_query_builder_sql_injection_protection(self, clean_tables):
        """测试 SQL 注入防护"""
        await create_multiple_users(3)
        
        # 尝试 SQL 注入（应该被参数化查询阻止）
        malicious_input = "'; DROP TABLE test_users; --"
        
        # 这应该安全地查找用户名为恶意字符串的用户（不存在）
        results = await TestUser.query().where_eq("username", malicious_input).execute()
        assert len(results) == 0
        
        # 验证表仍然存在
        all_users = await TestUser.query().execute()
        assert len(all_users) == 3  # 表未被删除
    
    async def test_query_builder_empty_conditions(self, clean_tables):
        """测试空条件查询"""
        await create_multiple_users(5)
        
        # 没有任何条件的查询
        all_results = await TestUser.query().execute()
        assert len(all_results) == 5
        
        # 空的 WHERE IN 列表
        empty_in = await TestUser.query().where_in("id", []).execute()
        assert len(empty_in) == 0
    
    async def test_query_builder_parameter_indexing(self, clean_tables):
        """测试参数索引的正确性"""
        await create_multiple_users(5)
        
        # 多个参数的查询
        query_builder = TestUser.query()
        query_builder = (query_builder
                        .where("age > $1", 20)
                        .where("age < $1", 24)
                        .where_like("username", "user_%"))
        
        sql, params = query_builder.build_select()
        
        # 检查参数数量和索引
        assert len(params) == 3
        assert 20 in params
        assert 24 in params
        assert "user_%" in params
        
        # 执行查询应该成功
        results = await query_builder.execute()
        assert isinstance(results, list)