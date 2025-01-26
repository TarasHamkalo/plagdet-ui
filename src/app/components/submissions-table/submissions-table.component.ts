import {Component, effect, OnInit} from "@angular/core";
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
  ],
  templateUrl: "./submissions-table.component.html",
  styleUrl: "./submissions-table.component.css"
})
export class SubmissionsTableComponent implements OnInit {

  protected displayedColumns: string[] = [
    "submitter", "filename", "totalEditTime", "maxSimilarity", "moreButton"
  ];

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  constructor(private analysisContext: AnalysisContextService) {
    effect(() => {
      const submissions = analysisContext.getReport()()?.submissions;
      this.submissionsDataSource.data = [...submissions!.values()]
        .filter(a => !a.indexed)
        .sort((a, b) => b.maxSimilarity - a.maxSimilarity)
        .slice(0, 10);
    });
  }

  ngOnInit() {
  }

  onSorting(sort: Sort) {
  }

  getPlagScore(similarity: number) {
    return Math.round(similarity * 100);
  }

  loadSubmission(element: Submission) {

  }
}
