import {Metadata} from "./metadata";
import {SpecialMarking} from "./special-marking";

export interface Submission {
  id: number;
  indexed: boolean;
  submitter: string;
  filename: string;
  maxSimilarity: number;
  filepath: string;
  pairIds: string[];
  content: string;
  metadata: Metadata;
  markings: SpecialMarking[];
}
