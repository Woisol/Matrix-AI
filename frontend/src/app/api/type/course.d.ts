import { AssignId, CourseId } from "./general"

export type AllCourse = Omit<TodoCourse, 'assigment'> & {
  completed: boolean
  assignment?: AssignmentListItem[]
}

export type TodoCourse = {
  courseId: CourseId
  courseName: string
  assignment: AssignmentListItem[]
}
export type AssignmentListItem = {
  assignId: AssignId
  assignmentName: string
  type: 'choose' | 'program'
  score: number | null
  ddl: Date | null
}
