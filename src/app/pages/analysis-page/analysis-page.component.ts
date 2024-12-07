import {Component} from '@angular/core';
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {SubmissionsService} from "../../services/submissions.service";
import {Submission} from "../../model/submission";
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {TableColumnDefinition} from "../../model/table-column-definition";
import { MatTableModule } from '@angular/material/table';
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
@Component({
  selector: 'app-analysis-page',
  imports: [
    TitledSurfaceComponent,
    // MatTable,
    // MatHeaderRow,
    // MatRow,
    // MatHeaderCell,
    // MatCell,
    // MatHeaderRowDef,
    // MatHeaderCellDef,
    // MatCellDef,
    // MatColumnDef,
    MatTableModule,
    MatSort,
    MatSortHeader,
    MatButton,

    // MatRowDef,
  ],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.css'
})
export class AnalysisPageComponent {

  public submissionTableDefinitions: TableColumnDefinition[] = [
    {fieldName: 'submitter', displayName: 'Odovzdávateľ'},
    {fieldName: 'fileName', displayName: 'Názov súboru'},
    {fieldName: 'totalEditTime', displayName: 'Čas úpravy (min)'},
    {fieldName: 'maxSimilarity', displayName: 'Maximálna podobnosť %'},
  ];

  public submissionDisplayedColumns: string[] = []

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  constructor(private submissionsService: SubmissionsService) {}

  ngOnInit() {
    this.submissionsService.getSubmissions().subscribe(submissions => {
      console.log(submissions);
      this.submissionsDataSource.data = submissions;
    });

    const temp = this.submissionTableDefinitions.map(col => col.fieldName)
    this.submissionDisplayedColumns = temp.concat('moreButton')
    console.log(this.submissionDisplayedColumns);
  }

  onSubmissionsSorting($event: any) {
    console.log($event);
    console.log('Busy sorting array....');
  }
}
