import {
  AfterViewInit,
  Component,
  effect,
  signal,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
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
import {MinutesTimePipe} from "../../../pipes/minutes-time.pipe";


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
    MatPaginator,
    MinutesTimePipe
  ],
  templateUrl: "./metadata-table.component.html",
  styleUrls: ["./metadata-table.component.css", "../shared/base-table.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MetadataTableComponent implements AfterViewInit {

  protected pairsDisplayedColumns: string[] = [
    "filename", "submitter", "creator", "lastModifiedBy", "totalEditTime", "dateCreated", "dateModified"
  ];

  protected submissionsDataSource = new MatTableDataSource<Submission>();

  public static readonly DATE_DEVIATION_SECONDS = 30 * 24 * 60 * 60 * 1000;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  protected searchText = signal<string>("");

  private avgEditTime = 0;

  private avgDateCreated = 0; // unix timestamp

  private avgModificationDate = 0;

  constructor(private analysisContext: AnalysisContextService) {
    effect(() => {
      const data = [...this.analysisContext.getReport()()!.submissions.values()]
        .filter(s => !s.indexed);
      this.calculateAverages(data);
      this.submissionsDataSource.data = data;
    });
  }

  public ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
    this.submissionsDataSource.filterPredicate = this.rowsFilter.bind(this);
  }

  private calculateAverages(data: Submission[]) {
    this.avgEditTime = this.calculateAvg(data.map(e => e.metadata.totalEditTime));
    const creationDateFiltered = data
      .filter(e => e.metadata.creationDate !== undefined)
      .map(e => e.metadata.creationDate!);

    const modificationDateFiltered = data
      .filter(e => e.metadata.modificationDate !== undefined)
      .map(e => e.metadata.modificationDate!);
    this.avgDateCreated = this.calculateAvgFromModeYearDate(creationDateFiltered);
    console.log(new Date(this.avgDateCreated));
    this.avgModificationDate = this.calculateAvgFromModeYearDate(modificationDateFiltered);
    console.log(new Date(this.avgModificationDate ));
  }

  private calculateAvg(arr: number[]) {
    return arr.length > 0 ? (arr.reduce((s: number, e: number) => s + e) / arr.length) : 0;
  }

  private calculateAvgFromModeYearDate(dates: number[]) {
    const yearMode = this.findYearMode(dates);
    return this.calculateAvg(dates.filter(e => new Date(e).getFullYear() == yearMode));
  }

  private findYearMode(dates: number[]) {
    const yearCounts: Record<number, number> = {};
    dates.forEach(e => {
      const year = new Date(e).getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    let mostFrequentYear: number | null = null;
    let maxCount = 0;
    for (const year in yearCounts) {
      if (yearCounts[year] > maxCount) {
        mostFrequentYear = parseInt(year);
        maxCount = yearCounts[year];
      }
    }
    return mostFrequentYear;
  }

  protected isBelowAvgEditTime(element: Submission): boolean {
    return element.metadata.totalEditTime < this.avgEditTime;
  }

  protected isDateDeviating(
    element: Submission,
    dateField: "modificationDate" | "creationDate"
  ): boolean {
    console.log(element.submitter, element.metadata);
    const dateValue = element.metadata[dateField]!;
    if (!dateValue) {
      return true;
    }

    const avg = dateField == "modificationDate" ?
      this.avgModificationDate : this.avgModificationDate;

    const deviationRange = MetadataTableComponent.DATE_DEVIATION_SECONDS;
    return Math.abs(dateValue - avg) > deviationRange;
  }

  protected rowsFilter(data: Submission, filter: string): boolean {
    const hasSubmitter = data.submitter.toLowerCase().includes(filter);
    const hasCreator = data.metadata.creator?.toLowerCase().includes(filter);
    const hasModifier = data.metadata.modifier?.toLowerCase().includes(filter);
    return hasCreator || hasModifier || hasSubmitter;
  }

  protected onSorting(sort: Sort) {
    if (sort.active in ["filename", "submitter"]) {
      return;
    }
    this.submissionsDataSource.filteredData.sort((a, b) => this.compareSubmissions(a, b, sort));
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
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // Compare values (handle both strings and numbers)
    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * mul;
    }

    return (valueA - valueB) * mul;
  };
}
