import { AssignId, CourseId } from "./general"

export type AllCourse = Omit<TodoCourse, 'assigment'> & {
  completed: boolean
  assignment?: AssignmentListItem[]
}

export type TodoCourse = {
  courseId: CourseId
  courseName: string //! 设计失误，另有 AssignData.title
  assignment: AssignmentListItem[]
}
export type AssignmentListItem = {
  assignId: AssignId
  assignmentName: string
  type: 'choose' | 'program'
  score: number | null
  ddl: Date | null
}

export type CourseTransProps = Omit<AllCourse, 'assignment'> & {
  assignmentIds: string // 逗号分隔
}