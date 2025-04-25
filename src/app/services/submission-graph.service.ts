import {computed, Injectable, signal} from "@angular/core";
import {Edge} from "@swimlane/ngx-graph";
import {AnalysisContextService} from "../context/analysis-context.service";
import {SubmissionLabelingService} from "./submission-labeling.service";
import {SubmissionNode} from "../types/submission-node";
import {Cluster} from "../types/cluster";
import {SubmissionPairUtils} from "../utils/submission-pair-utils";
import {SubmissionPair} from "../model/submission-pair";
import {PlagScore} from "../model/plag-score";

@Injectable({
  providedIn: "root"
})
export class SubmissionGraphService {

  private displayScoreType = signal<"META" | "JACCARD" | "SEMANTIC" | "SEM&JAC">("SEMANTIC");

  private minSimilarityToInclude = signal<number>(0.6);

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

  public submissionClusterMap = computed<Record<number, string>>(() => {
    const map: Record<number, string> = {};

    this.clusters().forEach(cluster => {
      cluster.submissions.forEach(submission => {
        map[submission.id] = cluster.id;
      });
    });

    return map;
  });

  public setMinPercentageSimilarityToInclude(minPercentageSimilarityToInclude: number) {
    this.minSimilarityToInclude.set(minPercentageSimilarityToInclude / 100);
  }

  public getClusterForSubmission(submissionNode: SubmissionNode) {
    const submission = submissionNode.submission;
    const clusterId = this.submissionClusterMap()[submission.id];
    return this.clusters().find(source => source.id === clusterId);
  }

  private computeConnectedComponents() {
    const report = this.analysisContextService.getReport()()!;
    if (report) {
      const submissions = Array.from(report.submissions.values());
      const pairs = this.applyPairsFiltering(report.pairs, this.minSimilarityToInclude());
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
            id: this.getUniqueId(2),
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
      return this.applyPairsFiltering(pairs, this.minSimilarityToInclude())
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

  private applyPairsFiltering(pairs: Map<string, SubmissionPair>, minScoreToInclude: number) {
    return Array.from(pairs.values())
      .filter(pair => {
        const displayScoreType = this.displayScoreType();
        let score: PlagScore | null = null;
        if (displayScoreType === "SEM&JAC") {
          const semScore = SubmissionPairUtils.getScoreByType(pair, "SEMANTIC");
          const jaccardScore = SubmissionPairUtils.getScoreByType(pair, "JACCARD");
          score = semScore != null  ? semScore : jaccardScore;
        } else {
          score = SubmissionPairUtils.getScoreByType(pair, displayScoreType);
        }
        return score && score.score >= minScoreToInclude;
      });
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

  /**
   * @source: https://stackoverflow.com/a/60035555/20686007
   * generate groups of 4 random characters
   * @example getUniqueId(1) : 607f
   * @example getUniqueId(2) : 95ca-361a
   * @example getUniqueId(4) : 6a22-a5e6-3489-896b
   */
  public getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // @tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join("-");
  }

  public getDisplayScoreType() {
    return this.displayScoreType();
  }

  public setDisplayScoreType(value: "META" | "JACCARD" | "SEMANTIC" | "SEM&JAC") {
    this.displayScoreType.set(value);
  }

}
