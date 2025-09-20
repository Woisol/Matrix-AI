"""
PostgreSQL ORM 框架使用示例

这个示例展示了如何使用我们自定义的 PostgreSQL ORM 框架
"""

import asyncio
from datetime import datetime
from app.utils.orm import (
    init_database, close_database, BaseModel, Field, FieldType,
    one_to_many, many_to_one, many_to_many, foreign_key,
    transaction, BatchOperation, Migration,
    get_database_info, execute_raw_sql, get_connection_pool
)


# 定义模型
class User(BaseModel):
    """用户模型"""
    __table_name__ = "users"
    
    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    username = Field(FieldType.VARCHAR, max_length=50, unique=True, nullable=False)
    email = Field(FieldType.VARCHAR, max_length=100, unique=True, nullable=False)
    code_style = Field(FieldType.TEXT, nullable=True, description="代码风格 AI 总结")
    knowledge_status = Field(FieldType.TEXT, nullable=True, description="知识掌握情况 AI 总结")
    is_active = Field(FieldType.BOOLEAN, default=True)
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)
    
    # 关系定义
    courses = one_to_many("Course", "user_id", "owner")
    profile = one_to_many("UserProfile", "user_id", "user")


class Course(BaseModel):
    """课程模型"""
    __table_name__ = "courses"
    
    id = Field(FieldType.VARCHAR, max_length=50, primary_key=True)
    course_name = Field(FieldType.VARCHAR, max_length=200, nullable=False)
    description = Field(FieldType.TEXT, nullable=True)
    type = Field(FieldType.VARCHAR, max_length=20, default="public")
    status = Field(FieldType.VARCHAR, max_length=20, default="open")
    completed = Field(FieldType.BOOLEAN, default=False)
    user_id = foreign_key("User")
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)
    updated_at = Field(FieldType.TIMESTAMP, default=datetime.now)
    
    # 关系定义
    owner = many_to_one("User", "user_id", "courses")
    assignments = many_to_many("Assignment", "course_assignments", "courses")


class Assignment(BaseModel):
    """作业模型"""
    __table_name__ = "assignments"
    
    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    title = Field(FieldType.VARCHAR, max_length=200, nullable=False)
    description = Field(FieldType.TEXT, nullable=True)
    difficulty = Field(FieldType.VARCHAR, max_length=20, default="medium")
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)
    
    # 关系定义
    courses = many_to_many("Course", "course_assignments", "assignments")


class UserProfile(BaseModel):
    """用户配置模型"""
    __table_name__ = "user_profiles"
    
    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    user_id = foreign_key("User")
    avatar_url = Field(FieldType.VARCHAR, max_length=255, nullable=True)
    bio = Field(FieldType.TEXT, nullable=True)
    settings = Field(FieldType.JSON, default={})
    
    # 关系定义
    user = many_to_one("User", "user_id", "profile")


async def create_tables():
    """创建所有表"""
    print("Creating tables...")
    await User.create_table()
    await Course.create_table()
    await Assignment.create_table()
    await UserProfile.create_table()
    
    # 创建多对多关系的中间表
    pool = get_connection_pool()
    await pool.execute("""
        CREATE TABLE IF NOT EXISTS course_assignments (
            id SERIAL PRIMARY KEY,
            course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
            assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
            UNIQUE(course_id, assignment_id)
        )
    """)
    print("Tables created successfully!")


async def demo_basic_operations():
    """演示基础操作"""
    print("\n=== 基础操作演示 ===")
    
    # 创建用户
    user = User(
        username="john_doe",
        email="john@example.com",
        code_style="喜欢简洁的代码风格",
        knowledge_status="掌握 Python 基础语法"
    )
    await user.save()
    print(f"Created user: {user}")
    
    # 查询用户
    found_user = await User.get(username="john_doe")
    print(f"Found user: {found_user}")
    
    # 更新用户
    found_user.knowledge_status = "掌握 Python 高级特性"
    await found_user.save()
    print(f"Updated user: {found_user}")
    
    # 创建课程
    course = Course(
        id="python-101",
        course_name="Python 基础课程",
        description="学习 Python 编程基础",
        user_id=found_user.id
    )
    await course.save()
    print(f"Created course: {course}")
    
    return found_user, course


async def demo_query_builder():
    """演示查询构建器"""
    print("\n=== 查询构建器演示 ===")
    
    # 复杂查询
    users = await User.query().where("created_at > $1", datetime(2024, 1, 1)).order_by("username", "ASC").execute()
    print(f"Users created after 2024-01-01: {len(users)}")
    
    # 链式查询
    active_users = await (User.query()
                         .where_eq("is_active", True)
                         .where_like("username", "john%")
                         .limit(10)
                         .execute())
    print(f"Active users with name starting with 'john': {len(active_users)}")
    
    # 聚合查询
    user_count = await User.query().count()
    print(f"Total users: {user_count}")


async def demo_relationships():
    """演示关系操作"""
    print("\n=== 关系操作演示 ===")
    
    # 获取用户和课程
    user = await User.get(username="john_doe")
    if not user:
        print("User not found")
        return
    
    # 通过关系获取用户的课程
    user_courses = await user.courses.all()
    print(f"User courses: {len(user_courses)}")
    
    # 创建作业
    assignment1 = Assignment(
        title="Python 变量和数据类型",
        description="学习 Python 基本数据类型"
    )
    await assignment1.save()
    
    assignment2 = Assignment(
        title="Python 控制流",
        description="学习 if/for/while 语句"
    )
    await assignment2.save()
    
    # 为课程添加作业（多对多关系）
    if user_courses:
        course = user_courses[0]
        await course.assignments.add(assignment1, assignment2)
        
        # 获取课程的所有作业
        course_assignments = await course.assignments.all()
        print(f"Course assignments: {len(course_assignments)}")
        
        # 统计课程作业数量
        assignment_count = await course.assignments.count()
        print(f"Assignment count: {assignment_count}")


async def demo_transactions():
    """演示事务操作"""
    print("\n=== 事务操作演示 ===")
    
    try:
        async with transaction() as tx:
            # 在事务中创建多个用户
            user1 = User(username="alice", email="alice@example.com")
            await user1.save()
            
            user2 = User(username="bob", email="bob@example.com")
            await user2.save()
            
            # 创建保存点
            savepoint = await tx.savepoint("users_created")
            
            # 尝试创建重复用户（应该失败）
            try:
                user3 = User(username="alice", email="duplicate@example.com")  # 重复用户名
                await user3.save()
            except Exception as e:
                print(f"Error creating duplicate user: {e}")
                # 回滚到保存点
                await tx.rollback_to_savepoint(savepoint)
            
            print("Transaction completed successfully")
    
    except Exception as e:
        print(f"Transaction failed: {e}")


async def demo_batch_operations():
    """演示批量操作"""
    print("\n=== 批量操作演示 ===")
    
    # 创建批量操作器
    batch = BatchOperation(User, batch_size=100)
    
    # 添加批量插入数据
    for i in range(5):
        batch.add_insert(
            username=f"user_{i}",
            email=f"user_{i}@example.com",
            code_style=f"代码风格 {i}",
            knowledge_status=f"知识状态 {i}"
        )
    
    # 执行批量操作
    results = await batch.execute_all()
    print(f"Batch operation results: {results}")
    
    print(f"Inserted {len(results['inserted'])} users")


async def demo_data_validation():
    """演示数据验证"""
    print("\n=== 数据验证演示 ===")
    
    # 创建用户
    user = User(username="test_user", email="test@example.com")
    
    # 转换为 Pydantic 模型进行验证
    try:
        pydantic_user = user.to_pydantic()
        print(f"Validation passed: {pydantic_user}")
        
        # 验证数据
        validated_data = user.validate_data()
        print(f"Validated data: {validated_data}")
        
    except Exception as e:
        print(f"Validation failed: {e}")


async def demo_migrations():
    """演示数据库迁移"""
    print("\n=== 数据库迁移演示 ===")
    
    pool = get_connection_pool()
    migration = Migration(pool)
    
    # 创建迁移表
    await migration.create_migration_table()
    
    # 应用示例迁移
    await migration.apply_migration(
        "001_add_user_last_login",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP"
    )
    
    # 获取已应用的迁移
    applied_migrations = await migration.get_applied_migrations()
    print(f"Applied migrations: {applied_migrations}")


async def demo_raw_sql():
    """演示原始 SQL 执行"""
    print("\n=== 原始 SQL 演示 ===")
    
    # 执行原始查询
    results = await execute_raw_sql("SELECT COUNT(*) as user_count FROM users")
    print(f"Raw SQL result: {results}")
    
    # 获取数据库信息
    db_info = await get_database_info()
    print(f"Database info: {db_info}")


async def main():
    """主函数"""
    # PostgreSQL 连接字符串
    # 请根据实际情况修改连接参数
    dsn = "postgresql://username:password@localhost:5432/ai_matrix"
    
    try:
        # 初始化数据库连接
        await init_database(dsn, min_size=5, max_size=20)
        print("Database initialized successfully!")
        
        # 创建表
        await create_tables()
        
        # 演示各种功能
        await demo_basic_operations()
        await demo_query_builder()
        await demo_relationships()
        await demo_transactions()
        await demo_batch_operations()
        await demo_data_validation()
        await demo_migrations()
        await demo_raw_sql()
        
        print("\n=== 演示完成 ===")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # 关闭数据库连接
        await close_database()
        print("Database connection closed.")


if __name__ == "__main__":
    asyncio.run(main())