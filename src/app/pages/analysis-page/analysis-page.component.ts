import {Component, OnInit} from "@angular/core";
import {SubmissionsService} from "../../services/submissions.service";
import {Submission} from "../../model/submission";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {TableColumnDefinition} from "../../model/table-column-definition";
import {Cluster} from "../../model/mock/cluster";
import {ClustersService} from "../../services/mock/clusters.service";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
import {
  AnalysisInfoCardComponent
} from "../../components/analysis-info-card/analysis-info-card.component";
import {AnalysisService} from "../../services/analysis.service";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";
import {NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: "app-analysis-page",
  imports: [
    MatTableModule,
    TitledSurfaceComponent,
    MatSort,
    MatSortHeader,
    MatButton,
    AnalysisInfoCardComponent,
    NgIf,
    MatProgressBar,

  ],
  templateUrl: "./analysis-page.component.html",
  styleUrl: "./analysis-page.component.css"
})
export class AnalysisPageComponent implements OnInit {

  public submissionTableDefinitions: TableColumnDefinition[] = [
    {fieldName: "submitter", displayName: "Odovzdávateľ"},
    {fieldName: "filename", displayName: "Názov súboru"},
    {fieldName: "totalEditTime", displayName: "Čas úpravy (min)"},
    {fieldName: "maxSimilarity", displayName: "Maximálna podobnosť %"},
  ];

  public submissionsDisplayedColumns: string[] = [];

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  public clusterTableDefinitions: TableColumnDefinition[] = [
    {fieldName: "name", displayName: "Názov zhluku"},
    {fieldName: "avgSimilarity", displayName: "Priemerná podobnosť"},
    {fieldName: "avgEditTime", displayName: "Priemerný čas úpravy (min)"},
    {fieldName: "numberOfSubmissions", displayName: "Počet odovzdaní "},
  ];

  public clusterDisplayedColumns: string[] = [];

  public clustersDataSource = new MatTableDataSource<Cluster>([]);

  protected loading = true;

  constructor(private analysisContext: AnalysisContextService,
              private analysisService: AnalysisService,
              private submissionsService: SubmissionsService,
              private clustersService: ClustersService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.analysisService.loadReport().subscribe((report) => {
      if (report) {
        this.analysisContext.getReport().set(report);
        this.submissionsDataSource.data = [...report.submissions.values()];
        this.loading = false;
      } else {
        this.router.navigate([PageRoutes.HOME]);
      }
    });

    const temp = this.submissionTableDefinitions.map(col => col.fieldName);
    this.submissionsDisplayedColumns = temp.concat("moreButton");

    // this.submissionsService.getSubmissions().subscribe(submissions => {
    //   console.log(submissions);
    //   this.submissionsDataSource.data = submissions;
    // });
    //
    // this.clustersService.getClusters().subscribe(clusters => {
    //   console.log(clusters);
    //   this.clustersDataSource.data = clusters;
    // });
    //
    // this.analysisService.analyze();
    // temp = this.clusterTableDefinitions.map(col => col.fieldName);
    // this.clusterDisplayedColumns = temp.concat("submissionList");
  }

  onSorting(event: any) {
    console.log(event);
    console.log("Busy sorting array....");
  }

  showMoreAboutSubmission(element: Submission) {
    console.log(element);
  }
}
