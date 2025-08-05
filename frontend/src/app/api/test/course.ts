import { AllCourse, TodoCourse } from "../type/course";

export const testTodoCourseList: TodoCourse[] = [
  {
    courseId: '1',
    courseName: 'LeetCode',
    assigment: [
      {
        assigId: '1',
        assigmentName: 'T1 合并列表',
        type: 'choose',
        score: null,
        ddl: null,
      },
      {
        assigId: '2',
        assigmentName: 'T2 合并列表',
        type: 'choose',
        score: 100,
        ddl: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        assigId: '3',
        assigmentName: 'T3 合并列表',
        type: 'program',
        score: 80,
        ddl: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        assigId: '4',
        assigmentName: 'T4 合并列表',
        type: 'program',
        score: 0,
        ddl: null,
      },
    ]
  },
  {
    courseId: '2',
    courseName: '程序设计II（23 级）',
    assigment: [
      {
        assigId: '1',
        assigmentName: 'T1 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
      {
        assigId: '2',
        assigmentName: 'T2 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
      {
        assigId: '3',
        assigmentName: 'T2 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
    ]
  },
  {
    courseId: '3',
    courseName: '程序设计I（23 级）',
    assigment: [
    ]
  },
]
export const testAllCourseList: AllCourse[] = [
  {
    courseId: '1',
    courseName: 'LeetCode',
    completed: false,
  },
  {
    courseId: '2',
    courseName: '程序设计II（23 级）',
    completed: false,
  },
  {
    courseId: '3',
    courseName: '程序设计I（23 级）',
    completed: true,
  },
]

