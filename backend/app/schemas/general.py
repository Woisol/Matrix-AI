from typing import Annotated
from pydantic import Field

# 使用 Annotated 来定义 ID 类型
ID = Annotated[str, Field(description="通用ID类型")]

CourseId = Annotated[str, Field(description="课程ID类型")]

AssignId = Annotated[str, Field(description="作业ID类型")]