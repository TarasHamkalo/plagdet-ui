import {Submission} from "../model/submission";

export interface Cluster {
  id: string;
  submissions: Submission[];
}
