"""
课程控制器
"""
import uuid
import logging
from typing import Optional, List
from fastapi import HTTPException, Path

from app.models import Course as CourseModel, Assignment, fetch_all, fetch_one
from app.utils.assign import AssignDBtoSchemaNative


async def list_courses():
    """获取所有课程列表"""
    try:
        courses = await CourseModel.all()
        course_list = []

        for course in courses:
            # 获取课程的作业
            rows = await fetch_all(
                """SELECT a.* FROM assignments a
                   JOIN courses_assignments ca ON a.id = ca.assignment_id
                   WHERE ca.courses_id = $1""",
                course.id
            )
            # 将 dict 转换为 Assignment 对象列表
            assignments = [Assignment(**row) for row in rows]
            assignment_items = await AssignDBtoSchemaNative(assignments)

            course_data = {
                "courseId": course.id,
                "courseName": course.course_name,
                "assignment": assignment_items,
                "completed": course.completed,
            }
            course_list.append(course_data)

        return course_list
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error occurred while listing courses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def list_todo_courses():
    """获取待完成的课程列表（未完成的课程）"""
    try:
        courses = await CourseModel.filter(completed=False)
        course_list = []

        for course in courses:
            rows = await fetch_all(
                """SELECT a.* FROM assignments a
                   JOIN courses_assignments ca ON a.id = ca.assignment_id
                   WHERE ca.courses_id = $1""",
                course.id
            )
            assignments = [Assignment(**row) for row in rows]
            assignment_items = await AssignDBtoSchemaNative(assignments)

            course_data = {
                "courseId": course.id,
                "courseName": course.course_name,
                "assignment": assignment_items,
            }
            course_list.append(course_data)

        return course_list
    except Exception as e:
        logging.error(f"Error occurred while listing todo courses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_course(course_id: str = Path(..., description="课程ID")):
    """根据ID获取单个课程详情"""
    try:
        course = await CourseModel.get(id=course_id)

        rows = await fetch_all(
            """SELECT a.* FROM assignments a
               JOIN courses_assignments ca ON a.id = ca.assignment_id
               WHERE ca.courses_id = $1""",
            course_id
        )
        assignments = [Assignment(**row) for row in rows]
        assignment_items = await AssignDBtoSchemaNative(assignments)

        return {
            "courseId": course.id,
            "courseName": course.course_name,
            "assignment": assignment_items,
            "completed": course.completed,
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error occurred while getting course {course_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def set_course(
    courseId: str | None,
    courseName: str,
    type: str,
    status: str,
    completed: bool | None,
    assignmentIds: Optional[str]
):
    """创建或更新新课程"""
    try:
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
                completed=False
            )

        return True
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error occurred while setting course: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def delete_course(course_id: str):
    """删除课程"""
    try:
        course = await CourseModel.get(id=course_id)
        await course.delete()
        return True
    except Exception as e:
        logging.error(f"Error occurred while deleting course {course_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
