import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {
  D3ForceDirectedLayout,
  D3ForceDirectedSettings,
  Edge,
  GraphComponent,
  NgxGraphModule,
  NgxGraphStateChangeEvent,
  NgxGraphZoomOptions,
  Node,
} from "@swimlane/ngx-graph";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionLabelingService} from "../../../services/submission-labeling.service";
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

@Component({
  selector: "app-submission-graph-page",
  imports: [
    NgxGraphModule,
    ContentContainerComponent,
    SurfaceComponent,
    FloatingToolbarComponent,
    MatButton,
    MatTooltip
  ],
  templateUrl: "./submission-graph-page.component.html",
  styleUrl: "./submission-graph-page.component.scss"
})
export class SubmissionGraphPageComponent implements AfterViewInit {

  @ViewChild(GraphComponent) graphComponent!: GraphComponent;

  private dialog = inject(MatDialog);

  private graphSimulation: Simulation<any, undefined> = forceSimulation<any>()
    .force("charge", forceManyBody().strength(-150))
    .force("collide", forceCollide(55))
    .force("link", forceLink<any, any>()
      .id(node => node.id)
      .distance(() => 150)
      .strength(0.75))
    .alphaDecay(0.03);

  private d3Settings: D3ForceDirectedSettings = {
    force: this.graphSimulation,
    forceLink: this.graphSimulation.force("link"),
  };

  protected zoomToFitSubject: Subject<NgxGraphZoomOptions> = new Subject<NgxGraphZoomOptions>();

  constructor(
    private analysisContext: AnalysisContextService,
    private submissionLabelingService: SubmissionLabelingService,
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

        throw throwError(() => new Error("Cancel graph node action"));
      })
    ).subscribe({
      next: (choiceValue) => {
        console.log("Working with node " + node.label);
        if (choiceValue == 0) {
          this.router.navigate([PageRoutes.SUBMISSIONS, node.submission.id]);
        }
        if (choiceValue == 1) {
          console.log("Open cluster");
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
    console.log(this.graphComponent);

    this.graphComponent.nodes = this.createNodes();
    this.graphComponent.links = this.createLinks();

    const layout = new D3ForceDirectedLayout();
    layout.settings = this.d3Settings;
    this.graphComponent.layout = layout;
    this.graphComponent.showMiniMap = true;


    setTimeout(() => {
      this.graphSimulation.nodes().forEach(node => {
        node.fx = node.x;
        node.fy = node.y;
      });
      this.graphSimulation.alpha(0).stop();
    }, 5000);
  }

  public createLinks(): Edge[] {
    const report = this.analysisContext.getReport()()!;
    if (report) {
      const pairs = report.pairs;
      return Array.from(pairs.values())
        .map((pair) => {
          return {
            id: this.getLinkId(pair.id),
            source: this.getNodeIdFromSubmission(pair.firstId),
            target: this.getNodeIdFromSubmission(pair.secondId),
          } as Edge;
        });
    }

    return [];
  }

  public createNodes(): Node[] {
    const report = this.analysisContext.getReport()()!;
    if (report) {
      const submissions = report.submissions;
      const submissionFrequencyMap: Record<string, number> = {};

      return Array.from(submissions.values())
        .sort((a, b) => a.fileData.submitter.localeCompare(b.fileData.submitter))
        .map((submission) => {
          return {
            id: this.getNodeIdFromSubmission(submission.id),
            label: this.submissionLabelingService.getSubmissionLabel(submission, submissionFrequencyMap),
            submission: submission
          } as SubmissionNode;
        });
    }

    return [];
  }

  public getLinkId(id: string): string {
    return `link_${id}`;
  }

  public getNodeIdFromSubmission(id: number): string {
    return `node_${id.toFixed(0)}`;
  }

  public handleStateChange(event: NgxGraphStateChangeEvent): void {
    console.log(event.state);
  }

}
