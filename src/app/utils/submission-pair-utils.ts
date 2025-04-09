import {SubmissionPair} from "../model/submission-pair";
import {PlagScore} from "../model/plag-score";
import {Submission} from "../model/submission";

export class SubmissionPairUtils {

  public static compareByScore(
    a: SubmissionPair,
    b: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): number {
    const firstScore = SubmissionPairUtils.getScoreByType(a, type);
    const secondScore = SubmissionPairUtils.getScoreByType(b, type);
    if (!firstScore) {
      return -1;
    }

    if (!secondScore) {
      return 1;
    }

    return firstScore.score - secondScore.score;
  }

  public static getFormattedScore(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC",
    decimals = 2
  ): string {
    const plagScore = this.getScoreByType(pair, type);
    if (plagScore !== null) {
      return this.formatScore(plagScore.score, decimals);
    }

    return "0 %";
  }

  public static formatScore(score: number, decimals = 2): string {
    return (score * 100).toFixed(decimals) + " %";
  }

  public static getScoreByType(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): PlagScore | null {
    if (pair !== null) {
      const score = pair.plagScores.find(p => p.type === type);
      return score ? score : null;
    }

    return null;
  }


  public static hasIndexedSubmission(
    submissionPair: SubmissionPair,
    submissionMap: Map<number, Submission>
  ): boolean {
    const first = submissionMap.get(submissionPair.firstId);
    const second = submissionMap.get(submissionPair.secondId);
    return first!.indexed || second!.indexed;
  }

}
