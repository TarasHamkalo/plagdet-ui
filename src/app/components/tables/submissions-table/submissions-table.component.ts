import {
  AfterViewInit,
  Component,
  effect,
  Input,
  signal,
  ViewChild, ViewEncapsulation
} from "@angular/core";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {Submission} from "../../../model/submission";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MinutesTimePipe} from "../../../pipes/minutes-time.pipe";
import {CellHighlightDirective} from "../../../directives/cell-highlight.directive";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";

@Component({
  selector: "app-submissions-table",
  imports: [
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatLabel,
    MatButton,
    MatHeaderCellDef,
    MatCellDef,
    MatSort,
    MatSortHeader,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatInput,
    MatFormField,
    FormsModule,
    NgIf,
    MinutesTimePipe,
    CellHighlightDirective,
  ],
  templateUrl: "./submissions-table.component.html",
  styleUrls: ["./submissions-table.component.css", "../shared/base-table.scss"],
  encapsulation: ViewEncapsulation.None

})
export class SubmissionsTableComponent implements AfterViewInit {

  protected readonly displayedColumns: string[] = [
    "submitter", "filename", "totalEditTime", "maxSimilarity", "moreButton"
  ];

  @Input() public limit: number | null = 10;

  @Input() public enablePagination = false;

  @Input() public enableSearch = false;

  @Input() public pageSize = 5;

  @Input() public pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  protected searchText = signal<string>("");

  constructor(
    private analysisContext: AnalysisContextService,
    private router: Router
  ) {
    effect(() => {
      const submissions = analysisContext.getReport()()?.submissions;
      if (submissions) {
        this.submissionsDataSource.data = [...submissions!.values()]
          .filter(a => !a.indexed)
          .sort((a, b) => b.maxSimilarity - a.maxSimilarity)
          .slice(0, this.limit ? this.limit : Number.MAX_VALUE);
      }
    });

  }

  public ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
    this.submissionsDataSource.filterPredicate = (data: Submission, filter: string) => {
      return data!.submitter.toLowerCase().includes(filter);
    };
  }

  protected onSorting(sort: Sort) {
    if (sort.active === "totalEditTime") {
      const mul = (sort.direction === "asc") ? 1 : -1;
      this.submissionsDataSource.filteredData.sort(
        (a, b) => mul * (a.metadata.totalEditTime - b.metadata.totalEditTime)
      );
    }

  }

  protected getPlagScore(similarity: number) {
    return Math.round(similarity * 100);
  }

  protected loadSubmission(element: Submission) {
    this.router.navigate([PageRoutes.SUBMISSIONS, element.id]);
  }

  protected applyFilter(filter: string) {
    this.submissionsDataSource.filter = filter?.toLowerCase();
  }

}
