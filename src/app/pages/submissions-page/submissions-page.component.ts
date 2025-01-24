import {Component, OnInit, signal} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {TitledSurfaceComponent} from '../../components/titled-surface/titled-surface.component';
import {Submission} from '../../model/submission';
import {AnalysisContextService} from '../../context/analysis-context.service';
import {DecimalPipe} from '@angular/common';
import {SubmissionPair} from '../../model/submission-pair';

@Component({
  selector: 'app-submissions-page',
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
    DecimalPipe
  ],
  templateUrl: './submissions-page.component.html',
  styleUrl: './submissions-page.component.css'
})
export class SubmissionsPageComponent implements OnInit {

  protected pairsDisplayedColumns: string[] = [
    "submitter", "filename", "maxSimilarity"
  ];

  public submissions = signal<Map<number, Submission> | undefined>(undefined);

  public submissionsSource:  MatTableDataSource<Submission> | null = null;

  constructor(private analysisContext: AnalysisContextService) {
  }

  ngOnInit() {
    this.submissions.set(this.analysisContext.getReport()()!.submissions);
    const submissionArray = this.submissions()?.values ? Array.from(this.submissions()!.values()) : [];
    this.submissionsSource = new MatTableDataSource(submissionArray);
  }

  onSorting(event: any) {
    console.log("Sorting");
  }

  getPlagScore(similarity: number) {
    return Math.round(similarity * 100);
  }
}
