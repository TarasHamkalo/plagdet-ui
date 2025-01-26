import {Component, OnInit} from "@angular/core";
import {Submission} from "../../model/submission";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {TableColumnDefinition} from "../../model/table-column-definition";
import {Cluster} from "../../model/mock/cluster";
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
import {
  SubmissionsListComponent
} from "../../components/submissions-list/submissions-list.component";
import {
  SubmissionsTableComponent
} from "../../components/submissions-table/submissions-table.component";

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
    SubmissionsListComponent,
    SubmissionsTableComponent,
  ],
  templateUrl: "./analysis-page.component.html",
  styleUrl: "./analysis-page.component.css"
})
export class AnalysisPageComponent implements OnInit {


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
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.analysisService.loadReport().subscribe((report) => {
      if (report) {
        this.analysisContext.getReport().set(report);
        this.loading = false;
      } else {
        this.router.navigate([PageRoutes.HOME]);
      }
    });

  }

  onSorting(event: any) {
    console.log(event);
    console.log("Busy sorting array....");
  }

  showMoreAboutSubmission(element: Submission) {
    console.log(element);
  }

  protected navigateSubmissionsPage() {
    this.router.navigate([PageRoutes.SUBMISSIONS]);
  }
}
