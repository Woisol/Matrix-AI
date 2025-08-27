import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Path, Body, Form
from tortoise import exceptions as torExceptions

from app.models.course import Course as CourseModel
from app.models.assignment import Assignment
from app.schemas.course import Course as CourseSchema,CourseBase, TodoCourse, CourseCreateRequest, AssignmentListItem

from app.utils.assign import AssignDBtoSchema


class CourseController:
    """课程控制器"""
    @classmethod
    async def list_courses(cls):
        """获取所有课程列表"""
        try:
            courses = await CourseModel.all().prefetch_related("assignments", "assignments__submissions")
            course_list = []

            for course in courses:
                course_data = CourseSchema(
                    courseId=course.id,
                    courseName=course.course_name,
                    assignment=AssignDBtoSchema(course.assignments),
                    completed=course.completed,
                )
                course_list.append(course_data)

            return course_list
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail="No courses found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    @classmethod
    async def list_todo_courses(cls):
        """获取待完成的课程列表（未完成的课程）"""
        try:
            courses = await CourseModel.filter(completed=False).prefetch_related("assignments", "assignments__submissions")
            course_list = []

            for course in courses:
                # 转换作业数据

                course_data = TodoCourse(
                    courseId=course.id,
                    courseName=course.course_name,
                    assignment=AssignDBtoSchema(course.assignments),
                )
                course_list.append(course_data)

            return course_list
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def get_course(cls, course_id: str = Path(..., description="课程ID")):
        """根据ID获取单个课程详情"""
        try:
            course = await CourseModel.get(id=course_id).prefetch_related("assignments", "assignments__submissions")

            course_data = CourseSchema(
                courseId=course.id,
                courseName=course.course_name,
                assignment=AssignDBtoSchema(course.assignments),
                completed=course.completed,
            )

            return course_data
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    
    @classmethod
    async def create_course(
        cls,
        courseName: str = Form(...,min_length=1, description="课程名称"),
        type: str = Form("public", description="课程类型: public, private"),
        status: str = Form("open", description="课程状态: open, close"),
        assignmentIds: Optional[str] = Form(None, description="关联的作业ID列表")
    ):
        """创建新课程"""
        try:
            assignmentIdList = []
            if assignmentIds and assignmentIds.strip():
                assignmentIdList = [aid.strip() for aid in assignmentIds.split(",") if aid.strip()]

            # 创建课程
            course = await CourseModel.create(
                id=uuid.uuid4().hex,
                course_name=courseName,
                type=type,
                status=status,
                # description=description,
                # creator_name=creatorName,
                completed=False
            )

            # 如果提供了作业ID列表，关联作业
            if assignmentIdList:
                assignments = await Assignment.filter(id__in=assignmentIdList)
                if len(assignments) != len(assignmentIdList):
                    # 有些作业ID不存在
                    found_ids = [a.id for a in assignments]
                    missing_ids = [aid for aid in assignmentIdList if aid not in found_ids]
                    raise HTTPException(
                        status_code=400,
                        detail=f"Assignment IDs not found: {missing_ids}"
                    )

                # 建立多对多关联
                await course.assignments.add(*assignments)

            # 重新获取课程数据（包含关联的作业）
            course = await CourseModel.get(id=course.id)

            course_data = CourseBase(
                courseId=course.id,
                courseName=course.course_name,
            )

            return course_data
        except torExceptions.ValidationError:
            raise HTTPException(status_code=400, detail=f"Invalid data provided")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
