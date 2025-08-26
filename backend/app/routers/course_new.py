from fastapi import APIRouter, HTTPException, Query, Path, Body
from typing import Optional, List
from datetime import datetime

from app.models.course import Course, CourseAssignment, CourseAssignmentSubmission
from app.schemas.course import (
    CourseListResponse, CourseResponse, CourseUpdate, CourseCreate,
    CourseAssignmentResponse, CourseAssignmentDetail, CourseAssignmentUpdate, CourseAssignmentCreate,
    SubmissionResponse, SubmissionCreate, SubmissionFeedback, RejudgeRequest,
    MessageResponse, ErrorResponse
)
from tortoise.exceptions import DoesNotExist

course_router = APIRouter(prefix="/api", tags=["course"])

@course_router.get("/courses", response_model=List[CourseListResponse]) 
async def list_courses():
    pass
    

