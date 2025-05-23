import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {
  D3ForceDirectedLayout,
  D3ForceDirectedSettings,
  GraphComponent,
  NgxGraphModule,
  NgxGraphZoomOptions,
  Node,
} from "@swimlane/ngx-graph";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {forceCollide, forceLink, forceManyBody, forceSimulation, Simulation} from "d3-force";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {concatMap, of, Subject, throwError} from "rxjs";
import {
  FloatingToolbarComponent
} from "../../../components/floating-toolbar/floating-toolbar.component";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {
  ListPickerModalComponent
} from "../../../components/base/list-picker-modal/list-picker-modal.component";
import {Router} from "@angular/router";
import {PageRoutes} from "../../../app.routes";
import {SubmissionNode} from "../../../types/submission-node";
import {SubmissionGraphService} from "../../../services/submission-graph.service";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: "app-submission-graph-page",
  imports: [
    NgxGraphModule,
    ContentContainerComponent,
    SurfaceComponent,
    FloatingToolbarComponent,
    MatButton,
    MatTooltip,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption
  ],
  templateUrl: "./submission-graph-page.component.html",
  styleUrl: "./submission-graph-page.component.scss"
})
export class SubmissionGraphPageComponent implements AfterViewInit {

  @ViewChild(GraphComponent) protected graphComponent!: GraphComponent;

  protected zoomToFitSubject: Subject<NgxGraphZoomOptions> = new Subject<NgxGraphZoomOptions>();

  private dialog = inject(MatDialog);

  private graphSimulation: Simulation<any, undefined> = forceSimulation<any>()
    .force("charge", forceManyBody().strength(-550))
    .force("collide", forceCollide(5))
    .force("link", forceLink<any, any>()
      .id(node => node.id)
      .distance(() => 150)
      .strength(0.75))
    .alphaDecay(0.03);

  private d3Settings: D3ForceDirectedSettings = {
    force: this.graphSimulation,
    forceLink: this.graphSimulation.force("link"),
  };

  protected minPercentageSimilarityToInclude = 60;

  constructor(
    protected submissionGraphService: SubmissionGraphService,
    private router: Router,
  ) {
  }

  public onNodeSelect(node: Node) {
    this.openNavigationDialog(node as SubmissionNode);
  }

  protected openNavigationDialog(node: SubmissionNode): void {
    const dialogRef = this.dialog.open(ListPickerModalComponent, {
      data: {
        title: "Zvoľte akciu nad " + node.label,
        options: [
          {
            label: "Otvoriť informácie o odovzdaní",
            value: 0
          },
          {
            label: "Otvoriť informácie o zhluku",
            value: 1
          }
        ]
      },
    });
    dialogRef.afterClosed().pipe(
      concatMap(choiceValue => {
        if (choiceValue !== undefined) {
          return of(choiceValue);
        }

        return throwError(() => new Error("Cancel graph node action"));
      })
    ).subscribe({
      next: (choiceValue) => {
        if (choiceValue == 0) {
          this.router.navigate([PageRoutes.SUBMISSIONS, node.submission.id]);
        }
        if (choiceValue == 1) {
          const clusterId = this.submissionGraphService.getClusterForSubmission(node)!.id;
          this.router.navigate([PageRoutes.CLUSTERS, clusterId]);
        }
      },
      error: () => {
        // ignore
      }
    });
  }

  public zoomToFit(): void {
    this.zoomToFitSubject.next({autoCenter: false});
  }

  public ngAfterViewInit(): void {
    this.graphComponent.nodes = this.submissionGraphService.createNodes();
    this.graphComponent.links = this.submissionGraphService.createLinks();
    const layout = new D3ForceDirectedLayout();

    layout.settings = this.d3Settings;
    this.graphComponent.layout = layout;
    this.graphComponent.showMiniMap = true;
    this.graphComponent.draggingEnabled = false;
    setTimeout(() => {
      this.graphSimulation.nodes().forEach(node => {
        node.fx = node.x;
        node.fy = node.y;
      });
      this.graphSimulation.alpha(0).stop();
      this.graphSimulation.stop();
    }, 5000);
  }

  protected updateLinks() {
    this.submissionGraphService.setMinPercentageSimilarityToInclude(
      this.minPercentageSimilarityToInclude
    );
    this.graphComponent.links = this.submissionGraphService.createLinks();
    this.graphComponent.nodes = this.submissionGraphService.createNodes();
    this.graphComponent.update();
  }

  protected changeScoreType(value: "META" | "JACCARD" | "SEMANTIC") {
    this.submissionGraphService.setDisplayScoreType(value);
    this.graphComponent.links = this.submissionGraphService.createLinks();
    this.graphComponent.nodes = this.submissionGraphService.createNodes();
    this.graphComponent.update();
  }
}
