import {Metadata} from "./metadata";

export interface Submission {
  id: number;
  submitter: string;
  filename: string;
  maxSimilarity: number;
  filepath: string;
  pairIds: string[];
  content: string;
  metadata: Metadata;
}
