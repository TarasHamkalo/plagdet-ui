import {SubmissionPair} from "../model/submission-pair";
import {PlagScore} from "../model/plag-score";
import {Submission} from "../model/submission";

export class SubmissionPairUtils {

  public static getFormattedScore(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): string {
    const plagScore = this.getScoreByType(pair, type);
    if (plagScore !== null) {
      return this.formatScore(plagScore.score);
    }

    return "0 %";
  }

  public static formatScore(score: number): string {
    return (score * 100).toFixed(2) + " %";
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
