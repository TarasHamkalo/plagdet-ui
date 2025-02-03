import {Component, OnDestroy, ViewChild} from "@angular/core";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {SimilarityHeatmapService} from "../../../services/similarity-heatmap.service";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";
import {MatFormField, MatOption, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";
import {RouteContextService} from "../../../context/route-context.service";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
}

@Component({
  selector: "app-similarity-heatmap-page",
  imports: [
    ChartComponent,
    NgApexchartsModule,
    ContentContainerComponent,
    SurfaceComponent,
    MatLabel,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    MatSelect,
    MatOption,
    MatFormField
  ],
  templateUrl: "./similarity-heatmap-page.component.html",
  styleUrl: "./similarity-heatmap-page.component.css"
})

export class SimilarityHeatmapPageComponent implements OnDestroy {

  @ViewChild(ChartComponent) protected chart!: ChartComponent;

  public static readonly CONTEXT_KEY = "similarity-heatmap-page";

  public readonly PLOT_OPTIONS: ApexPlotOptions = {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 25,
            name: "nízka",
            color: "#00A100"
          },
          {
            from: 26,
            to: 50,
            name: "stredná",
            color: "#128FD9"
          },
          {
            from: 51,
            to: 75,
            name: "vysoká",
            color: "#FFB200"
          },
          {
            from: 76,
            to: 100,
            name: "extrémna",
            color: "#FF0000"
          }
        ]
      }
    }
  };

  public chartOptions: Partial<ChartOptions>;

  protected x = 0;

  protected y = 0;

  constructor(
    protected similarityHeatmapService: SimilarityHeatmapService,
    protected routeContextService: RouteContextService,
    private router: Router
  ) {
    this.applyContext();
    const initialPage = this.similarityHeatmapService.getDocumentSeriesPage(this.x, this.y);
    this.x = initialPage.x;
    this.y = initialPage.y;
    this.chartOptions = {
      series: initialPage.series,
      chart: {
        toolbar: {
          show: false
        },
        type: "heatmap",
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            const pair = this.similarityHeatmapService
              .getSubmissionPairIdByDatapoint(opts.seriesIndex, opts.dataPointIndex);
            this.loadPair(pair);
          }
        },
        zoom: {
          enabled: false
        }
      },
      plotOptions: this.PLOT_OPTIONS,
      dataLabels: {
        enabled: true,
      },
      title: {
        text: ""
      },

    };
  }

  protected updateSeries() {
    const page = this.similarityHeatmapService.getDocumentSeriesPage(this.x, this.y);
    this.x = page.x;
    this.y = page.y;
    if (page.viewUpdate) {
      this.chartOptions.series = page.series;
    }
  }

  private loadPair(pairId: string | null) {
    if (pairId == null) {
      return;
    }

    this.router.navigate([PageRoutes.PAIRS, pairId]);
  }

  public changeScoreType(type: "META" | "SEMANTIC" | "JACCARD") {
    this.similarityHeatmapService.setDisplayScoreType(type);
    this.x = 0;
    this.y = 0;
    this.updateSeries();
  }

  public ngOnDestroy(): void {
    this.routeContextService.putProperty(
      ".x", this.x.toFixed(0), SimilarityHeatmapPageComponent.CONTEXT_KEY
    );
    this.routeContextService.putProperty(
      ".y", this.y.toFixed(0), SimilarityHeatmapPageComponent.CONTEXT_KEY
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
      this.x = parseInt(x);
      this.y = parseInt(y);
      this.similarityHeatmapService.setDisplayScoreType(
        scoreType as "META" | "SEMANTIC" | "JACCARD"
      );
    }
  }
}

