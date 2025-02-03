import {Injectable} from "@angular/core";
import {AnalysisContextService} from "../context/analysis-context.service";
import {Submission} from "../model/submission";
import {SubmissionPair} from "../model/submission-pair";
import {SubmissionPairUtils} from "../utils/submission-pair-utils";
import {ApexAxisChartSeries} from "ng-apexcharts";

@Injectable({
  providedIn: "root"
})
export class SimilarityHeatmapService {

  private displayScoreType: "META" | "JACCARD" | "SEMANTIC" = "SEMANTIC";

  private documentsLimit = 15;

  private documentSeries!: ApexAxisChartSeries | null;

  constructor(private analysisContextService: AnalysisContextService) {
  }

  private initDocumentSeries(): boolean {
    if (this.documentSeries) {
      return true;
    }

    const submissions = this.analysisContextService.getReport()()?.submissions.values();
    const pairs = this.analysisContextService.getReport()()?.pairs;
    if (!submissions || !pairs) {
      this.documentSeries = null;
      return false;
    }

    const newSubmissions = [...submissions].filter(s => !s.indexed);

    const series = [];
    for (const submission of newSubmissions) {
      series.push({
        name: submission.id.toFixed(0),
        data: this.comparisonResultsFor(submission, newSubmissions, pairs)
      });
    }

    this.documentSeries = series;
    return true;
  }

  public getDocumentSeriesPage(x: number, y: number) {
    if (!this.initDocumentSeries()) {
      return;
    }
    console.log(this.documentSeries);

    const mapped = this.documentSeries!.map(s => {
      return {...s, data: s.data.slice(x, x + this.documentsLimit + 1)};
    });

    console.log(mapped.slice(y, y + this.documentsLimit + 1));
    return mapped.slice(y, y + this.documentsLimit + 1);
  }

  private comparisonResultsFor(
    target: Submission,
    other: Submission[],
    pairs: Map<string, SubmissionPair>
  ) {
    return other.map(o => {
      if (o.id === target.id) {
        return {x: o.id.toFixed(0), y: 100};
      }

      let pair = pairs.get(`${target.id}_${o.id}`);
      if (!pair) {
        pair = pairs.get(`${o.id}_${target.id}`);
      }

      if (pair) {
        const plagScore = SubmissionPairUtils.getFormattedScore(pair, this.displayScoreType);
        return {x: o.id.toFixed(0), y: plagScore};
      }

      return {x: o.id.toFixed(0), y: 0};
    });

  }

  public setDisplayScoreType(type: "META" | "JACCARD" | "SEMANTIC") {
    this.displayScoreType = type;
  }

  public setDocumentsLimit(limit: number) {
    this.documentsLimit = limit;
  }
}
