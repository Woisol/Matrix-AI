import { MatrixAnalysisProps } from "../../pages/course/components/matrix-analyse.component"
import { AssignId } from "./general"

export type MdContent = string
//! MdCodeContent 需要手动加上 ```[语言类型]...```
export type MdCodeContent = string
//! CodeContent 不需要
export type CodeContent = string


export type CodeFileInfo = {
  fileName: string
  content: CodeContent
}

export type SubmitScoreStatus = 'not-submitted' | 'not-passed' | 'passed' | 'full-score'

export type TestSample = {
  input: MdCodeContent
  realOutput: MdCodeContent
  expectOutput?: MdCodeContent
}

export type Submit = {
  score: number | null
  time: Date
  testSample: TestSample[]
  submitCode: CodeFileInfo[]
}

export type Complexity = {
  time: string
  space: string
}

export type AssignData = {
  assignId: AssignId
  title: string
  description: MdContent
  //! 但是实际上只会有一个文件
  assignOriginalCode: CodeFileInfo[]

  submit?: Submit
}

export type BasicAnalysis = {
  resolution?: MatrixAnalysisProps
  knowledgeAnalysis?: MatrixAnalysisProps
}
export type AiGenAnalysis = {
  codeAnalysis?: MatrixAnalysisProps
  learningSuggestions?: MatrixAnalysisProps
}

export type Analysis = {
  basic: BasicAnalysis
  aiGen?: AiGenAnalysis
}
