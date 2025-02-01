import {Component, computed, effect, OnDestroy, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {ActivatedRoute} from "@angular/router";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {FormsModule} from "@angular/forms";
import {editor} from "monaco-editor";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {TextEditorComponent} from "../../../components/text-editor/text-editor.component";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";


@Component({
  selector: "app-submission-pair-view-page",
  imports: [
    FormsModule,
    SurfaceComponent,
    TextEditorComponent,
    ContentContainerComponent
  ],
  templateUrl: "./submission-pair-view-page.component.html",
  styleUrl: "./submission-pair-view-page.component.css"
})
export class SubmissionPairViewPageComponent implements OnInit, OnDestroy {

  protected pairId = signal<string | null>(null);

  protected submissionPair = signal<SubmissionPair | null>(null);

  protected first = signal<Submission | null>(null);

  protected second = signal<Submission | null>(null);

  protected plagCases = computed(() => {
    if (this.submissionPair() === null) {
      return null;
    }

    return this.submissionPair()!.plagCases;
  });

  constructor(protected analysisContext: AnalysisContextService,
              private route: ActivatedRoute) {
    effect(() => {
      console.log(this.pairId());
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

}
