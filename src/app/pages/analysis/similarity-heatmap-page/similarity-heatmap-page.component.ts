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
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {Submission} from "../../../model/submission";
import {SubmissionPair} from "../../../model/submission-pair";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {MatButton} from "@angular/material/button";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";

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
    MatButton
  ],
  templateUrl: "./similarity-heatmap-page.component.html",
  styleUrl: "./similarity-heatmap-page.component.css"
})

export class SimilarityHeatmapPageComponent {

  @ViewChild(ChartComponent) chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions>;

  public readonly DISPLAY_SCORE_TYPE = "SEMANTIC";

  public readonly DATA_POINTS_LIMIT = 15;

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

  constructor(private analysisContextService: AnalysisContextService) {
    this.chartOptions = {
      series: this.createDocumentSimilaritySeries(),
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
        text: "Teplotná mapa podobnosti"
      },
    };
  }

  protected updateSeries() {
    const series: ApexAxisChartSeries = this.chartOptions.series!;
    console.log(series);
    const targetSeries = series.at(0)!;
    console.log(targetSeries);
    const relocated = series.slice(1);
    // .filter(s => s.name != targetSeries.name);
    // .map(s => {
    //   return {
    //     ...s,
    //     data: (s.data as SimilarityDatapoint[]).map(d => d.x )
    //   };
    // });
    this.chartOptions.series = [...relocated, targetSeries];
    // this.chart.updateSeries([...relocated, targetSeries]);
  }


  private removalExample() {
    const series: ApexAxisChartSeries = this.chartOptions.series!;
    console.log(series);
    const idToRemove = series[0].name!;
    const filtered = series
      .filter(s => s.name !== idToRemove)
      .map(s => {
        return {
          ...s,
          data: (s.data as { x: string; y: number }[]).filter(d => d.x !== idToRemove),
        };
      });

    this.chart.updateSeries(filtered);
  }

  private createDocumentSimilaritySeries(): ApexAxisChartSeries {
    const submissions = this.analysisContextService.getReport()()?.submissions.values();
    const pairs = this.analysisContextService.getReport()()?.pairs;
    if (!submissions || !pairs) {
      return [];
    }

    const newSubmissions = [...submissions].filter(s => !s.indexed).slice(0, this.DATA_POINTS_LIMIT);
    const series = [];
    for (const submission of newSubmissions) {
      series.push({
        name: submission.id.toFixed(0),
        data: this.comparisonResultsFor(submission, newSubmissions, pairs)
      });
    }

    return series;

  }

  public generateData(count: number, yrange: { min: number, max: number }) {
    let i = 0;
    const series = [];
    while (i < count) {
      const x = "w" + (i + 1).toString();
      const y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  private comparisonResultsFor(
    target: Submission,
    other: Submission[],
    pairs: Map<string, SubmissionPair>
  ) {
    return other.map(o => {
      if (o.id === target.id) {
        return {
          x: o.id.toFixed(0),
          y: 100
        };
      }

      let pair = pairs.get(`${target.id}_${o.id}`);
      if (!pair) {
        pair = pairs.get(`${o.id}_${target.id}`);
      }

      if (pair) {
        const plagScore = SubmissionPairUtils.getFormattedScore(pair, this.DISPLAY_SCORE_TYPE);
        return {
          x: o.id.toFixed(0),
          y: plagScore
        };
      }

      return {
        x: o.id.toFixed(0),
        y: 0
      };
    });

  }
}

