import {MarkingOffsets} from "./marking-offsets";

export interface SpecialMarking {
  type: "PLAG" | "CODE" | "TEMPLATE" | "MISSPELLED";
  first: MarkingOffsets;
  second?: MarkingOffsets;
}
