import {AfterViewInit, Component, effect, OnInit, signal, ViewChild} from "@angular/core";
import {MatProgressBar} from "@angular/material/progress-bar";
import {DecimalPipe, NgIf} from "@angular/common";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {Submission} from "../../model/submission";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

@Component({
  selector: "app-metadata-page",
  imports: [
    MatProgressBar,
    TitledSurfaceComponent,
    DecimalPipe,
    MatButton,
    MatLabel,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatTable,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatFormField,
    FormsModule,
    MatInput,
    MatPaginator
  ],
  templateUrl: "./metadata-page.component.html",
  styleUrl: "./metadata-page.component.css"
})
export class MetadataPageComponent implements AfterViewInit {

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

  ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
  }

  onSorting(sort: Sort) {
    if (sort.active in ["filename", "submitter"]) {

      return;
    }

    this.submissionsDataSource.data.sort((a, b) => this.compareSubmissions(a, b, sort));
  }

  mapUnixTimeToDate(unixTime: number): string {
    if (unixTime.toString().length === 10) {
      unixTime *= 1000;
    }

    const date = new Date(unixTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Добавляем ведущий ноль
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  applyFilter(filter: string) {
    this.submissionsDataSource.filter = filter?.toLowerCase();
  }
  
  getSortValue(submission: Submission, field: string) {
    // @ts-expect-error
    return submission.metadata[field];
  }
  
  compareSubmissions(a: Submission, b: Submission, sort: Sort) {
    console.log(sort);
    const valueA = this.getSortValue(a, sort.active);
    const valueB = this.getSortValue(b, sort.active);
    console.log(valueA, valueB);
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
