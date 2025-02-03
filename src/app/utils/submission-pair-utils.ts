import {SubmissionPair} from "../model/submission-pair";
import {PlagScore} from "../model/plag-score";

export class SubmissionPairUtils {

  public static getFormattedScore(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): string {
    const plagScore = this.getScoreByType(pair, type);
    if (plagScore !== null) {
      return (plagScore?.score * 100).toFixed(2) + " %";
    }

    return "0";
  }

  private static getScoreByType(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): PlagScore | null {
    if (pair !== null) {
      const score = pair.plagScores.find(p => p.type === type);
      return score ? score : null;
    }

    return null;
  }


}
