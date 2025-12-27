# 导入 create-table.sql 的 DDL 语句
from pathlib import Path

# 读取 SQL 文件
SQL_FILE_PATH = Path(__file__).parent / "create-table.sql"

with open(SQL_FILE_PATH, "r", encoding="utf-8") as f:
    CREATE_TABLES_SQL = f.read()
