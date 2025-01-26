import {AfterViewInit, Component, effect, Input, OnInit, ViewChild} from "@angular/core";
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
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {Submission} from "../../model/submission";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: "app-submissions-table",
  imports: [
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    TitledSurfaceComponent,
    MatButton,
    MatHeaderCellDef,
    MatCellDef,
    MatSort,
    MatSortHeader,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
  ],
  templateUrl: "./submissions-table.component.html",
  styleUrl: "./submissions-table.component.css"
})
export class SubmissionsTableComponent implements AfterViewInit {

  @Input() public limit: number | null = 10;

  @Input() public enablePagination = false;

  @Input() public pageSize = 5;

  @Input() public pageSizeOptions = [5, 10, 25, 100];

  protected displayedColumns: string[] = [
    "submitter", "filename", "totalEditTime", "maxSimilarity", "moreButton"
  ];

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  constructor(private analysisContext: AnalysisContextService) {
    effect(() => {
      const submissions = analysisContext.getReport()()?.submissions;
      this.submissionsDataSource.data = [...submissions!.values()]
        .filter(a => !a.indexed)
        .sort((a, b) => b.maxSimilarity - a.maxSimilarity)
        .slice(0, this.limit ? this.limit : Number.MAX_VALUE);
    });
  }

  ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
  }

  onSorting(sort: Sort) {
    if (sort.active === "totalEditTime") {
      const mul = (sort.direction === "asc") ? 1 : -1;
      this.submissionsDataSource.data.sort(
        (a, b) => mul * (a.metadata.totalEditTime - b.metadata.totalEditTime)
      );
    }

  }

  getPlagScore(similarity: number) {
    return Math.round(similarity * 100);
  }

  loadSubmission(element: Submission) {

  }

  // onPageChanged($event: PageEvent) {
  //
  // }
}
