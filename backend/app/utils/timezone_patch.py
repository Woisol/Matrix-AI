"""
Tortoise ORM 时区修复 Monkey Patch
"""
from datetime import datetime
from tortoise import fields
from typing import Any, Optional

# 保存原始方法
_original_to_db_value = fields.DatetimeField.to_db_value

def patched_to_db_value(self, value: Any, instance: Any) -> Optional[datetime]:
    """修复 DatetimeField 的时区问题"""
    # 调用原始方法
    result = _original_to_db_value(self, value, instance)

    if result is None:
        return None

    # 保持 Tortoise 原生时区对象，避免二次转换导致时间偏移。
    return result

# 应用 monkey patch
fields.DatetimeField.to_db_value = patched_to_db_value

print("✓ 已应用 Tortoise ORM DatetimeField 补丁（保留原生时区）")