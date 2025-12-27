"""
测试存储过程初始化和调用
"""
import asyncio
import logging
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.base import get_pool, close_pool, execute, fetch_one, fetch_all
from app.models.procedures import init_procedures
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)


async def test_procedure_init():
    """测试存储过程初始化"""
    print("=" * 60)
    print("开始测试存储过程初始化")
    print("=" * 60)

    try:
        # 初始化连接池
        pool = await get_pool()
        print("✓ 数据库连接池初始化成功")

        # 初始化存储过程
        await init_procedures()
        print("✓ 存储过程初始化完成")

        # 检查存储过程是否存在
        conn = await pool.acquire()
        try:
            # 查询 pg_proc 表检查存储过程
            result = await conn.fetch("""
                SELECT proname, prokind
                FROM pg_proc
                WHERE proname IN ('upsert_assignment_analysis', 'submit_assignment')
            """)

            print(f"\n找到的存储过程/函数:")
            for row in result:
                kind = 'PROCEDURE' if row['prokind'] == 'p' else 'FUNCTION'
                print(f"  - {row['proname']} ({kind})")

            if not result:
                print("⚠ 未找到存储过程！")
                return False

            # 检查是否有 submit_assignment
            has_submit = any(r['proname'] == 'submit_assignment' for r in result)
            if has_submit:
                print("\n✓ submit_assignment 存储过程已创建")
            else:
                print("\n✗ submit_assignment 存储过程未找到！")
                return False

        finally:
            await pool.release(conn)

        return True

    except Exception as e:
        print(f"\n✗ 错误: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        await close_pool()


async def test_procedure_call():
    """测试存储过程调用"""
    print("\n" + "=" * 60)
    print("开始测试存储过程调用")
    print("=" * 60)

    try:
        # 初始化连接池
        pool = await get_pool()

        # 测试调用（使用测试数据）
        test_assign_id = "test_assign_" + str(os.getpid())
        test_student_id = "Matrix AI"
        test_score = 85.5
        test_output = '["output1", "output2"]'
        test_code = '[{"fileName": "test.cpp", "content": "int main() {}"}]'

        print(f"\n调用参数:")
        print(f"  assignment_id: {test_assign_id}")
        print(f"  student_id: {test_student_id}")
        print(f"  score: {test_score}")

        # 调用存储过程
        result = await execute(
            "CALL submit_assignment($1, $2, $3, $4, $5)",
            test_assign_id,
            test_student_id,
            test_score,
            test_output,
            test_code
        )

        print(f"\n✓ 存储过程调用成功")
        print(f"  返回结果: {result}")

        # 验证数据是否插入
        row = await fetch_one(
            "SELECT * FROM assignment_submissions WHERE assignment_id = $1 AND student_id = $2",
            test_assign_id,
            test_student_id
        )

        if row:
            print(f"\n✓ 数据插入验证成功")
            print(f"  记录ID: {row['id']}")
            print(f"  分数: {row['score']}")
        else:
            print(f"\n✗ 数据插入验证失败：未找到记录")
            return False

        # 测试更新（第二次调用）
        new_score = 95.0
        result = await execute(
            "CALL submit_assignment($1, $2, $3, $4, $5)",
            test_assign_id,
            test_student_id,
            new_score,
            test_output,
            test_code
        )

        print(f"\n✓ 存储过程更新调用成功")

        # 验证更新
        row = await fetch_one(
            "SELECT * FROM assignment_submissions WHERE assignment_id = $1 AND student_id = $2",
            test_assign_id,
            test_student_id
        )

        if row and row['score'] == new_score:
            print(f"✓ 数据更新验证成功")
            print(f"  更新后分数: {row['score']}")
        else:
            print(f"✗ 数据更新验证失败")
            return False

        # 清理测试数据
        await execute(
            "DELETE FROM assignment_submissions WHERE assignment_id = $1",
            test_assign_id
        )
        print(f"\n✓ 测试数据清理完成")

        return True

    except Exception as e:
        print(f"\n✗ 错误: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        await close_pool()


async def main():
    """主测试函数"""
    # 测试初始化
    init_ok = await test_procedure_init()

    if init_ok:
        # 测试调用
        call_ok = await test_procedure_call()

        if call_ok:
            print("\n" + "=" * 60)
            print("✓ 所有测试通过！")
            print("=" * 60)
        else:
            print("\n" + "=" * 60)
            print("✗ 存储过程调用测试失败")
            print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("✗ 存储过程初始化测试失败")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
