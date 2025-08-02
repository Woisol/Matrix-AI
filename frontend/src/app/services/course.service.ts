import { Injectable } from "@angular/core";

export type CourseListItem = {
  courseName: string
  assigment: AssigmentListItem[]

}
export type AssigmentListItem = {
  assigmentName: string
  type: 'choose' | 'program'
  score: number | null
  ddl: Date | null
}
@Injectable({
  providedIn: 'root'
})
export class CourseInfo {
  courseListItems: CourseListItem[] = [
    {
      courseName: 'LeetCode',
      assigment: [
        {
          assigmentName: 'T1 合并列表',
          type: 'choose',
          score: null,
          ddl: null,
        },
        {
          assigmentName: 'T2 合并列表',
          type: 'choose',
          score: 100,
          ddl: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          assigmentName: 'T3 合并列表',
          type: 'program',
          score: 80,
          ddl: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          assigmentName: 'T4 合并列表',
          type: 'program',
          score: 0,
          ddl: null,
        },
      ]
    },
    {
      courseName: '程序设计II（23 级）',
      assigment: [
        {
          assigmentName: 'T1 二叉树',
          type: 'program',
          score: null,
          ddl: null
        },
        {
          assigmentName: 'T2 二叉树',
          type: 'program',
          score: null,
          ddl: null
        },
        {
          assigmentName: 'T2 二叉树',
          type: 'program',
          score: null,
          ddl: null
        },
      ]
    }
  ]
}