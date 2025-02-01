import {Component, effect, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Submission} from "../../../model/submission";
import {PageRoutes} from "../../../app.routes";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {
  SubmissionInfoCardComponent
} from "../../../components/cards/submission-info-card/submission-info-card.component";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: "app-submission-view-page",
  imports: [
    ContentContainerComponent,
    SubmissionInfoCardComponent,
    SurfaceComponent,
    MatProgressBar,

  ],
  templateUrl: "./submission-view-page.component.html",
  styleUrl: "./submission-view-page.component.css"
})
export class SubmissionViewPageComponent implements OnInit {

  private submissionId = signal<number | null>(null);

  protected submission = signal<Submission | null>(null);

  constructor(
    protected analysisContext: AnalysisContextService,
    protected router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      const id = this.submissionId();
      const report = this.analysisContext.getReport()();
      if (id && report) {
        const submission = report.submissions.get(id);
        if (submission) {
          this.submission.set(submission);
        } else {
          router.navigate([PageRoutes.SUBMISSIONS]);
        }
      }
    });
  }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.submissionId.set(parseInt(id));
      }
    });
  }
}
