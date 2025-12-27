"""
存储过程和触发器初始化模块
"""
import re
from pathlib import Path
from app.models.base import get_db, execute

CURRENT_DIR = Path(__file__).parent.parent


async def init_procedures():
    """初始化存储过程（支持 OpenGauss）"""
    procedures_file = CURRENT_DIR / "constants" / "procedures.sql"
    if not procedures_file.exists():
        print(f"警告: 存储过程文件不存在: {procedures_file}")
        return

    with open(procedures_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    conn = await get_db()
    try:
        # 使用正则表达式提取完整的 FUNCTION 和 PROCEDURE 定义

        # 1. 提取并执行所有 FUNCTION（PostgreSQL 格式：$$ LANGUAGE plpgsql;）
        function_pattern = r'CREATE OR REPLACE FUNCTION.*?\$\$ LANGUAGE plpgsql;'
        functions = re.findall(function_pattern, sql_content, re.DOTALL | re.IGNORECASE)

        for i, func_sql in enumerate(functions, 1):
            func_sql = func_sql.strip()
            if func_sql:
                # 提取函数名用于日志
                name_match = re.search(r'FUNCTION\s+(\w+)', func_sql, re.IGNORECASE)
                func_name = name_match.group(1) if name_match else f"函数#{i}"

                try:
                    await conn.execute(func_sql)
                    print(f"✓ 创建函数成功: {func_name}")
                except Exception as e:
                    print(f"✗ 创建函数失败 ({func_name}): {e}")

        # 2. 提取并执行所有 PROCEDURE（OpenGauss 格式：以 / 结尾）
        # 匹配从 CREATE OR REPLACE PROCEDURE 到 END; 后的 /
        procedure_pattern = r'CREATE OR REPLACE PROCEDURE.*?END;[\s]*/'
        procedures = re.findall(procedure_pattern, sql_content, re.DOTALL | re.IGNORECASE)

        for i, proc_sql in enumerate(procedures, 1):
            # 移除结尾的 /（OpenGauss 可能不需要在 execute 中传递）
            proc_sql = proc_sql.strip().rstrip('/')
            if proc_sql:
                # 提取存储过程名用于日志
                name_match = re.search(r'PROCEDURE\s+(\w+)', proc_sql, re.IGNORECASE)
                proc_name = name_match.group(1) if name_match else f"存储过程#{i}"

                try:
                    await conn.execute(proc_sql)
                    print(f"✓ 创建存储过程成功: {proc_name}")
                except Exception as e:
                    print(f"✗ 创建存储过程失败 ({proc_name}): {e}")
                    # 打印 SQL 用于调试
                    print(f"SQL 预览: {proc_sql[:200]}...")

        total = len(functions) + len(procedures)
        print(f"存储过程初始化完成 (共 {total} 个对象)")
    except Exception as e:
        print(f"存储过程初始化失败: {e}")
        raise
    finally:
        await conn.close()


async def init_triggers():
    """初始化触发器"""
    triggers_file = CURRENT_DIR / "constants" / "triggers.sql"
    if not triggers_file.exists():
        print(f"警告: 触发器文件不存在: {triggers_file}")
        return

    with open(triggers_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    conn = await get_db()
    try:
        # 先执行函数定义（触发器使用的函数）
        func_statements = sql_content.split('CREATE OR REPLACE FUNCTION')
        for stmt in func_statements[1:]:
            stmt = stmt.strip()
            if stmt:
                full_stmt = 'CREATE OR REPLACE FUNCTION ' + stmt
                await conn.execute(full_stmt)

        # 再执行触发器定义 - 先删除所有旧触发器，再创建新的
        lines = sql_content.split('\n')
        in_trigger = False
        current_trigger = []

        for line in lines:
            stripped = line.strip()
            if stripped.startswith('CREATE TRIGGER'):
                in_trigger = True
                current_trigger = [line]
            elif in_trigger:
                current_trigger.append(line)
                if stripped.startswith('LANGUAGE plpgsql'):
                    in_trigger = False
                    trigger_sql = '\n'.join(current_trigger)
                    trigger_name = current_trigger[0].split()[2]

                    # 提取表名
                    for l in current_trigger:
                        if ' ON ' in l:
                            table_name = l.split(' ON ')[1].split()[0]
                            break
                    else:
                        continue

                    # 先删除触发器（OpenGauss 语法）
                    try:
                        await conn.execute(f"DROP TRIGGER {trigger_name} ON {table_name}")
                    except Exception:
                        pass  # 如果不存在就跳过

                    # 创建触发器
                    await conn.execute(trigger_sql)
                    current_trigger = []

        print("触发器初始化成功")
    except Exception as e:
        print(f"触发器初始化失败: {e}")
    finally:
        await conn.close()


async def init_all_advanced_sql():
    """初始化所有高级 SQL 对象（存储过程、触发器）"""
    await init_procedures()
    await init_triggers()
