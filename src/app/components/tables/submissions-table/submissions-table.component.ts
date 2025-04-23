import {
  AfterViewInit,
  Component,
  effect,
  Input,
  OnDestroy,
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
import {Submission} from "../../../model/submission";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MinutesTimePipe} from "../../../pipes/minutes-time.pipe";
import {
  MetadataDeviationHighlightDirective
} from "../../../directives/metadata-deviation-highlight.directive";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";
import {RouteContextService} from "../../../context/route-context.service";
import {TableContext} from "../../../types/table-context";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";
import {TextOverflowScrollDirective} from "../../../directives/text-overflow-scroll.directive";

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
    MetadataDeviationHighlightDirective,
    TextOverflowScrollDirective,

  ],
  templateUrl: "./submissions-table.component.html",
  styleUrls: ["../shared/base-table.scss", "./submissions-table.component.css"],
  encapsulation: ViewEncapsulation.None

})
export class SubmissionsTableComponent implements AfterViewInit, OnDestroy {

  public static readonly CONTEXT_KEY: string = "submissions-table";

  protected readonly displayedColumns: string[] = [
    "submitter", "filename", "totalEditTime", "meta-match", "maxSimilarity", "moreButton"
  ];

  @Input() public limit: number | null = 10;

  @Input() public submissionsFilterSet: Set<number> | null = null;

  @Input() public enablePagination = false;

  @Input() public enableSearch = false;

  @Input() public showNotIndexedOnly = true;

  @Input() public pageSize = 5;

  @Input() public pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  @Input() public contextPrefix = "";

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  protected searchText = signal<string>("");


  constructor(
    private analysisContext: AnalysisContextService,
    private routeContextService: RouteContextService,
    private router: Router
  ) {
    effect(() => {
      const submissions = analysisContext.getReport()()?.submissions;
      if (submissions) {
        let submissionsArray = Array.from(submissions!.values());
        if (this.showNotIndexedOnly) {
          submissionsArray = submissionsArray.filter(s => !s.indexed);
        }

        if (this.submissionsFilterSet != null) {
          submissionsArray = submissionsArray.filter(s => this.submissionsFilterSet?.has(s.id));
        }
        this.submissionsDataSource.data = submissionsArray
          .sort((a, b) => b.maxSimilarity - a.maxSimilarity)
          .slice(0, this.limit ? this.limit : Number.MAX_VALUE);
      }
    });

  }

  public ngAfterViewInit() {
    this.submissionsDataSource.sort = this.sort;
    this.submissionsDataSource.paginator = this.matPaginator;
    this.submissionsDataSource.filterPredicate = this.rowsFilter.bind(this);

    this.applyContext();
  }

  protected onSorting(sort: Sort) {
    if (sort.active === "totalEditTime") {
      const mul = (sort.direction === "asc") ? 1 : -1;
      this.submissionsDataSource.filteredData.sort(
        (a, b) => mul * (a.fileData.metadata.totalEditTime - b.fileData.metadata.totalEditTime)
      );
    }

  }

  protected getPlagScore(similarity: number) {
    return SubmissionPairUtils.formatScore(similarity, 1);
  }

  protected loadSubmission(element: Submission) {
    this.router.navigate([PageRoutes.SUBMISSIONS, element.id]);
  }

  protected applyFilter(filter: string) {
    this.submissionsDataSource.filter = filter?.toLowerCase();
  }

  public ngOnDestroy(): void {
    this.routeContextService.putProperty(
      SubmissionsTableComponent.CONTEXT_KEY,
      JSON.stringify({filter: this.searchText()} as TableContext),
      this.contextPrefix
    );
  }

  private applyContext() {
    const persistedContext = this.routeContextService.popProperty(
      SubmissionsTableComponent.CONTEXT_KEY,
      this.contextPrefix
    );

    if (persistedContext) {
      const context = JSON.parse(persistedContext) as TableContext;
      this.searchText.set(context.filter);
      this.applyFilter(this.searchText());
    }
  }

  protected isMetadataMatched(submission: Submission) {
    const report = this.analysisContext.getReport()();
    if (report) {
      const pairs = report.pairs;
      const submissionPairs = submission.pairIds.map((pId) => pairs.get(pId));
      for (const submissionPair of submissionPairs) {
        if (submissionPair) {
          const plagscore = SubmissionPairUtils.getScoreByType(submissionPair, "META");
          if (plagscore && plagscore.score > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private rowsFilter(data: Submission, filter: string): boolean {
    const rowText = data!.fileData.submitter.toLowerCase();
    const splits = filter.trim().split(/\s+/);
    for (const split of splits) {
      if (!rowText.includes(split)) {
        return false;
      }
    }
    return true;
  }
}

