import { AssigId } from "./general"

export type MdContent = string

export type Submit = {
  time: Date
  submitCode: string
  score: number | null
}

export type AssigData = {
  assigId: AssigId
  title: string
  description: MdContent

  submit?: Submit

  analysis?: MdContent | null
}