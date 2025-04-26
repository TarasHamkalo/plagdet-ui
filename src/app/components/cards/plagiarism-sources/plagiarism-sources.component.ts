import {Component, Input, OnInit, signal} from "@angular/core";
import {ComparisonFastNavComponent} from "../comparison-fast-nav/comparison-fast-nav.component";
import {Submission} from "../../../model/submission";
import {SubmissionPair} from "../../../model/submission-pair";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";
import {ExportService} from "../../../services/export.service";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "app-plagiarism-sources",
  imports: [
    ComparisonFastNavComponent,
    MatIconButton,
    MatIcon
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

  constructor(
    private exportService: ExportService,
    private analysisContextService: AnalysisContextService
  ) {
  }

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

  public onExport() {
    this.exportService.exportPlagSources(this.submission, this.semanticSubmissionPairSignal(), this.jaccardSubmissionPairSignal(),  this.metaSubmissionPairSignal(), Date.now().toFixed(0));
  }
}
