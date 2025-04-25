import {AfterViewInit, Component, computed, OnDestroy, ViewChild} from "@angular/core";

import {NgApexchartsModule} from "ng-apexcharts";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {SimilarityHeatmapService} from "../../../services/similarity-heatmap.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";
import {MatFormField, MatOption, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";
import {RouteContextService} from "../../../context/route-context.service";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {
  FloatingToolbarComponent
} from "../../../components/floating-toolbar/floating-toolbar.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {
  SimilarityHeatmapComponent
} from "../../../components/charts/similarity-heat-map/similarity-heatmap.component";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";


@Component({
  selector: "app-similarity-heatmap-page",
  imports: [
    NgApexchartsModule,
    ContentContainerComponent,
    SurfaceComponent,
    MatLabel,
    FormsModule,
    MatSelect,
    MatOption,
    MatFormField,
    MatButton,
    MatIcon,
    FloatingToolbarComponent,
    SimilarityHeatmapComponent
  ],
  templateUrl: "./similarity-heatmap-page.component.html",
  styleUrl: "./similarity-heatmap-page.component.scss"
})

export class SimilarityHeatmapPageComponent implements OnDestroy, AfterViewInit {

  public static readonly CONTEXT_KEY = "similarity-heatmap-page";

  @ViewChild(SimilarityHeatmapComponent) protected heatMap!: SimilarityHeatmapComponent;

  protected pairsMapSource = computed<Map<string, SubmissionPair>>(() => {
    const report = this.analysisContextService.getReport()();
    if (report) {
      return report.pairs;
    }
    return new Map();
  });


  protected submissionsMapSource = computed<Map<number, Submission>>(() => {
    const report = this.analysisContextService.getReport()();
    if (report) {
      return report.submissions;
    }
    return new Map();
  });

  constructor(
    protected analysisContextService: AnalysisContextService,
    protected similarityHeatmapService: SimilarityHeatmapService,
    protected routeContextService: RouteContextService,
    private router: Router
  ) {
  }

  private loadDiff(pId: string) {
    const splits = pId.split("_");
    this.router.navigate([PageRoutes.DIFF, splits[0], splits[1]]);
  }

  private loadPair(pairId: string) {
    this.router.navigate([PageRoutes.PAIRS, pairId]);
  }

  public ngAfterViewInit() {
    this.heatMap.selectedPairIdEmitter.subscribe((pId) => this.loadPair(pId));
    this.heatMap.unknownPairEmitter.subscribe((pId) => this.loadDiff(pId));
    setTimeout(() => this.applyContext());
  }

  public changeScoreType(type: "META" | "SEMANTIC" | "JACCARD" | "SEM&JAC") {
    this.similarityHeatmapService.setDisplayScoreType(type);
    this.heatMap.setPageY(0);
    this.heatMap.setPageX(0);
    this.heatMap.updateSeries();
  }

  public ngOnDestroy(): void {
    this.routeContextService.putProperty(
      ".x", this.heatMap.getPageX().toFixed(0), SimilarityHeatmapPageComponent.CONTEXT_KEY
    );
    this.routeContextService.putProperty(
      ".y", this.heatMap.getPageY().toFixed(0), SimilarityHeatmapPageComponent.CONTEXT_KEY
    );
    this.routeContextService.putProperty(
      ".score-type",
      this.similarityHeatmapService.getDisplayScoreType(),
      SimilarityHeatmapPageComponent.CONTEXT_KEY
    );
  }

  private applyContext() {
    const x = this.routeContextService.popProperty(".x", SimilarityHeatmapPageComponent.CONTEXT_KEY);
    const y = this.routeContextService.popProperty(".y", SimilarityHeatmapPageComponent.CONTEXT_KEY);
    const scoreType = this.routeContextService.popProperty(
      ".score-type", SimilarityHeatmapPageComponent.CONTEXT_KEY
    );
    if (x && y && scoreType) {
      this.heatMap.setPageX(parseInt(x));
      this.heatMap.setPageY(parseInt(y));
      this.similarityHeatmapService.setDisplayScoreType(
        scoreType as "META" | "SEMANTIC" | "JACCARD"
      );

      this.heatMap.updateSeries();
    }
  }

  public export() {
    this.similarityHeatmapService.export();
  }
}

