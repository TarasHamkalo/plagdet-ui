export interface Cluster {
  name: string;
  avgSimilarity: number;
  avgEditTime: number;
  numberOfSubmissions: number;
  // there should be a set reference to actual submissions
}
