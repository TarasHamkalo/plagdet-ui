import {Overview} from "./overview";
import {Submission} from "./submission";
import {SubmissionPair} from "./submission-pair";

export interface Report {
  overview: Overview;
  submissions: Map<number, Submission>;
  pairs: Map<string, SubmissionPair>;
}
