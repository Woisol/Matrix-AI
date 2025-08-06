import { AssigId } from "./general"

export type MdContent = string
export type CodeContent = string

export type SubmitScoreStatus = 'not-submitted' | 'not-passed' | 'passed' | 'full-score'

export type TestSample = {
  input: CodeContent
  realOutput: CodeContent
  expectOutput?: CodeContent
}

export type Submit = {
  score: number | null
  time: Date
  testSample: TestSample[]
  submitCode: string
}

export type AssigData = {
  assigId: AssigId
  title: string
  description: MdContent

  submit?: Submit

  analysis?: MdContent | null
}