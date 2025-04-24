import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ApexChart, ApexDataLabels, ApexPlotOptions, ChartComponent} from "ng-apexcharts";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  colors: any;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  legend: ApexLegend;
}

@Component({
  selector: "app-plagiarism-score-distribution",
  imports: [
    ChartComponent,
    MatProgressSpinner
  ],
  templateUrl: "./plagiarism-score-distribution.component.html",
  styleUrl: "./plagiarism-score-distribution.component.css"
})
export class PlagiarismScoreDistributionComponent implements AfterViewInit {

  @ViewChild(ChartComponent) protected chart!: ChartComponent;

  protected ready = false;

  protected chartOptions: Partial<ChartOptions>;

  protected categories: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

  protected categorizedSubmissions: Record<number, number[]> = {};

  protected displayedSimilarityType: "JACCARD" | "SEMANTIC" | "META" = "SEMANTIC";

  constructor(
    private analysisContextService: AnalysisContextService,
    private router: Router
  ) {
    this.chartOptions = {
      chart: {
        type: "bar",

        events: {
          dataPointSelection: (event, chartContext, opts) => {
            
            const category = this.categories[opts.dataPointIndex];
            if (category != undefined) {
              const submissions = this.categorizedSubmissions[category];
              this.router.navigate([PageRoutes.SUBMISSIONS], {
                queryParams: {"filter-set": submissions.toString()}
              });
            }
          }
        },
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
    setTimeout(() => this.computeDistribution(), 500);
  }

  private computeDistribution() {
    const report = this.analysisContextService.getReport()();
    if (report) {
      const submissions = report.submissions;
      const pairs = report.pairs;
      Array.from(submissions.values())
        .filter(s => !s.indexed && s.pairIds.length > 0)
        .map((s) => {
          return {
            id: s.id,
            maxScore: Math.max(
              ...s.pairIds
                .map(id => pairs.get(id))
                .map(p => SubmissionPairUtils.getScoreByType(p!, this.displayedSimilarityType))
                .map(s => s ? s.score : 0)
            )
          };
        })
        .forEach((value: { id: number, maxScore: number }) => {
          const categoryNo = Math.floor(value.maxScore * 10) * 10;
          const category = this.categorizedSubmissions[categoryNo];
          if (category) {
            category.push(value.id);
          } else {
            this.categorizedSubmissions[categoryNo] = [value.id];
          }
        });
      if (this.chartOptions.series) {
        this.chartOptions.series[0].data = this.categories.map(c => {
          const category = this.categorizedSubmissions[c];
          return category ? category.length : 0;
        });
      }

      this.ready = true;
    }

  }
}
