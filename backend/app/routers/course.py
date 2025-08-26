from fastapi import APIRouter, HTTPException, Query, Path, Body
from typing import Optional, List
from datetime import datetime

from app.models.course import Course as CourseModel, Assignment, AssignmentSubmission
from app.schemas.course import Course as CourseSchema, TodoCourse, CourseCreateRequest, AssignmentListItem
from app.schemas.assignment import AssignData
from tortoise import exceptions as torExceptions

course_router = APIRouter(prefix="/api", tags=["course"])

@course_router.get("/courses", response_model=List[CourseSchema])
async def list_courses():
    """获取所有课程列表"""
    try:
        courses = await CourseModel.all().prefetch_related("assignments")
        course_list = []

        for course in courses:
            # 转换作业数据，title → assignmentName
            assignments:list[AssignmentListItem] = []
            for assignment in course.assignments:
                assignments.append({
                    "assignId": assignment.id,
                    "assignmentName": assignment.title,  # title 映射为 assignmentName
                    "type": assignment.type,
                    "score": assignment.score,
                    "ddl": assignment.end_date
                })

            course_data = CourseSchema(
                courseId=course.id,
                courseName=course.course_name,
                assignment=assignments,
                completed=course.completed
            )
            course_list.append(course_data)

        return course_list
    except torExceptions.DoesNotExist:
        raise HTTPException(status_code=404, detail="No courses found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@course_router.get("/courses/todo", response_model=list[TodoCourse])
async def list_todo_courses():
    """获取待完成的课程列表（未完成的课程）"""
    try:
        courses = await CourseModel.filter(completed=False).prefetch_related("assignments")
        course_list = []

        for course in courses:
            # 转换作业数据
            assignments:list[AssignmentListItem] = []
            for assignment in course.assignments:
                assignments.append({
                    "assignId": assignment.id,
                    "assignmentName": assignment.title,
                    "type": assignment.type,
                    "score": assignment.score,
                    "ddl": assignment.end_date
                })

            course_data = TodoCourse(
                courseId=course.id,
                courseName=course.course_name,
                assignment=assignments
            )
            course_list.append(course_data)

        return course_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@course_router.get("/courses/{course_id}", response_model=CourseSchema)
async def get_course(course_id: str = Path(..., description="课程ID")):
    """根据ID获取单个课程详情"""
    try:
        course = await CourseModel.get(id=course_id).prefetch_related("assignments")

        # 转换作业数据
        assignments = []
        for assignment in course.assignments:
            assignments.append({
                "assignId": assignment.id,
                "assignmentName": assignment.title,
                "type": assignment.type,
                "score": assignment.score,
                "ddl": assignment.end_date
            })

        course_data = CourseSchema(
            courseId=course.id,
            courseName=course.course_name,
            assignment=assignments,
            completed=course.completed
        )

        return course_data
    except torExceptions.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@course_router.post("/courses", response_model=CourseSchema)
async def create_course(course_request: CourseCreateRequest):
    """创建新课程"""
    try:
        # 检查课程ID是否已存在
        existing_course = await CourseModel.filter(id=course_request.courseId).first()
        if existing_course:
            raise HTTPException(status_code=400, detail=f"Course with id {course_request.courseId} already exists")

        # 创建课程
        course = await CourseModel.create(
            id=course_request.courseId,
            course_name=course_request.courseName,
            type=course_request.type,
            status=course_request.status,
            description=course_request.description,
            creator_name=course_request.creatorName,
            completed=False
        )

        # 如果提供了作业ID列表，关联作业
        if course_request.assignmentIds:
            assignments = await Assignment.filter(id__in=course_request.assignmentIds)
            if len(assignments) != len(course_request.assignmentIds):
                # 有些作业ID不存在
                found_ids = [a.id for a in assignments]
                missing_ids = [aid for aid in course_request.assignmentIds if aid not in found_ids]
                raise HTTPException(
                    status_code=400,
                    detail=f"Assignment IDs not found: {missing_ids}"
                )

            # 建立多对多关联
            await course.assignments.add(*assignments)

        # 重新获取课程数据（包含关联的作业）
        course = await CourseModel.get(id=course.id).prefetch_related("assignments")

        # 转换作业数据
        assignments_data = []
        for assignment in course.assignments:
            assignments_data.append({
                "assignId": assignment.id,
                "assignmentName": assignment.title,
                "type": assignment.type,
                "score": assignment.score,
                "ddl": assignment.end_date
            })

        course_data = CourseSchema(
            courseId=course.id,
            courseName=course.course_name,
            assignment=assignments_data,
            completed=course.completed
        )

        return course_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
