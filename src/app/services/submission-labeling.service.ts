import {Injectable} from "@angular/core";
import {Submission} from "../model/submission";

@Injectable({
  providedIn: "root"
})
export class SubmissionLabelingService {

  public static readonly MAX_LABEL_LENGTH = 20;

  public getSubmissionLabel(
    submission: Submission,
    frequencyMap: Record<string, number>,
    maxLabelLength = SubmissionLabelingService.MAX_LABEL_LENGTH
  ): string {
    let label = submission.fileData.submitter;
    label = this.sanitizeLabel(label, maxLabelLength);

    const duplicateCount = frequencyMap[label];
    if (duplicateCount) {
      frequencyMap[label] = duplicateCount + 1;
      return `${label}_${frequencyMap[label]}`;
    }

    frequencyMap[label] = 1;
    return `${label}_1`;
  }

  public sanitizeLabel(label: string, maxLabelLength: number) {
    let sanitize = label.split("_").filter(part => part.match("[A-z]+")).join("_");
    if (sanitize.length > maxLabelLength) {
      sanitize = `${sanitize.substring(0, maxLabelLength)}`;
    }

    return sanitize;
  }
}
