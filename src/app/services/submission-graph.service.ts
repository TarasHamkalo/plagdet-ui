import {computed, Injectable} from "@angular/core";
import {Edge} from "@swimlane/ngx-graph";
import {AnalysisContextService} from "../context/analysis-context.service";
import {SubmissionLabelingService} from "./submission-labeling.service";
import {SubmissionNode} from "../types/submission-node";
import {Cluster} from "../types/cluster";

@Injectable({
  providedIn: "root"
})
export class SubmissionGraphService {

  constructor(
    private analysisContextService: AnalysisContextService,
    private submissionLabelingService: SubmissionLabelingService,
  ) {
  }

  public clusters = computed<Cluster[]>(() => {
    const report = this.analysisContextService.getReport()()!;
    if (report) {
      return this.computeConnectedComponents();
    }

    return [];
  });

  private computeConnectedComponents() {
    const report = this.analysisContextService.getReport()()!;
    if (report) {
      const submissions = Array.from(report.submissions.values());
      const pairs = Array.from(report.pairs.values());
      const adjacencyList: Record<number, Set<number>> = {};
      const visited: Set<number> = new Set<number>();

      submissions.forEach(submission => {
        adjacencyList[submission.id] = new Set();
      });

      pairs.forEach(pair => {
        adjacencyList[pair.firstId].add(pair.secondId);
        adjacencyList[pair.secondId].add(pair.firstId);
      });

      const clusters: Cluster[] = [];
      for (const submission of submissions) {
        const component = this.findComponentWithDfs(submission.id, adjacencyList, visited);
        if (component.length > 0) {
          clusters.push({
            submissions: component.map(node => report.submissions.get(node))
          } as Cluster);
        }
      }
      return clusters;
    }

    return [];
  }

  public findComponentWithDfs(
    startNode: number,
    adjacencyList: Record<number, Set<number>>,
    visited: Set<number>
  ): number[] {
    const component: number[] = [];
    const stack: number[] = [startNode];

    while (stack.length > 0) {
      const node = stack.pop();
      if (node) {
        if (visited.has(node)) {
          continue;
        }

        visited.add(node);
        component.push(node);

        adjacencyList[node].forEach(n => stack.push(n));
      }
    }

    return component;
  }

  public createLinks(): Edge[] {
    const report = this.analysisContextService.getReport()()!;
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

  public createNodes(): SubmissionNode[] {
    const report = this.analysisContextService.getReport()()!;
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
}
