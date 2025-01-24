import {MarkingOffsets} from "./marking-offsets";

export interface SpecialMarking {
  type: "PLAG" | "CODE" | "TEMPLATE";
  first: MarkingOffsets;
  second?: MarkingOffsets;
}
