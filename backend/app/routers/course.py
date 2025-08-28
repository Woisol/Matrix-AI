import uuid
from fastapi import APIRouter, HTTPException, Query, Path, Body, Form
from typing import Optional, List

from app.controller.course import CourseController
from app.schemas.course import Course as CourseSchema,CourseBase, TodoCourse, CourseCreateRequest, AssignmentListItem

course_router = APIRouter(prefix="/api", tags=["course"])

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

@course_router.post("/courses", response_model=CourseBase)
async def create_course(
    courseName: str = Form(...,min_length=1, description="课程名称"),
    type: str = Form("public", description="课程类型: public, private"),
    status: str = Form("open", description="课程状态: open, close"),
    assignmentIds: Optional[str] = Form(None, description="关联的作业ID列表")
):
    return await CourseController.create_course(courseName=courseName,type=type,status=status,assignmentIds=assignmentIds)

@course_router.delete("/courses/{course_id}", response_model=bool)
async def delete_course(
    course_id: str = Path(..., description="课程ID")
):
    return await CourseController.delete_course(course_id=course_id)
