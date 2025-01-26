import {AfterViewInit, Component, effect, OnInit, signal, ViewChild} from "@angular/core";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {Submission} from "../../model/submission";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SubmissionPair} from "../../model/submission-pair";
import {FormsModule} from "@angular/forms";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
} from "@angular/material/table";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {DecimalPipe, NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";

@Component({
  selector: "app-submission-pairs-page",
  imports: [
    TitledSurfaceComponent,
    MatFormField,
    MatInput,
    FormsModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatButton,
    MatHeaderRow,
    MatLabel,
    MatRow,
    MatPaginator,
    NgIf,
    MatProgressBar,
    MatSortHeader,
    DecimalPipe,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: "./submission-pairs-page.component.html",
  styleUrl: "./submission-pairs-page.component.css"
})
export class SubmissionPairsPageComponent implements AfterViewInit {

  protected searchText = signal<string>("");

  protected pairsDisplayedColumns: string[] = [
    "firstDocumentName", "secondDocumentName", "similarity", "moreButton"
  ];

  protected pairsDataSource = new MatTableDataSource<SubmissionPair>();

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  constructor(protected analysisContext: AnalysisContextService,
              private router: Router) {
    effect(() => {
      this.pairsDataSource.data = [...this.analysisContext.getReport()()!.pairs!.values()]
        .sort((a, b) => this.getMaxScore(b) - this.getMaxScore(a));
    });
  }

  ngAfterViewInit() {
    this.pairsDataSource.sort = this.sort;
    this.pairsDataSource.paginator = this.matPaginator;
    this.pairsDataSource.filterPredicate = (data: SubmissionPair, filter: string) => {
      console.log(filter);
      const submission = this.getSubmissionById(data.firstId);
      console.log(submission);
      return submission!.submitter.toLowerCase().includes(filter);
    };

  }

  protected getSubmissionById(id: number): Submission {
    return this.analysisContext.getReport()()!.submissions!.get(id)!;
  }

  onSorting(sort: Sort) {
    const mul = sort.direction === "asc" ? 1 : -1;
    switch (sort.active) {
      case "first": {
        this.pairsDataSource.data.sort((a, b) =>
          this.getSubmissionById(a.firstId)!.submitter
            .localeCompare(this.getSubmissionById(b.firstId).submitter) * mul
        );
        break;
      }
      case "second": {
        this.pairsDataSource.data.sort((a, b) =>
          this.getSubmissionById(a.secondId)!.submitter
            .localeCompare(this.getSubmissionById(b.secondId).submitter) * mul
        );
        break;
      }
      case "similarity": {
        this.pairsDataSource.data.sort((a, b) =>
          (this.getMaxScore(a) - this.getMaxScore(b)) * mul
        );
        break;
      }
    }
  }

  onLoadPair(element: SubmissionPair): void {
    console.log("Load pair:", element);
    this.router.navigate([PageRoutes.PAIR, element.id]) ;
  }

  applyFilter(filter: string) {
    this.pairsDataSource.filter = filter?.toLowerCase();
  }

  getMaxScore(pair: SubmissionPair) {
    const scores = [...pair.plagScores.map(p => p.score * 100)];
    return Math.max(...scores);
  }
}
