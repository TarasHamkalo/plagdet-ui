import {AfterViewInit, Component, effect, signal, ViewChild} from "@angular/core";
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
  MatTableDataSource
} from "@angular/material/table";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Submission} from "../../../model/submission";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {UnixDatePipe} from "../../../pipes/unix-date.pipe";


@Component({
  selector: "app-metadata-table",
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatSortHeader,
    MatCell,
    MatCellDef,
    UnixDatePipe,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatPaginator
  ],
  templateUrl: "./metadata-table.component.html",
  styleUrl: "./metadata-table.component.css"
})
export class MetadataTableComponent implements AfterViewInit {

  protected pairsDisplayedColumns: string[] = [
    "filename", "submitter", "creator", "lastModifiedBy", "totalEditTime", "dateCreated", "dateModified"
  ];

  protected submissionsDataSource = new MatTableDataSource<Submission>();

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  protected searchText = signal<string>("");

  constructor(private analysisContext: AnalysisContextService) {
    effect(() => {
      this.submissionsDataSource.data = [...this.analysisContext.getReport()()!.submissions.values()]
        .filter(s => !s.indexed);
    });
  }

  public ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
  }

  protected onSorting(sort: Sort) {
    if (sort.active in ["filename", "submitter"]) {
      return;
    }

    this.submissionsDataSource.data.sort((a, b) => this.compareSubmissions(a, b, sort));
  }

  protected applyFilter(filter: string) {
    this.submissionsDataSource.filter = filter?.toLowerCase();
  }

  private getSortValue(submission: Submission, field: string) {
    // @ts-expect-error {{field}} comes from table definition,
    // where it must correspond with real field name
    return submission.metadata[field];
  }

  private compareSubmissions(a: Submission, b: Submission, sort: Sort) {
    const valueA = this.getSortValue(a, sort.active);
    const valueB = this.getSortValue(b, sort.active);
    const mul = sort.direction === "asc" ? 1 : -1;
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return -1;
    if (valueB == null) return 1;

    // Compare values (handle both strings and numbers)
    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * mul;
    }

    return (valueA - valueB) * mul;
  };
}
