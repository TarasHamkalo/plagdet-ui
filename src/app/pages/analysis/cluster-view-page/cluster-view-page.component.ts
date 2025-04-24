import {AfterViewInit, Component, computed, effect, OnInit, signal, ViewChild} from "@angular/core";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {
  SubmissionsTableComponent
} from "../../../components/tables/submissions-table/submissions-table.component";
import {ActivatedRoute, Router} from "@angular/router";
import {SubmissionGraphService} from "../../../services/submission-graph.service";
import {Submission} from "../../../model/submission";
import {PageRoutes} from "../../../app.routes";
import {
  SimilarityHeatmapComponent
} from "../../../components/charts/similarity-heat-map/similarity-heatmap.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPair} from "../../../model/submission-pair";
import {PairsTableComponent} from "../../../components/tables/pairs-table/pairs-table.component";

@Component({
  selector: "app-cluster-view-page",
  imports: [
    ContentContainerComponent,
    SurfaceComponent,
    SubmissionsTableComponent,
    SimilarityHeatmapComponent,
    PairsTableComponent,
  ],
  templateUrl: "./cluster-view-page.component.html",
  styleUrl: "./cluster-view-page.component.css"
})
export class ClusterViewPageComponent implements OnInit, AfterViewInit {

  @ViewChild(SimilarityHeatmapComponent) protected heatMap!: SimilarityHeatmapComponent;

  protected clusterId = signal<string | null>(null);

  protected clusterSubmissions: Submission[] = [];

  public submissionsMapSource = computed(() => {
    const map = new Map<number, Submission>();
    this.clusterSubmissions.forEach(submission => {
      map.set(submission.id, submission);
    });

    return map;
  });

  public pairsMapSource = computed(() => {
    const report = this.analysisContextService.getReport()();
    const map = new Map<string, SubmissionPair>();
    if (report) {
      const clusterSubmissionsPairs = this.clusterSubmissions
        .filter(s => !s.indexed && s.pairIds.length > 0)
        .flatMap(s => s.pairIds);

      const clusterIds = new Set(this.clusterSubmissions.map(s => s.id));
      for (const pairId of clusterSubmissionsPairs) {
        const [idA, idB] = pairId.split("_");

        if (clusterIds.has(Number(idA)) && clusterIds.has(Number(idB))) {
          map.set(pairId, report.pairs.get(pairId)!);
        }
      }

    }

    return map;
  });

  protected pairsSource = computed(() => {
    return Array.from(this.pairsMapSource().values());
  });

  constructor(
    private analysisContextService: AnalysisContextService,
    private submissionsGraphService: SubmissionGraphService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      const cluster = this.submissionsGraphService.clusters()
        .find(source => source.id === this.clusterId());
      if (cluster == null) {
        this.router.navigate([PageRoutes.GRAPH]);
      } else {
        this.clusterSubmissions = cluster.submissions;
      }
    });
  }

  public ngAfterViewInit() {
    this.heatMap.selectedPairIdEmitter.subscribe((pId) => this.loadPair(pId));
    this.heatMap.unknownPairEmitter.subscribe((pId) => this.loadDiff(pId));
  }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clusterId.set(params.get("id"));
    });
  }

  public getNotIndexedSubmissionsFilterSet() {
    return new Set(this.clusterSubmissions.filter(s => !s.indexed).map(s => s.id));
  }

  public getIndexedSubmissionsFilterSet() {
    return new Set(this.clusterSubmissions.filter(s => s.indexed).map(s => s.id));
  }

  private loadPair(pairId: string) {
    this.router.navigate([PageRoutes.PAIRS, pairId]);
  }

  private loadDiff(pId: string) {
    const splits = pId.split("_");
    this.router.navigate([PageRoutes.DIFF, splits[0], splits[1]]);
  }
}
