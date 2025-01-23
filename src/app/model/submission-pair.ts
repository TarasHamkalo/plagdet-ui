import {PlagScore} from "./plag-score";
import {PlagCase} from "./plag-case";

export interface SubmissionPair {
  id: string;
  firstId: number;
  secondId: number;
  plagScores: PlagScore[];
  plagCases: PlagCase[];
}
