import {MarkingOffsets} from "./marking-offsets";
import {SpecialMarkingType} from "./special-marking-type";

export interface SpecialMarking {
  type: SpecialMarkingType;
  first: MarkingOffsets;
  second?: MarkingOffsets;
  comments?: string[];
}
