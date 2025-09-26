import uuid
import logging
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
                # _assign = await course.assignments.all()
                course_data = CourseSchema(
                    courseId=course.id,
                    courseName=course.course_name,
                    assignment=await AssignDBtoSchema(course.assignments),
                    completed=course.completed,
                )
                course_list.append(course_data)

            return course_list
        except torExceptions.DoesNotExist:
            logging.warning("No courses found in database")
            raise HTTPException(status_code=404, detail="No courses found")
        except Exception as e:
            logging.error(f"Error occurred while listing courses: {str(e)}")
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
                    assignment= await AssignDBtoSchema(course.assignments),
                )
                course_list.append(course_data)

            return course_list
        except Exception as e:
            logging.error(f"Error occurred while listing todo courses: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def get_course(cls, course_id: str = Path(..., description="课程ID")):
        """根据ID获取单个课程详情"""
        try:
            course = await CourseModel.get(id=course_id).prefetch_related("assignments", "assignments__submissions")

            course_data = CourseSchema(
                courseId=course.id,
                courseName=course.course_name,
                assignment= await AssignDBtoSchema(course.assignments),
                completed=course.completed,
            )

            return course_data
        except torExceptions.DoesNotExist:
            logging.error(f"Course with id {course_id} not found")
            raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
        except Exception as e:
            logging.error(f"Error occurred while getting course {course_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


    @classmethod
    async def set_course(
        cls,
        courseId: str | None,
        courseName: str,
        type: str,
        status: str,
        completed: bool | None,
        assignmentIds: Optional[str]
    ):
        """创建或更新新课程"""
        try:
            # assignmentIdList = []
            # if assignmentIds and assignmentIds.strip():
            #     assignmentIdList = [aid.strip() for aid in assignmentIds.split(",") if aid.strip()]

            if courseId:
                course = await CourseModel.get(id=courseId)
                course.course_name = courseName
                course.type = type
                course.status = status
                course.completed = completed if completed is not None else course.completed
                await course.save()
            else:
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

                #@todo regain feature
                # 如果提供了作业ID列表，关联作业
                #! 暂时不支持直接修改 assignment
                # if assignmentIds and assignmentIds.strip():
                #     assignmentIdList = [aid.strip() for aid in assignmentIds.split(",") if aid.strip()]
                #     assignments = await Assignment.filter(id__in=assignmentIdList)
                #     if len(assignments) != len(assignmentIdList):
                #         # 有些作业ID不存在
                #         found_ids = [a.id for a in assignments]
                #         missing_ids = [aid for aid in assignmentIdList if aid not in found_ids]
                #         raise HTTPException(
                #             status_code=400,
                #             detail=f"Assignment IDs not found: {missing_ids}"
                #         )

                # # 建立多对多关联
                # await course.assignments.add(*assignments)

            # 重新获取课程数据（包含关联的作业）
            # course = await CourseModel.get(id=course.id)

            # course_data = CourseBase(
            #     courseId=course.id,
            #     courseName=course.course_name,
            # )

            return True
        except torExceptions.DoesNotExist:
            logging.error(f"Course with id {courseId} not found during update")
            raise HTTPException(status_code=404, detail=f"Course with id {courseId} not found")
        except torExceptions.ValidationError as e:
            logging.error(f"Validation error occurred while setting course: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid data provided: {str(e)}")
        except HTTPException:
            raise
        except Exception as e:
            logging.error(f"Error occurred while setting course: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def delete_course(cls, course_id: str):
        """删除课程"""
        try:
            course = await CourseModel.get(id=course_id)
            await course.delete()
            return True
        except torExceptions.DoesNotExist:
            logging.error(f"Course with id {course_id} not found during deletion")
            raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
        except Exception as e:
            logging.error(f"Error occurred while deleting course {course_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
