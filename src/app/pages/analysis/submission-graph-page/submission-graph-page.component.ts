import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {
  D3ForceDirectedLayout,
  D3ForceDirectedSettings,
  Edge,
  GraphComponent,
  NgxGraphModule, NgxGraphStateChangeEvent, NgxGraphStates,
  NgxGraphZoomOptions,
  Node,
} from "@swimlane/ngx-graph";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionLabelingService} from "../../../services/submission-labeling.service";
import {Subject} from "rxjs";
import {forceCollide, forceLink, forceManyBody, forceSimulation, Simulation} from "d3-force";
import * as d3 from "d3";

@Component({
  selector: "app-submission-graph-page",
  imports: [
    NgxGraphModule,
    ContentContainerComponent
  ],
  templateUrl: "./submission-graph-page.component.html",
  styleUrl: "./submission-graph-page.component.css"
})
export class SubmissionGraphPageComponent implements AfterViewInit {

  @ViewChild(GraphComponent) graphComponent!: GraphComponent;
  protected zoomToFit$: Subject<NgxGraphZoomOptions> = new Subject<NgxGraphZoomOptions>();

  constructor(
    private analysisContext: AnalysisContextService,
    private submissionLabelingService: SubmissionLabelingService
  ) {
  }

  public onNodeSelect(node: Node) {
    if (node.data.isNodeSelected) {
      node.data.isNodeSelected = false;
    } else {
      node.data.isNodeSelected = true;
    }
    console.log(node);
    this.zoomToFit$.next({force: true, autoCenter: true});
  }

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

  public ngAfterViewInit(): void {
    console.log(this.graphComponent);

    this.graphComponent.nodes = this.createNodes();
    this.graphComponent.links = this.createLinks();

    const layout = new D3ForceDirectedLayout();
    layout.settings = this.d3Settings;
    this.graphComponent.layout = layout;

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
          } as Node;
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
