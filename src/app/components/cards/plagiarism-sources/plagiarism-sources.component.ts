import {Component, Input, OnInit, signal} from "@angular/core";
import {ComparisonFastNavComponent} from "../comparison-fast-nav/comparison-fast-nav.component";
import {Submission} from "../../../model/submission";
import {SubmissionPair} from "../../../model/submission-pair";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";

@Component({
  selector: "app-plagiarism-sources",
  imports: [
    ComparisonFastNavComponent
  ],
  templateUrl: "./plagiarism-sources.component.html",
  styleUrls: [
    "./plagiarism-sources.component.css",
    "../shared/card-base.scss"
  ]
})
export class PlagiarismSourcesComponent implements OnInit {

  @Input({required: true}) public submission!: Submission;

  public metaSubmissionPairSignal = signal<SubmissionPair | null>(null);

  public semanticSubmissionPairSignal = signal<SubmissionPair | null>(null);

  public jaccardSubmissionPairSignal = signal<SubmissionPair | null>(null);

  constructor(private analysisContextService: AnalysisContextService) {
  }

  // find comparison with max score by type
  public ngOnInit() {
    const report = this.analysisContextService.getReport()();
    if (report) {
      const typedPairsMap: Record<string, SubmissionPair[]> = {};
      this.submission.pairIds
        .map(pairId => report.pairs.get(pairId))
        .filter(p => p !== undefined)
        .forEach(p => {
          p?.plagScores.forEach(s => {
            const typedPairs = typedPairsMap[s.type];
            if (typedPairs) {
              typedPairs.push(p);
            } else {
              typedPairsMap[s.type] = [p];
            }
          });
        });

      this.semanticSubmissionPairSignal.set(
        SubmissionPairUtils.findByPairWithMaxScore(typedPairsMap["SEMANTIC"], "SEMANTIC")
      );

      this.jaccardSubmissionPairSignal.set(
        SubmissionPairUtils.findByPairWithMaxScore(typedPairsMap["JACCARD"], "JACCARD")
      );

      this.metaSubmissionPairSignal.set(
        SubmissionPairUtils.findByPairWithMaxScore(typedPairsMap["META"], "META")
      );
    }
  }
}
