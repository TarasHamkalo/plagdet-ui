import {Component, OnInit} from "@angular/core";
import {Submission} from "../../../model/submission";
import {MatTableModule} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {
  AnalysisInfoCardComponent
} from "../../../components/analysis-info-card/analysis-info-card.component";
import {AnalysisService} from "../../../services/analysis.service";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";
import {NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {
  SubmissionsTableComponent
} from "../../../components/tables/submissions-table/submissions-table.component";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";

@Component({
  selector: "app-overview-page",
  imports: [
    MatTableModule,
    MatButton,
    AnalysisInfoCardComponent,
    NgIf,
    MatProgressBar,
    SubmissionsTableComponent,
    SurfaceComponent,
    ContentContainerComponent,
  ],
  templateUrl: "./analysis-page.component.html",
  styleUrl: "./analysis-page.component.css"
})
export class AnalysisPageComponent implements OnInit {

  protected loading = true;

  constructor(
    private analysisContext: AnalysisContextService,
    private analysisService: AnalysisService,
    private router: Router
  ) {
  }

  public ngOnInit() {
    this.loading = true;
    this.analysisService.loadReport().subscribe((report) => {
      if (report) {
        this.analysisContext.setReport(report);
        this.loading = false;
      } else {
        this.router.navigate([PageRoutes.HOME]);
      }
    });

  }
  protected showMoreAboutSubmission(element: Submission) {
    console.log(element);
  }

  protected navigateSubmissionsPage() {
    this.router.navigate([PageRoutes.SUBMISSIONS]);
  }
}
