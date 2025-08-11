import { AllCourse, AssignmentListItem, TodoCourse } from "../type/course";
import { CourseId } from "../type/general";

export const testTodoCourseList: TodoCourse[] = [
  {
    courseId: '1',
    courseName: 'LeetCode',
    assignment: [
      {
        assignId: '1',
        assignmentName: 'T1 合并列表',
        type: 'choose',
        score: null,
        ddl: null,
      },
      {
        assignId: '2',
        assignmentName: 'T2 合并列表',
        type: 'choose',
        score: 100,
        ddl: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        assignId: '3',
        assignmentName: 'T3 合并列表',
        type: 'program',
        score: 80,
        ddl: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        assignId: '4',
        assignmentName: 'T4 合并列表',
        type: 'program',
        score: 0,
        ddl: null,
      },
    ]
  },
  {
    courseId: '2',
    courseName: '程序设计II（23 级）',
    assignment: [
      {
        assignId: '1',
        assignmentName: 'T1 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
      {
        assignId: '2',
        assignmentName: 'T2 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
      {
        assignId: '3',
        assignmentName: 'T2 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
    ]
  },
  {
    courseId: '3',
    courseName: '程序设计I（23 级）',
    assignment: [
    ]
  },
]
export const testAllCourseList: AllCourse[] = [
  {
    courseId: '1',
    courseName: 'LeetCode',
    completed: false,
    assignment: [
      {
        assignId: '1',
        assignmentName: 'T1 合并列表',
        type: 'choose',
        score: null,
        ddl: null,
      },
      {
        assignId: '2',
        assignmentName: 'T2 合并列表',
        type: 'choose',
        score: 100,
        ddl: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        assignId: '3',
        assignmentName: 'T3 合并列表',
        type: 'program',
        score: 80,
        ddl: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        assignId: '4',
        assignmentName: 'T4 合并列表',
        type: 'program',
        score: 0,
        ddl: null,
      },
    ],
  },
  {
    courseId: '2',
    courseName: '程序设计II（23 级）',
    completed: false,
    assignment: [
      {
        assignId: '1',
        assignmentName: 'T1 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
      {
        assignId: '2',
        assignmentName: 'T2 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
      {
        assignId: '3',
        assignmentName: 'T2 二叉树',
        type: 'program',
        score: null,
        ddl: null
      },
    ],
  },
  {
    courseId: '3',
    courseName: '程序设计I（23 级）',
    completed: true,
    assignment: [
    ],
  },
]

export const testAllAssigns = (courseId: CourseId): AssignmentListItem[] => {
  const course = testTodoCourseList.find(c => c.courseId === courseId);
  return course ? course.assignment : [];
}
