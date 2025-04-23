import {SpecialMarking} from "./positioning/special-marking";
import {FileData} from "./filedata";

export interface Submission {
  id: number;
  indexed: boolean;
  fileData: FileData;
  maxSimilarity?: number;
  pairIds: string[];
  markings: SpecialMarking[];
  content: string;
}
