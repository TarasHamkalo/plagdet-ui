export interface PlagScore {
  score: number;
  type: "META" | "JACCARD" | "SEMANTIC";
  comments: string[];
}
