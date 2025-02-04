import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ApexChart, ApexDataLabels, ApexPlotOptions, ChartComponent} from "ng-apexcharts";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  // title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  colors: any;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  legend: ApexLegend;
}

@Component({
  selector: "app-plagiarism-score-distribution",
  imports: [
    ChartComponent
  ],
  templateUrl: "./plagiarism-score-distribution.component.html",
  styleUrl: "./plagiarism-score-distribution.component.css"
})
export class PlagiarismScoreDistributionComponent implements AfterViewInit {

  @ViewChild(ChartComponent) protected chart!: ChartComponent;

  protected chartOptions: Partial<ChartOptions>;

  protected categories: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

  protected categoryFrequencies: Record<number, number> = {};

  protected displayedSimilarityType: "JACCARD" | "SEMANTIC" | "META" = "SEMANTIC";

  constructor(private analysisContextService: AnalysisContextService) {
    this.chartOptions = {
      chart: {
        type: "bar",

      },

      xaxis: {
        categories: [
          "0-10%", "10-20%", "20-30%", "30-40%", "40-50%", "50-60%", "60-70%", "70-80%", "80-90%", "90-100%"
        ],
        title: {
          text: "%podobnosť",
          style: {
            fontSize: "14px",
            color: "#333"
          }
        },
      },
      yaxis: {
        title: {
          text: "#dokumenty",
          style: {
            fontSize: "14px",
            color: "#333"
          }
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          distributed: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toString();
        },
      },
      grid: {
        borderColor: "#e0e0e0",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      colors: [
        "#4285F4",
        "#34A853",
        "#9B51E0",
        "#FABB05",
        "#274C77",
        "#66C2FF",
        "#720E9E"
      ],
      series: [
        {
          name: "Počet dokumentov",
          data: []
        }
      ],
      legend: {
        show: false
      }
    };
  }

  public ngAfterViewInit(): void {
    const report = this.analysisContextService.getReport()();
    if (report) {
      const submissions = report.submissions;
      const pairs = report.pairs;
      Array.from(submissions.values())
        .filter(s => !s.indexed && s.pairIds.length > 0)
        .map(s => s.pairIds)
        .map((pIds) =>
          Math.max(
            ...pIds
              .map(id => pairs.get(id))
              .map(p => SubmissionPairUtils.getScoreByType(p!, this.displayedSimilarityType))
              .map(s => s ? s.score : 0)
          ))
        .forEach((maxScore: number) => {
          // console.log("index", index);
          // console.log("max", maxScore);
          const category = Math.floor(maxScore * 10) * 10;
          const freq = this.categoryFrequencies[category];
          if (freq) {
            this.categoryFrequencies[category] = freq + 1;
          } else {
            this.categoryFrequencies[category] = 1;
          }
          // console.log(maxScore, category, this.categoryFrequencies[category]);
        });
      // console.log(this.categoryFrequencies);
      if (this.chartOptions.series) {
        this.chartOptions.series[0].data = this.categories.map(c => {
          const freq = this.categoryFrequencies[c];
          return freq ? freq : 0;
        });
      }
    }
  }
}
