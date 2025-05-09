import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  signal,
  ViewChild
} from "@angular/core";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import {SimilarityHeatmapService} from "../../../services/similarity-heatmap.service";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {HeatmapPairPoint} from "../../../types/heatmap-pair-point";
import {MatTooltip} from "@angular/material/tooltip";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
}


@Component({
  selector: "app-similarity-heatmap",
  imports: [
    ChartComponent,
    NgApexchartsModule,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    MatTooltip,
    NgIf
  ],
  templateUrl: "./similarity-heatmap.component.html",
  styleUrl: "./similarity-heatmap.component.scss"
})
export class SimilarityHeatmapComponent implements OnInit {

  @Input({required: true}) public pairsMapSource: Signal<Map<string, SubmissionPair>> = signal<Map<string, SubmissionPair>>(new Map());

  @Input({required: true}) public submissionsMapSource: Signal<Map<number, Submission>> = signal<Map<number, Submission>>(new Map());

  @Output() public selectedPairIdEmitter = new EventEmitter<string>();

  @Output() public unknownPairEmitter = new EventEmitter<string>();

  @ViewChild(ChartComponent) protected chart!: ChartComponent;

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
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        toolbar: {
          show: false,
        },

        type: "heatmap",
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            const pairPoint = this.similarityHeatmapService
              .getSubmissionPairIdByDatapoint(opts.seriesIndex, opts.dataPointIndex);
            this.onPairSelection(pairPoint);
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
    effect(() => {
      this.similarityHeatmapService.setPairsMap(this.pairsMapSource());
      this.similarityHeatmapService.setSubmissionsMap(this.submissionsMapSource());
    });
  }

  public ngOnInit() {
    setTimeout(() => {
      const initialPage = this.similarityHeatmapService.getDocumentSeriesPage(this.x, this.y);
      this.chartOptions.series = initialPage.series;
      this.x = initialPage.x;
      this.y = initialPage.y;
    });
  }

  public updateSeries() {
    const page = this.similarityHeatmapService.getDocumentSeriesPage(this.x, this.y);
    this.x = page.x;
    this.y = page.y;
    if (page.viewUpdate) {
      this.chartOptions.series = page.series;
    }
  }

  private onPairSelection(pairPoint: HeatmapPairPoint | null) {
    if (pairPoint == null) {
      return;
    }

    if (pairPoint.isKnownPair) {
      this.selectedPairIdEmitter.emit(`${pairPoint.firstId}_${pairPoint.secondId}`);
    } else {
      this.unknownPairEmitter.emit(`${pairPoint.firstId}_${pairPoint.secondId}`);
    }
  }

  public getPageX(): number {
    return this.x;
  }

  public getPageY(): number {
    return this.y;
  }

  public setPageX(x: number): void {
    this.x = x;
  }

  public setPageY(y: number): void {
    this.y = y;
  }

}
