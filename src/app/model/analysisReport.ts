import {Analysis} from "./analysis";
import {Submission} from "./submission";
import {SubmissionPair} from "./submission-pair";

export interface AnalysisReport {
  analysis: Analysis;
  submissions: Map<number, Submission>;
  pairs: Map<string, SubmissionPair>;
}
