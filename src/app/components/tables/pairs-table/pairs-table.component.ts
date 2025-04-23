import {
  AfterViewInit,
  Component,
  effect,
  Input,
  OnDestroy,
  signal,
  Signal,
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
import {Router} from "@angular/router";
import {SubmissionPair} from "../../../model/submission-pair";
import {Submission} from "../../../model/submission";
import {PageRoutes} from "../../../app.routes";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {RouteContextService} from "../../../context/route-context.service";
import {TableContext} from "../../../types/table-context";
import {SubmissionPairUtils} from "../../../utils/submission-pair-utils";
import {TextOverflowScrollDirective} from "../../../directives/text-overflow-scroll.directive";


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
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    TextOverflowScrollDirective,

  ],
  templateUrl: "./pairs-table.component.html",
  styleUrls: ["./pairs-table.component.css", "../shared/base-table.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PairsTableComponent implements AfterViewInit, OnDestroy {

  public static readonly CONTEXT_KEY = "pairs-table";

  protected readonly pairsDisplayedColumns: string[] = [
    "firstDocumentName", "secondDocumentName", "meta-match",
    "jaccard-sim", "sem-sim", "moreButton"
  ];

  @Input({required: true}) public pairsSource!: Signal<SubmissionPair[]>;

  @Input() public contextPrefix = "";

  @Input() public isHalfPage = false;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  protected searchText = signal<string>("");

  protected pairsDataSource = new MatTableDataSource<SubmissionPair>();

  constructor(
    protected analysisContext: AnalysisContextService,
    protected routeContextService: RouteContextService,
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
    this.applyContext();
  }

  protected rowsFilter(data: SubmissionPair, filter: string): boolean {
    const first = this.getSubmissionById(data.firstId);
    const second = this.getSubmissionById(data.secondId);
    const rowText =
      `${first.fileData.submitter.toLowerCase()} ${second.fileData.submitter.toLowerCase()}`;
    const splits = filter.split(/\s+/);
    for (const split of splits) {
      if (!rowText.includes(split)) {
        return false;
      }
    }
    return true;
  }

  protected getSubmissionById(id: number): Submission {
    return this.analysisContext.getReport()()!.submissions!.get(id)!;
  }

  public onSorting(sort: Sort) {

    const mul = sort.direction === "asc" ? 1 : -1;
    switch (sort.active) {
      case "first": {
        this.pairsDataSource.filteredData.sort((a, b) =>
          this.getSubmissionById(a.firstId)!.fileData.submitter
            .localeCompare(this.getSubmissionById(b.firstId).fileData.submitter) * mul
        );
        break;
      }
      case "second": {
        this.pairsDataSource.filteredData.sort((a, b) =>
          this.getSubmissionById(a.secondId)!.fileData.submitter
            .localeCompare(this.getSubmissionById(b.secondId).fileData.submitter) * mul
        );
        break;
      }
      case "meta-match": {
        this.pairsDataSource.filteredData.sort(
          (a, b) => SubmissionPairUtils.compareByScore(a, b, "META") * mul
        );
        break;
      }
      case "jaccard-sim": {
        this.pairsDataSource.filteredData.sort(
          (a, b) => SubmissionPairUtils.compareByScore(a, b, "JACCARD") * mul
        );
        break;
      }
      case "sem-sim": {
        this.pairsDataSource.filteredData.sort(
          (a, b) => SubmissionPairUtils.compareByScore(a, b, "SEMANTIC") * mul
        );
        break;
      }
    }
  }

  protected onLoadPair(element: SubmissionPair): void {
    this.router.navigate([PageRoutes.PAIRS, element.id]);
  }

  protected applyFilter(filter: string) {
    this.pairsDataSource.filter = filter.trim()?.toLowerCase();
  }

  protected isMetadataMatched(pair: SubmissionPair) {
    const plagScore = SubmissionPairUtils.getScoreByType(pair, "META");
    return plagScore ? plagScore.score > 0 : 0;
  }

  protected getScoreByType(
    pair: SubmissionPair,
    type: "META" | "JACCARD" | "SEMANTIC"
  ) {
    const plagScore = SubmissionPairUtils.getScoreByType(pair, type);
    return SubmissionPairUtils.formatScore(plagScore ? plagScore.score : 0, 1);
  }

  protected getMaxScore(pair: SubmissionPair) {
    const scores = [...pair.plagScores.map(p => p.score * 100)];
    return Math.max(...scores);
  }

  public ngOnDestroy(): void {
    this.routeContextService.putProperty(
      PairsTableComponent.CONTEXT_KEY,
      JSON.stringify({filter: this.searchText()} as TableContext),
      this.contextPrefix
    );
  }

  private applyContext() {
    const persistedContext = this.routeContextService.popProperty(
      PairsTableComponent.CONTEXT_KEY,
      this.contextPrefix
    );

    if (persistedContext) {
      const context = JSON.parse(persistedContext) as TableContext;
      this.searchText.set(context.filter);
      this.applyFilter(this.searchText());
    }
  }

}
