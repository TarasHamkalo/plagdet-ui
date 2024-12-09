import {Component, OnInit} from '@angular/core';
import {SubmissionsService} from "../../services/submissions.service";
import {Submission} from "../../model/submission";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {TableColumnDefinition} from "../../model/table-column-definition";
import {Cluster} from "../../model/cluster";
import {ClustersService} from "../../services/clusters.service";
import {
  SubmissionsListComponent
} from "../../components/submissions-list/submissions-list.component";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
import {ImageWrapperComponent} from "../../components/image-wrapper/image-wrapper.component";
import {StatCardComponent} from "../../components/stat-card/stat-card.component";
import {
  AnalysisInfoCardComponent
} from "../../components/analysis-info-card/analysis-info-card.component";
import {AnalysisService} from "../../services/analysis.service";

@Component({
  selector: 'app-analysis-page',
  imports: [
    MatTableModule,
    SubmissionsListComponent,
    TitledSurfaceComponent,
    MatSort,
    MatSortHeader,
    MatButton,
    ImageWrapperComponent,
    StatCardComponent,
    AnalysisInfoCardComponent,

  ],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.css'
})
export class AnalysisPageComponent implements OnInit {

  public submissionTableDefinitions: TableColumnDefinition[] = [
    {fieldName: 'submitter', displayName: 'Odovzdávateľ'},
    {fieldName: 'fileName', displayName: 'Názov súboru'},
    {fieldName: 'totalEditTime', displayName: 'Čas úpravy (min)'},
    {fieldName: 'maxSimilarity', displayName: 'Maximálna podobnosť %'},
  ];

  public submissionsDisplayedColumns: string[] = [];

  public submissionsDataSource = new MatTableDataSource<Submission>([]);

  public clusterTableDefinitions: TableColumnDefinition[] = [
    {fieldName: 'name', displayName: 'Názov zhluku'},
    {fieldName: 'avgSimilarity', displayName: 'Priemerná podobnosť'},
    {fieldName: 'avgEditTime', displayName: 'Priemerný čas úpravy (min)'},
    {fieldName: 'numberOfSubmissions', displayName: 'Počet odovzdaní '},
  ];

  public clusterDisplayedColumns: string[] = [];

  public clustersDataSource = new MatTableDataSource<Cluster>([]);

  constructor(private analysisService: AnalysisService,
              private submissionsService: SubmissionsService,
              private clustersService: ClustersService) {
  }

  ngOnInit() {
    this.submissionsService.getSubmissions().subscribe(submissions => {
      console.log(submissions);
      this.submissionsDataSource.data = submissions;
    });

    this.clustersService.getClusters().subscribe(clusters => {
      console.log(clusters);
      this.clustersDataSource.data = clusters;
    });

    this.analysisService.analyze();

    let temp = this.submissionTableDefinitions.map(col => col.fieldName);
    this.submissionsDisplayedColumns = temp.concat('moreButton');
    console.log(this.submissionsDisplayedColumns);

    temp = this.clusterTableDefinitions.map(col => col.fieldName);
    this.clusterDisplayedColumns = temp.concat('submissionList');
  }

  onSorting(event: any) {
    console.log(event);
    console.log('Busy sorting array....');
  }
}
