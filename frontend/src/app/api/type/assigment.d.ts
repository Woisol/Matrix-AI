import { MatrixAnalysisProps } from "../../pages/course/components/matrix-analyse.component"
import { AssigId } from "./general"

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
  submitCode: string
}

export type Complexity = {
  time: string
  space: string
}

export type AssigData = {
  assigId: AssigId
  title: string
  description: MdContent
  //! 但是实际上只会有一个文件
  assigOriginalCode: CodeFileInfo[]

  submit?: Submit

  analysis?: {
    basic: {
      resolution?: MatrixAnalysisProps
      knowledgeAnalysis?: MatrixAnalysisProps
    }
    aiGen?: {
      codeAnalysis?: MatrixAnalysisProps
      learningSuggestions?: MatrixAnalysisProps
    }
  }
}