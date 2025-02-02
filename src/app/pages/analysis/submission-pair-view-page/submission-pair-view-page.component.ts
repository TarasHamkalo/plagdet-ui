import {Component, computed, effect, OnDestroy, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {ActivatedRoute} from "@angular/router";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {FormsModule} from "@angular/forms";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {TextEditorComponent} from "../../../components/text-editor/text-editor.component";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {
  MetadataDiffCardComponent
} from "../../../components/cards/metadata-diff-card/metadata-diff-card.component";
import {StatCardComponent} from "../../../components/cards/stat-card/stat-card.component";
import {PlagScore} from "../../../model/plag-score";


@Component({
  selector: "app-submission-pair-view-page",
  imports: [
    FormsModule,
    SurfaceComponent,
    TextEditorComponent,
    ContentContainerComponent,
    NgIf,
    MatProgressBar,
    MatIcon,
    MatTooltip,
    MetadataDiffCardComponent,
    StatCardComponent
  ],
  templateUrl: "./submission-pair-view-page.component.html",
  styleUrl: "./submission-pair-view-page.component.css"
})
export class SubmissionPairViewPageComponent implements OnInit, OnDestroy {

  protected pairId = signal<string | null>(null);

  protected submissionPair = signal<SubmissionPair | null>(null);

  protected first = signal<Submission | null>(null);

  protected second = signal<Submission | null>(null);

  protected plagCases = computed(() => this.submissionPair()?.plagCases ?? []);

  constructor(protected analysisContext: AnalysisContextService,
              private route: ActivatedRoute) {
    effect(() => {
      if (this.pairId() === null) {
        return;
      }

      const pair = this.analysisContext.getReport()()!.pairs!.get(this.pairId()!);
      if (pair) {
        this.submissionPair.set(pair);
        const firstSubmission = this.analysisContext.getReport()()!.submissions!.get(pair.firstId)!;
        this.first.set(firstSubmission);
        const secondSubmission = this.analysisContext.getReport()()!.submissions!.get(pair.secondId)!;
        this.second.set(secondSubmission);
      }
    });
  }

  public ngOnDestroy(): void {
    this.pairId.set(null);
    this.submissionPair.set(null);
  }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pairId.set(params.get("id"));
    });
  }

  private getScoreByType(type: "META" | "JACCARD" | "SEMANTIC"): PlagScore | null {
    const pair = this.submissionPair();
    if (pair !== null) {
      const score = pair.plagScores.filter(p => p.type === type).at(0);
      return score ? score : null;
    }

    return null;
  }

  public getFormattedScore(type: "META" | "JACCARD" | "SEMANTIC"): string {
    const plagScore = this.getScoreByType(type);
    if (plagScore !== null) {
      return (plagScore?.score * 100).toFixed(2) + " %";
    }

    return "Nevypočítané";
  }

}
