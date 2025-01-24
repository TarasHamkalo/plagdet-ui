import {PlagScore} from "./plag-score";
import {SpecialMarking} from "./special-marking";

export interface SubmissionPair {
  id: string;
  firstId: number;
  secondId: number;
  plagScores: PlagScore[];
  plagCases: SpecialMarking[];
}
