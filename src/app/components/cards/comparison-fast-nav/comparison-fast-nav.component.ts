import {Component, effect, Input, OnInit, signal} from "@angular/core";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";
import {PlagScore} from "../../../model/plag-score";

@Component({
  selector: "app-comparison-fast-nav",
  imports: [
    MatCard,
    MatCardModule,
    MatButton
  ],
  templateUrl: "./comparison-fast-nav.component.html",
  styleUrls: [
    "./comparison-fast-nav.component.scss",
    "../shared/card-base.scss"
  ]
})
export class ComparisonFastNavComponent {

  @Input({required: true}) public submission!: Submission;

  @Input({required: true}) public submissionPairSignal = signal<SubmissionPair | null>(null);

  @Input({required: true}) public similarityType!: "META" | "JACCARD" | "SEMANTIC";

  protected displayedSubmitter = signal<string | null>(null);

  protected plagScore = signal<PlagScore | null>(null);

  constructor(
    private analysisContextService: AnalysisContextService
  ) {
    effect(() => {
        const submissionPair = this.submissionPairSignal();
        if (submissionPair) {
          let lookupId = submissionPair.firstId;
          if (this.submission.id == submissionPair.firstId) {
            lookupId = submissionPair.secondId;
          }

          const report = this.analysisContextService.getReport()();
          if (report) {
            const sourceSubmission = report.submissions.get(lookupId);
            if (sourceSubmission) {
              this.displayedSubmitter.set(sourceSubmission.fileData.submitter);
            }
          }

          this.plagScore.set(SubmissionPairUtils.getScoreByType(submissionPair, this.similarityType));
        }
      }
    );
  }

  public hasMetaScore() {
    const plagScore = this.plagScore();
    if (plagScore) {
      return plagScore.score > 0;
    }

    return false;
  }

  public getFormattedScore() {
    const plagScore = this.plagScore();
    if (plagScore) {
      return SubmissionPairUtils.formatScore(plagScore.score, 0);
    }

    return "Nevypočítané";
  }

}
