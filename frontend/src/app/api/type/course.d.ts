import { AssignId, CourseId } from "./general"

export type AllCourse = Omit<TodoCourse, 'assigment'> & {
  completed: boolean
  assigment?: AssigmentListItem[]
}

export type TodoCourse = {
  courseId: CourseId
  courseName: string
  assigment: AssigmentListItem[]
}
export type AssigmentListItem = {
  assigId: AssignId
  assigmentName: string
  type: 'choose' | 'program'
  score: number | null
  ddl: Date | null
}
