import {Component, signal, OnInit} from "@angular/core";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource

} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Analysis} from "../../model/analysis";
import {TableColumnDefinition} from "../../model/table-column-definition";
import {DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatChip} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";
import {StatusChipComponent} from "../../components/status-chip/status-chip.component";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";

@Component({
  selector: "app-previous-analysis-page",
  imports: [
    TitledSurfaceComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatCell,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    DatePipe,
    MatPaginator,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatIconButton,
    MatIcon,
    MatChip,
    MatTooltip,
    StatusChipComponent
  ],
  templateUrl: "./previous-analysis-page.component.html",
  styleUrl: "./previous-analysis-page.component.css"
})
export class PreviousAnalysisPageComponent implements OnInit {

  public mockAnalysis: Partial<Analysis>[] = [
    {
      name: "Submissions 21-22",
      totalFilesCount: 201,
      dateAnalyzed: new Date(2023, 11, 25),
      status: "success"
    },
    {
      name: "Submissions 19-20",
      totalFilesCount: 141,
      dateAnalyzed: new Date(2023, 11, 26),
      status: "error"
    },
    {
      name: "Submissions",
      totalFilesCount: 188,
      dateAnalyzed: new Date(2023, 11, 27),
      status: "in-process"
    }
  ];

  public analysisTableDefinitions: TableColumnDefinition[] = [
    {fieldName: "name", displayName: "Názov analýzy"},
    {fieldName: "totalFilesCount", displayName: "Počet odovzdaní"},
    {fieldName: "dateAnalyzed", displayName: "Dátum"},
    {fieldName: "status", displayName: "Stav"},
  ];

  public analysisDisplayedColumns: string[] = this.analysisTableDefinitions.map(col => col.fieldName);

  public analysisDataSource = new MatTableDataSource<Partial<Analysis>>(this.mockAnalysis);

  public searchText = signal("");

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.analysisDisplayedColumns = this.analysisDisplayedColumns.concat("moreButton");
  }

  onSorting(event: any) {
    console.log("Sorting");
  }

  onPageChanged(event: any): void {
    console.log("Pagination event:", event);
  }

  onLoadAnalysis(element: Analysis): void {
    this.router.navigate([PageRoutes.ANALYSIS]) ;
  }

  applyFilter(event: any) {
    console.log("Filtering");
  }
}
