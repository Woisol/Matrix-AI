import { SubmitScoreStatus } from "../type/assigment";

export function getSubmitScoreStatus(score: number | null | undefined): SubmitScoreStatus {
  if (score === undefined || score === null) {
    return 'not-submitted';
  } else if (score < 60) {
    return 'not-passed';
  } else if (score < 100) {
    return 'passed';
  } else {
    return 'full-score';
  }
}