import {AfterViewInit, Component, effect, Input, signal, ViewChild} from "@angular/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from "@angular/material/table";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {DecimalPipe} from "@angular/common";
import {Router} from "@angular/router";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {PageRoutes} from "../../../app.routes";


@Component({
  selector: "app-pairs-table",
  imports: [
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
    MatSortHeader,
    DecimalPipe,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
  ],
  templateUrl: "./pairs-table.component.html",
  styleUrl: "./pairs-table.component.css"
})
export class PairsTableComponent implements AfterViewInit {

  protected readonly pairsDisplayedColumns: string[] = [
    "firstDocumentName", "secondDocumentName", "similarity", "moreButton"
  ];

  @Input() public isTableLoaded = signal<boolean>(false);

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  protected searchText = signal<string>("");

  protected pairsDataSource = new MatTableDataSource<SubmissionPair>();

  constructor(
    protected analysisContext: AnalysisContextService,
    private router: Router
  ) {
    effect(() => {
      this.pairsDataSource.data = [...this.analysisContext.getReport()()!.pairs!.values()]
        .sort((a, b) => this.getMaxScore(b) - this.getMaxScore(a));
      this.isTableLoaded.set(true);
    });
  }

  public ngAfterViewInit() {
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

  public onSorting(sort: Sort) {
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

  protected onLoadPair(element: SubmissionPair): void {
    console.log("Load pair:", element);
    this.router.navigate([PageRoutes.PAIR, element.id]) ;
  }

  protected applyFilter(filter: string) {
    this.pairsDataSource.filter = filter?.toLowerCase();
  }

  protected getMaxScore(pair: SubmissionPair) {
    const scores = [...pair.plagScores.map(p => p.score * 100)];
    return Math.max(...scores);
  }
}
