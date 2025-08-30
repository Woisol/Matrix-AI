import uuid
from fastapi import APIRouter, HTTPException, Query, Path, Body, Form
from typing import Optional, List

from app.controller.course import CourseController
from app.schemas.course import Course as CourseSchema,CourseBase, TodoCourse, CourseCreateRequest, AssignmentListItem

course_router = APIRouter(tags=["course"])

@course_router.get("/courses", response_model=List[CourseSchema])
async def list_courses():
    return await CourseController.list_courses()

@course_router.get("/courses/todo", response_model=list[TodoCourse])
async def list_todo_courses():
    return await CourseController.list_todo_courses()

@course_router.get("/courses/{course_id}", response_model=CourseSchema)
async def get_course(
    course_id: str = Path(..., description="课程ID")
):
    return await CourseController.get_course(course_id=course_id)

@course_router.post("/courses", response_model=bool)
async def set_course(
    course:CourseCreateRequest = Body(..., description="课程信息")
    # courseId: str | None = Form(None, description="课程ID，若不传则创建新课程"),
    # courseName: str = Form(...,min_length=1, description="课程名称"),
    # type: str = Form("public", description="课程类型: public, private"),
    # status: str = Form("open", description="课程状态: open, close"),
    # completed: bool | str | None = Form(None, description="课程是否完成"),
    # assignmentIds: str | None = Form(None, description="关联的作业ID列表")
):
    # if isinstance(course.completed, str):
    #     course.completed = course.completed.lower() == 'true'
    #@todo @RunningKuma 似乎存在 type 和 status 无法更新的情况
    return await CourseController.set_course(courseId=course.courseId, courseName=course.courseName, type=course.type, status=course.status, completed=course.completed, assignmentIds=course.assignmentIds)

@course_router.delete("/courses/{course_id}", response_model=bool)
async def delete_course(
    course_id: str = Path(..., description="课程ID")
):
    return await CourseController.delete_course(course_id=course_id)
