import { testAllCourseList, testTodoCourseList } from "../test/course"
import { api } from "../util/fetch";

export const courseOps = {
  // @todo 确定 url
  getTodoCourseList: async () => {
    return await api.get('/courses/todo') ?? testTodoCourseList
  },
  getAllCourseList: async () => {
    return await api.get('/courses') ?? testAllCourseList
  },
} as const;