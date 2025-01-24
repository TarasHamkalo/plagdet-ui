import {Component, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {Submission} from "../../model/submission";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SubmissionPair} from "../../model/submission-pair";
import {FormsModule} from "@angular/forms";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {DecimalPipe, NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";

@Component({
  selector: "app-submission-pairs-page",
  imports: [
    TitledSurfaceComponent,
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
    NgIf,
    MatProgressBar,
    MatSortHeader,
    DecimalPipe,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: "./submission-pairs-page.component.html",
  styleUrl: "./submission-pairs-page.component.css"
})
export class SubmissionPairsPageComponent implements OnInit {

  protected searchText = signal<string>("");

  protected pairsDisplayedColumns: string[] = [
    "firstDocumentName", "secondDocumentName", "similarity", "moreButton"
  ];

  public pairsDataSource: MatTableDataSource<SubmissionPair> | null = null;

  public pairsData = signal<SubmissionPair[]>([]);

  constructor(protected analysisContext: AnalysisContextService,
              private router: Router) {
  }

  ngOnInit() {
    this.pairsData.set([...this.analysisContext.getReport()()!.pairs!.values()]);
    this.pairsDataSource = new MatTableDataSource(this.pairsData());
  }

  protected getSubmissionById(id: number): Submission {
    return this.analysisContext.getReport()()!.submissions!.get(id)!;
  }

  onSorting(event: any) {
    console.log("Sorting");
  }

  onPageChanged(event: any): void {
    console.log("Pagination event:", event);
  }

  onLoadPair(element: SubmissionPair): void {
    console.log("Load pair:", element);
    this.router.navigate([PageRoutes.PAIR, element.id]) ;
  }

  applyFilter(event: any) {
    console.log("Filtering");
  }

  getPlagScore(pair: SubmissionPair) {
    return Math.round(
      pair.plagScores.sort((v) => -1 * v.score).at(0)!.score * 100
    );
  }
}
