import {
  AfterViewInit,
  Component,
  effect,
  Input,
  signal,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
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
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {PageRoutes} from "../../../app.routes";
import {AnalysisContextService} from "../../../context/analysis-context.service";


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
  styleUrls: ["./pairs-table.component.css", "../shared/base-table.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PairsTableComponent implements AfterViewInit {

  protected readonly pairsDisplayedColumns: string[] = [
    "firstDocumentName", "secondDocumentName", "similarity", "moreButton"
  ];

  @Input() public pairsSource = signal<SubmissionPair[]>([]);

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  protected searchText = signal<string>("");

  protected pairsDataSource = new MatTableDataSource<SubmissionPair>();

  constructor(
    protected analysisContext: AnalysisContextService,
    private router: Router
  ) {
    effect(() => {
      this.pairsDataSource.data = this.pairsSource()
        .sort((a, b) => this.getMaxScore(b) - this.getMaxScore(a));
    });
  }

  public ngAfterViewInit() {
    this.pairsDataSource.paginator = this.matPaginator;
    this.pairsDataSource.filterPredicate = this.rowsFilter.bind(this);
    this.pairsDataSource.sort = this.sort;
  }

  protected rowsFilter(data: SubmissionPair, filter: string): boolean {
    console.log(filter);
    const first = this.getSubmissionById(data.firstId);
    const second = this.getSubmissionById(data.secondId);
    return first.submitter.toLowerCase().includes(filter) ||
      second.submitter.toLowerCase().includes(filter);
  }

  protected getSubmissionById(id: number): Submission {
    return this.analysisContext.getReport()()!.submissions!.get(id)!;
  }

  public onSorting(sort: Sort) {
    console.log(sort);
    const mul = sort.direction === "asc" ? 1 : -1;
    switch (sort.active) {
      case "first": {
        this.pairsDataSource.filteredData.sort((a, b) =>
          this.getSubmissionById(a.firstId)!.submitter
            .localeCompare(this.getSubmissionById(b.firstId).submitter) * mul
        );
        break;
      }
      case "second": {
        this.pairsDataSource.filteredData.sort((a, b) =>
          this.getSubmissionById(a.secondId)!.submitter
            .localeCompare(this.getSubmissionById(b.secondId).submitter) * mul
        );
        break;
      }
      case "similarity": {
        this.pairsDataSource.filteredData.sort((a, b) =>
          (this.getMaxScore(a) - this.getMaxScore(b)) * mul
        );
        break;
      }
    }
  }

  protected onLoadPair(element: SubmissionPair): void {
    console.log("Load pair:", element);
    this.router.navigate([PageRoutes.PAIRS, element.id]);
  }

  protected applyFilter(filter: string) {
    this.pairsDataSource.filter = filter?.toLowerCase();
  }

  protected getMaxScore(pair: SubmissionPair) {
    const scores = [...pair.plagScores.map(p => p.score * 100)];
    return Math.max(...scores);
  }
}
