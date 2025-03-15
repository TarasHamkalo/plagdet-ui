import {Node} from "@swimlane/ngx-graph";
import {Submission} from "../model/submission";

export interface SubmissionNode extends Node {
  submission: Submission;
}
