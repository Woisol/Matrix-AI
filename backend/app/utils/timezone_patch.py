"""
Tortoise ORM 时区修复 Monkey Patch
"""
import asyncpg
from datetime import datetime, timezone
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

    # 确保返回 naive datetime
    if hasattr(result, 'tzinfo') and result.tzinfo is not None:
        # 转换为 UTC 然后移除时区信息
        result = result.astimezone(timezone.utc).replace(tzinfo=None)

    return result

# 应用 monkey patch
fields.DatetimeField.to_db_value = patched_to_db_value

print("✓ 已应用 Tortoise ORM 时区修复补丁")