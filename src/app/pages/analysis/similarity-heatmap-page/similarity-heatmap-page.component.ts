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
import {PlagScore} from "../../../model/plag-score";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
}

@Component({
  selector: "app-similarity-heatmap-page",
  template: `
    <app-content-container>
      <div id="chart">
        <apx-chart
          [series]="chartOptions.series!"
          [chart]="chartOptions.chart!"
          [dataLabels]="chartOptions.dataLabels!"
          [plotOptions]="chartOptions.plotOptions!"
          [title]="chartOptions.title!"
        ></apx-chart>
      </div>
    </app-content-container>
  `,
  imports: [
    ChartComponent,
    NgApexchartsModule,
    ContentContainerComponent
  ],
  styles: ``
})

export class SimilarityHeatmapPageComponent {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public readonly DISPLAY_SCORE_TYPE = "SEMANTIC";

  public readonly DATA_POINTS_LIMIT = 30;

  constructor(private analysisContextService: AnalysisContextService) {
    this.chartOptions = {
      series: this.createDocumentSimilaritySeries(),
      chart: {
        height: 1200,
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
      plotOptions: {
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
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: "Teplotná mapa podobnosti"
      },
    };
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
      let x = "w" + (i + 1).toString();
      let y =
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
        const plagScore = this.getFormattedScore(pair, this.DISPLAY_SCORE_TYPE);
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

  public getFormattedScore(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): string {
    const plagScore = this.getScoreByType(pair, type);
    if (plagScore !== null) {
      return (plagScore?.score * 100).toFixed(2) + " %";
    }

    return "0";
  }

  private getScoreByType(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ): PlagScore | null {
    if (pair !== null) {
      const score = pair.plagScores.filter(p => p.type === type).at(0);
      return score ? score : null;
    }

    return null;
  }
}

