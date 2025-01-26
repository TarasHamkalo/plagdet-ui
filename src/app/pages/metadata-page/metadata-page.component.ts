import {Component, effect, OnInit, signal} from "@angular/core";
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
import {MatSort, MatSortHeader} from "@angular/material/sort";

@Component({
  selector: "app-metadata-page",
  imports: [
    MatProgressBar,
    TitledSurfaceComponent,
    DecimalPipe,
    MatButton,
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
    MatHeaderCellDef
  ],
  templateUrl: "./metadata-page.component.html",
  styleUrl: "./metadata-page.component.css"
})
export class MetadataPageComponent implements OnInit {

  protected pairsDisplayedColumns: string[] = [
    "filename", "submitter", "creator", "lastModifiedBy", "totalEditTime", "dateCreated", "dateModified"
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
}
