import {Component, OnInit, signal} from "@angular/core";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {Submission} from "../../model/submission";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {DecimalPipe} from "@angular/common";
import {SubmissionPair} from "../../model/submission-pair";

@Component({
  selector: "app-submissions-page",
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    TitledSurfaceComponent,
    MatHeaderCellDef,
  ],
  templateUrl: "./submissions-page.component.html",
  styleUrl: "./submissions-page.component.css"
})
export class SubmissionsPageComponent implements OnInit {

  protected pairsDisplayedColumns: string[] = [
    "submitter", "filename", "maxSimilarity"
  ];

  public submissions = signal<Submission[]>([]);

  public submissionsSource:  MatTableDataSource<Submission> | null = null;

  constructor(private analysisContext: AnalysisContextService) {
  }

  ngOnInit() {
    let submissionsArray = [...this.analysisContext.getReport()()!.submissions.values()];
    submissionsArray = submissionsArray.filter(s => !s.indexed);
    this.submissions.set(submissionsArray);
    this.submissionsSource = new MatTableDataSource(submissionsArray);
  }

  onSorting(sort: Sort) {
  }

  getPlagScore(similarity: number) {
    return Math.round(similarity * 100);
  }
}
