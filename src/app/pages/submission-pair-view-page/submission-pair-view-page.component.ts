import {Component, effect, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {ActivatedRoute} from "@angular/router";
import {SubmissionPair} from "../../model/submission-pair";
import {Submission} from "../../model/submission";
// import {EditorComponent} from "ngx-monaco-editor-v2";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "app-submission-pair-view-page",
  imports: [
    // EditorComponent,
    FormsModule
  ],
  templateUrl: "./submission-pair-view-page.component.html",
  styleUrl: "./submission-pair-view-page.component.css"
})
export class SubmissionPairViewPageComponent implements OnInit {

  protected pairId = signal<string | null>(null);

  protected submissionPair = signal<SubmissionPair | null>(null);

  protected first = signal<Submission | null>(null);

  protected second = signal<Submission | null>(null);

  protected editorOptions = { theme: "vs-dark", language: "plaintext" };

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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pairId.set(params.get("id"));
    });
  }

// route -> /**, submission pair id

}
