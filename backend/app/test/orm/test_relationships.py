"""
测试模型关系管理功能
"""

import pytest
from app.test.orm.conftest import (
    TestUser, TestCourse, TestAssignment, TestUserProfile,
    create_multiple_users, create_multiple_courses, create_multiple_assignments
)
from app.utils.orm import RelationType, RelatedManager, get_connection_pool


class TestRelationshipManagement:
    """测试模型关系管理"""
    
    async def test_one_to_many_relationship_definition(self, sample_user):
        """测试一对多关系定义"""
        # 检查关系定义
        assert hasattr(TestUser, '_relationships')
        assert 'courses' in TestUser._relationships
        
        relationship = TestUser._relationships['courses']
        assert relationship.relation_type == RelationType.ONE_TO_MANY
        assert relationship.related_model == "TestCourse"
        assert relationship.foreign_key == "user_id"
    
    async def test_many_to_one_relationship_definition(self, sample_course):
        """测试多对一关系定义"""
        # 检查关系定义
        assert hasattr(TestCourse, '_relationships')
        assert 'owner' in TestCourse._relationships
        
        relationship = TestCourse._relationships['owner']
        assert relationship.relation_type == RelationType.MANY_TO_ONE
        assert relationship.related_model == "TestUser"
        assert relationship.foreign_key == "user_id"
    
    async def test_many_to_many_relationship_definition(self, sample_course):
        """测试多对多关系定义"""
        # 检查关系定义
        assert hasattr(TestCourse, '_relationships')  
        assert 'assignments' in TestCourse._relationships
        
        relationship = TestCourse._relationships['assignments']
        assert relationship.relation_type == RelationType.MANY_TO_MANY
        assert relationship.related_model == "TestAssignment"
        assert relationship.through == "test_course_assignments"
    
    async def test_related_manager_creation(self, sample_user):
        """测试关系管理器创建"""
        # 访问关系属性应该创建 RelatedManager
        courses_manager = sample_user.courses
        assert isinstance(courses_manager, RelatedManager)
        assert courses_manager.relationship.relation_type == RelationType.ONE_TO_MANY
    
    async def test_one_to_many_add_objects(self, sample_user):
        """测试一对多关系添加对象"""
        # 创建课程
        course1 = TestCourse(
            id="course1",
            course_name="课程1",
            description="第一个课程"
        )
        await course1.save()
        
        course2 = TestCourse(
            id="course2", 
            course_name="课程2",
            description="第二个课程"
        )
        await course2.save()
        
        # 通过关系添加课程
        await sample_user.courses.add(course1, course2)
        
        # 验证外键设置正确
        updated_course1 = await TestCourse.find_by_id("course1")
        updated_course2 = await TestCourse.find_by_id("course2")
        
        assert updated_course1.user_id == sample_user.id
        assert updated_course2.user_id == sample_user.id
    
    async def test_one_to_many_get_all_objects(self, sample_user):
        """测试一对多关系获取所有对象"""
        # 创建关联的课程
        courses = await create_multiple_courses(sample_user.id, 3)
        
        # 通过关系获取所有课程
        user_courses = await sample_user.courses.all()
        
        assert len(user_courses) == 3
        for course in user_courses:
            assert isinstance(course, TestCourse)
            assert course.user_id == sample_user.id
    
    async def test_one_to_many_remove_objects(self, sample_user):
        """测试一对多关系移除对象"""
        # 创建关联的课程
        courses = await create_multiple_courses(sample_user.id, 2)
        
        # 移除一个课程的关联
        await sample_user.courses.remove(courses[0])
        
        # 验证外键被清空
        updated_course = await TestCourse.find_by_id(courses[0].id)
        assert updated_course.user_id is None
        
        # 另一个课程应该仍然关联
        updated_course2 = await TestCourse.find_by_id(courses[1].id)
        assert updated_course2.user_id == sample_user.id
    
    async def test_one_to_many_clear_all(self, sample_user):
        """测试一对多关系清除所有关联"""
        # 创建关联的课程
        await create_multiple_courses(sample_user.id, 3)
        
        # 清除所有关联
        await sample_user.courses.clear()
        
        # 验证所有课程的外键都被清空
        all_courses = await TestCourse.all()
        for course in all_courses:
            assert course.user_id is None
    
    async def test_one_to_many_count(self, sample_user):
        """测试一对多关系计数"""
        # 初始计数应该为0
        initial_count = await sample_user.courses.count()
        assert initial_count == 0
        
        # 创建关联的课程
        await create_multiple_courses(sample_user.id, 4)
        
        # 验证计数
        course_count = await sample_user.courses.count()
        assert course_count == 4
    
    async def test_many_to_one_relationship(self, sample_user, sample_course):
        """测试多对一关系"""
        # 设置课程的拥有者
        sample_course.user_id = sample_user.id
        await sample_course.save()
        
        # 通过关系获取拥有者
        course_owners = await sample_course.owner.all()
        
        assert len(course_owners) == 1
        owner = course_owners[0]
        assert isinstance(owner, TestUser)
        assert owner.id == sample_user.id
        assert owner.username == sample_user.username
    
    async def test_many_to_many_add_objects(self, sample_course):
        """测试多对多关系添加对象"""
        # 创建作业
        assignments = await create_multiple_assignments(3)
        
        # 通过关系添加作业
        await sample_course.assignments.add(*assignments)
        
        # 验证中间表记录
        pool = get_connection_pool()
        count = await pool.fetchval(
            "SELECT COUNT(*) FROM test_course_assignments WHERE course_id = $1",
            sample_course.id
        )
        assert count == 3
        
        # 验证关系
        course_assignments = await sample_course.assignments.all()
        assert len(course_assignments) == 3
        
        assignment_ids = {a.id for a in course_assignments}
        expected_ids = {a.id for a in assignments}
        assert assignment_ids == expected_ids
    
    async def test_many_to_many_remove_objects(self, sample_course):
        """测试多对多关系移除对象"""
        # 创建并添加作业
        assignments = await create_multiple_assignments(3)
        await sample_course.assignments.add(*assignments)
        
        # 移除一个作业
        await sample_course.assignments.remove(assignments[0])
        
        # 验证中间表记录减少
        pool = get_connection_pool()
        count = await pool.fetchval(
            "SELECT COUNT(*) FROM test_course_assignments WHERE course_id = $1",
            sample_course.id
        )
        assert count == 2
        
        # 验证关系
        remaining_assignments = await sample_course.assignments.all()
        assert len(remaining_assignments) == 2
        
        removed_assignment_found = False
        for assignment in remaining_assignments:
            if assignment.id == assignments[0].id:
                removed_assignment_found = True
                break
        assert not removed_assignment_found
    
    async def test_many_to_many_clear_all(self, sample_course):
        """测试多对多关系清除所有关联"""
        # 创建并添加作业
        assignments = await create_multiple_assignments(4)
        await sample_course.assignments.add(*assignments)
        
        # 清除所有关联
        await sample_course.assignments.clear()
        
        # 验证中间表记录被清空
        pool = get_connection_pool()
        count = await pool.fetchval(
            "SELECT COUNT(*) FROM test_course_assignments WHERE course_id = $1",
            sample_course.id
        )
        assert count == 0
        
        # 验证关系
        course_assignments = await sample_course.assignments.all()
        assert len(course_assignments) == 0
    
    async def test_many_to_many_count(self, sample_course):
        """测试多对多关系计数"""
        # 初始计数
        initial_count = await sample_course.assignments.count()
        assert initial_count == 0
        
        # 添加作业
        assignments = await create_multiple_assignments(5)
        await sample_course.assignments.add(*assignments)
        
        # 验证计数
        assignment_count = await sample_course.assignments.count()
        assert assignment_count == 5
    
    async def test_many_to_many_duplicate_prevention(self, sample_course):
        """测试多对多关系防止重复添加"""
        # 创建作业
        assignment = await create_multiple_assignments(1)
        assignment = assignment[0]
        
        # 多次添加同一个作业
        await sample_course.assignments.add(assignment)
        await sample_course.assignments.add(assignment)
        await sample_course.assignments.add(assignment)
        
        # 应该只有一条记录
        pool = get_connection_pool()
        count = await pool.fetchval(
            "SELECT COUNT(*) FROM test_course_assignments WHERE course_id = $1 AND assignment_id = $2",
            sample_course.id, assignment.id
        )
        assert count == 1
        
        # 关系计数也应该是1
        assignment_count = await sample_course.assignments.count()
        assert assignment_count == 1
    
    async def test_reverse_many_to_many_relationship(self, sample_assignment):
        """测试反向多对多关系"""
        # 创建课程
        courses = []
        for i in range(3):
            course = TestCourse(
                id=f"reverse_course_{i}",
                course_name=f"反向课程 {i}",
                user_id=1  # 假设用户ID为1
            )
            await course.save()
            courses.append(course)
        
        # 从作业端添加课程关联
        await sample_assignment.courses.add(*courses)
        
        # 验证关系
        assignment_courses = await sample_assignment.courses.all()
        assert len(assignment_courses) == 3
        
        # 从课程端验证反向关系
        for course in courses:
            course_assignments = await course.assignments.all()
            assert len(course_assignments) == 1
            assert course_assignments[0].id == sample_assignment.id
    
    async def test_one_to_one_relationship(self, sample_user):
        """测试一对一关系（通过用户档案）"""
        # 创建用户档案
        profile = TestUserProfile(
            user_id=sample_user.id,
            avatar_url="https://example.com/avatar.jpg",
            bio="用户简介",
            settings={"theme": "dark"}
        )
        await profile.save()
        
        # 通过关系获取档案
        user_profiles = await sample_user.profile.all()
        
        assert len(user_profiles) == 1
        user_profile = user_profiles[0]
        assert isinstance(user_profile, TestUserProfile)
        assert user_profile.user_id == sample_user.id
        assert user_profile.bio == "用户简介"
    
    async def test_relationship_with_empty_results(self, sample_user):
        """测试没有关联对象的关系"""
        # 用户没有课程
        courses = await sample_user.courses.all()
        assert len(courses) == 0
        
        # 计数应该为0
        count = await sample_user.courses.count()
        assert count == 0
    
    async def test_relationship_lazy_loading(self, sample_user):
        """测试关系的延迟加载"""
        # 创建课程
        await create_multiple_courses(sample_user.id, 2)
        
        # 首次访问关系属性
        courses_manager = sample_user.courses
        assert isinstance(courses_manager, RelatedManager)
        
        # 实际查询在调用 all() 时发生
        courses = await courses_manager.all()
        assert len(courses) == 2
    
    async def test_relationship_complex_queries(self, clean_tables):
        """测试关系的复杂查询场景"""
        # 创建多个用户和课程
        users = await create_multiple_users(3)
        
        # 为每个用户创建不同数量的课程
        for i, user in enumerate(users, 1):
            await create_multiple_courses(user.id, i)
        
        # 验证每个用户的课程数量
        for i, user in enumerate(users, 1):
            course_count = await user.courses.count()
            assert course_count == i
            
            courses = await user.courses.all()
            assert len(courses) == i
            
            # 验证课程都属于正确的用户
            for course in courses:
                assert course.user_id == user.id
    
    async def test_relationship_cascade_operations(self, sample_user):
        """测试关系的级联操作"""
        # 创建课程
        courses = await create_multiple_courses(sample_user.id, 2)
        
        # 删除用户后，课程应该仍然存在但外键为空
        await sample_user.delete()
        
        # 验证课程仍然存在
        remaining_courses = await TestCourse.all()
        assert len(remaining_courses) == 2
        
        # 但外键应该为空（具体行为取决于数据库约束设置）
        # 这里只是测试基本的删除操作不会影响关联对象
    
    async def test_relationship_manager_caching(self, sample_user):
        """测试关系管理器缓存"""
        # 多次访问同一关系应该返回同一个管理器实例
        manager1 = sample_user.courses
        manager2 = sample_user.courses
        
        assert manager1 is manager2
        assert id(manager1) == id(manager2)
    
    async def test_relationship_with_filters(self, sample_user):
        """测试关系结合查询过滤器"""
        # 创建不同状态的课程
        published_course = TestCourse(
            id="published_course",
            course_name="已发布课程",
            user_id=sample_user.id,
            is_published=True
        )
        await published_course.save()
        
        draft_course = TestCourse(
            id="draft_course", 
            course_name="草稿课程",
            user_id=sample_user.id,
            is_published=False
        )
        await draft_course.save()
        
        # 通过基础查询获取特定状态的课程
        published_courses = await TestCourse.filter(
            user_id=sample_user.id,
            is_published=True
        )
        assert len(published_courses) == 1
        assert published_courses[0].id == "published_course"
        
        draft_courses = await TestCourse.filter(
            user_id=sample_user.id,
            is_published=False
        )
        assert len(draft_courses) == 1
        assert draft_courses[0].id == "draft_course"