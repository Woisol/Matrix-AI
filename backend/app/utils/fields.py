"""
自定义 DatetimeField 来处理时区问题
"""
from tortoise import fields
from datetime import datetime, timezone
from typing import Optional, Any


class NaiveDatetimeField(fields.DatetimeField):
    """
    自定义 DatetimeField，确保存储和检索的都是 naive datetime
    """
    
    def __init__(self, auto_now_add: bool = False, auto_now: bool = False, **kwargs):
        self.auto_now_add = auto_now_add
        self.auto_now = auto_now
        super().__init__(**kwargs)
    
    def to_python_value(self, value: Any) -> Optional[datetime]:
        """将数据库值转换为 Python 值"""
        if value is None:
            return None
        
        # 调用父类方法获取 datetime 对象
        dt = super().to_python_value(value)
        
        # 如果是 aware datetime，转换为 naive（移除时区信息）
        if dt and dt.tzinfo is not None:
            dt = dt.replace(tzinfo=None)
        
        return dt
    
    def to_db_value(self, value: Any, instance: Any) -> Optional[datetime]:
        """将 Python 值转换为数据库值"""
        # 检查是否需要自动设置时间
        current_time = datetime.utcnow()
        
        # 如果是 auto_now，总是返回当前时间
        if self.auto_now:
            return current_time
        
        # 如果是 auto_now_add 且是新建记录（没有 pk 或 pk 为空）
        if self.auto_now_add:
            # 检查是否是新建记录
            pk_value = getattr(instance, instance._meta.pk_field, None)
            if pk_value is None or (hasattr(instance, '_saved_in_db') and not instance._saved_in_db):
                return current_time
            
        if value is None:
            return None
            
        # 确保传入的 datetime 是 naive
        if hasattr(value, 'tzinfo') and value.tzinfo is not None:
            # 转换为 UTC 然后移除时区信息
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        
        return value


# 导出供模型使用
__all__ = ['NaiveDatetimeField']