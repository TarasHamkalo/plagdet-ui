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
import {
  MetadataDeviationHighlightDirective
} from "../../../directives/metadata-deviation-highlight.directive";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {ExportService} from "../../../services/export.service";
import {TextOverflowScrollDirective} from "../../../directives/text-overflow-scroll.directive";


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
    MinutesTimePipe,
    MetadataDeviationHighlightDirective,
    MatIcon,
    MatButton,
    TextOverflowScrollDirective
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

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  protected searchText = signal<string>("");

  constructor(
    private analysisContext: AnalysisContextService,
    private exportService: ExportService
  ) {
    effect(() => {
      this.submissionsDataSource.data = [...this.analysisContext.getReport()()!.submissions.values()]
        .filter(s => !s.indexed);
    });
  }

  public ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
    this.submissionsDataSource.filterPredicate = this.rowsFilter.bind(this);
  }

  protected rowsFilter(data: Submission, filter: string): boolean {
    const hasSubmitter = data.fileData.submitter.toLowerCase().includes(filter);
    const hasCreator = data.fileData.metadata.creator?.toLowerCase().includes(filter);
    const hasModifier = data.fileData.metadata.modifier?.toLowerCase().includes(filter);
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
    return submission.fileData.metadata[field];
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

  protected downloadMetadataCsv() {
    this.exportService.exportSubmissionToCsv(this.submissionsDataSource.filteredData, Date.now().toFixed());
  }
}
