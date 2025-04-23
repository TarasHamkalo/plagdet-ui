import {Component, OnInit} from "@angular/core";
import {Submission} from "../../../model/submission";
import {MatTableModule} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {
  AnalysisInfoCardComponent
} from "../../../components/cards/analysis-info-card/analysis-info-card.component";
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
import {
  ConfigurationInfoCardComponent
} from "../../../components/cards/configuration-info-card/configuration-info-card.component";
import {
  PlagiarismScoreDistributionComponent
} from "../../../components/charts/plagiarism-score-distribution/plagiarism-score-distribution.component";
import {NavigationService} from "../../../services/navigation/navigation.service";

@Component({
  selector: "app-analysis-page",
  imports: [
    MatTableModule,
    MatButton,
    AnalysisInfoCardComponent,
    NgIf,
    MatProgressBar,
    SubmissionsTableComponent,
    SurfaceComponent,
    ContentContainerComponent,
    ConfigurationInfoCardComponent,
    PlagiarismScoreDistributionComponent,
  ],
  templateUrl: "./analysis-page.component.html",
  styleUrl: "./analysis-page.component.css"
})
export class AnalysisPageComponent implements OnInit {

  protected loading = true;

  constructor(
    protected analysisContext: AnalysisContextService,
    private navigationService: NavigationService,
    private analysisService: AnalysisService,
    private router: Router
  ) {
  }

  public ngOnInit() {
    this.loading = true;
    this.analysisService.loadReport().subscribe({
      next: (report) => {
        if (report) {
          this.analysisContext.setReport(report);
          this.loading = false;
          // console.log("toggle");
          this.navigationService.toggleNavigationLock(false);
        } else {
          this.router.navigate([PageRoutes.HOME]);
        }
      },
      error: (error) => {
        console.error("ZIP Load Error:", error);
      }
    });

  }

  protected navigateSubmissionsPage() {
    this.router.navigate([PageRoutes.SUBMISSIONS]);
  }
}
