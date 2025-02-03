import {Component, ViewChild} from "@angular/core";

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
import {MatIconButton} from "@angular/material/button";
import {SimilarityHeatmapService} from "../../../services/similarity-heatmap.service";
import {MatIcon} from "@angular/material/icon";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
}

export interface SimilarityDatapoint {
  x: string;
  y: number;
}

@Component({
  selector: "app-similarity-heatmap-page",
  imports: [
    ChartComponent,
    NgApexchartsModule,
    ContentContainerComponent,
    SurfaceComponent,
    MatIconButton,
    MatIcon,
    MatSlider,
    MatSliderThumb,
    FormsModule
  ],
  templateUrl: "./similarity-heatmap-page.component.html",
  styleUrl: "./similarity-heatmap-page.component.css"
})

export class SimilarityHeatmapPageComponent {

  @ViewChild(ChartComponent) chart!: ChartComponent;

  public readonly PLOT_OPTIONS: ApexPlotOptions = {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 25,
            name: "low",
            color: "#00A100"
          },
          {
            from: 26,
            to: 50,
            name: "medium",
            color: "#128FD9"
          },
          {
            from: 51,
            to: 75,
            name: "high",
            color: "#FFB200"
          },
          {
            from: 76,
            to: 100,
            name: "extreme",
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
    protected similarityHeatmapService: SimilarityHeatmapService
  ) {
    const initialPage = this.similarityHeatmapService.getDocumentSeriesPage(this.x, this.y);
    this.x = initialPage.x;
    this.y = initialPage.y;
    this.chartOptions = {
      series: initialPage.series,
      chart: {
        type: "heatmap",
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            console.log(chartContext, opts);
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

  protected updatePosition(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.updateSeries();
  }
}

