# -*- coding: utf-8 -*-
"""
AI-Matrix 业务类型定义
从 TypeScript 类型转换而来

生成时间: 2025-09-14T14:45:46.491Z
"""

from pydantic import BaseModel, Field\nfrom enum import Enum\nfrom typing import Optional, List, Dict, Union, Annotated\nfrom datetime import datetime\n\n# 自定义类型别名\nMdContent = Annotated[str, Field(..., description='Markdown内容')]\nMdCodeContent = Annotated[str, Field(..., description='Markdown代码内容，注意包含```xxx```')]\nCodeContent = Annotated[str, Field(..., description='代码内容')]\nJSONStr = Annotated[str, Field(..., description='JSON字符串')]\nID = Annotated[str, Field(..., description='唯一标识符')]\n\n# 数据模型\n# | 'javascript' | 'typescript'\nclass CodeFileInfo(BaseModel):\n    fileName: str = Field(...)\n    content: CodeContent\n\nclass TestSample(BaseModel):\n    input: MdCodeContent\n    realOutput: MdCodeContent\n    expectOutput: Optional[MdCodeContent] = None\n\nclass Submit(BaseModel):\n    score: Union[float, null] = Field(...)\n    time: datetime = Field(...)\n    testSample: List[List[TestSample]] = Field(...)\n    submitCode: List[List[CodeFileInfo]] = Field(...)\n\nclass Complexity(BaseModel):\n    time: str = Field(...)\n    space: str = Field(...)\n\nclass AssignData(BaseModel):\n    assignId: AssignId = Field(...)\n    title: str = Field(...)\n    description: MdContent\n    # ! 但是实际上只会有一个文件\n    assignOriginalCode: List[List[CodeFileInfo]] = Field(..., description='! 但是实际上只会有一个文件')\n    ddl: Optional[datetime] = None\n    submit: Optional[Submit] = None\n\nclass BasicAnalysis(BaseModel):\n    resolution: Optional[MatrixAnalysisProps] = None\n    knowledgeAnalysis: Optional[MatrixAnalysisProps] = None\n\nclass AiGenAnalysis(BaseModel):\n    codeAnalysis: Optional[MatrixAnalysisProps] = None\n    learningSuggestions: Optional[MatrixAnalysisProps] = None\n\nclass Analysis(BaseModel):\n    basic: BasicAnalysis = Field(...)\n    aiGen: Optional[AiGenAnalysis] = None\n\nclass TodoCourse(BaseModel):\n    courseId: CourseId = Field(...)\n    courseName: str = Field(...)\n    assignment: List[List[AssignmentListItem]] = Field(...)\n\nclass AssignmentListItem(BaseModel):\n    assignId: AssignId = Field(...)\n    assignmentName: str = Field(...)\n    type: Union['choose', 'program'] = Field(...)\n    score: Union[float, null] = Field(...)\n    ddl: Union[datetime, null] = Field(...)\n\n# 类型别名\nID = str\nCourseId = ID\nAssignId = ID\nMdContent = str\n# ! MdCodeContent 需要手动加上 ```[语言类型]...```\nMdCodeContent = str\n# ! CodeContent 不需要\nCodeContent = str\nJSONStr = str\nCodeLanguage = 'c_cpp'\nSubmitScoreStatus = Union['not-submitted', 'not-passed', 'passed', 'full-score']\nAssignTransProps = Union[Omit<AssignData, 'assignOriginalCode', 'submit'> & {
  assignOriginalCode: JSONStr
  testSample: string
  ddl: string
}]\nAllCourse = Omit<TodoCourse, 'assigment'> & {
  completed: boolean
  assignment?: AssignmentListItem[]
}\nCourseTransProps = Omit<AllCourse, 'assignment'> & {
  assignmentIds: string // 逗号分隔
}