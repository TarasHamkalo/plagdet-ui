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
    const report = this.analysisContextService.getReport()();
    if (!report) {
      this.documentSeries = null;
      return false;
    }
    const submissions = report.submissions.values();
    const pairs = report.pairs;
    const newSubmissions = Array.from(submissions).filter(s => !s.indexed);

    const series = [];
    for (const submission of newSubmissions) {
      series.push({
        name: submission.id.toFixed(0),
        data: newSubmissions.map(other => this.getDataPoint(submission, other, pairs))

      });
    }

    this.documentSeries = series;
    return true;
  }

  public getDocumentSeriesPage(x: number, y: number) {
    if (!this.initDocumentSeries()) {
      return [];
    }

    const slicedSeries = this.documentSeries!.map(seriesItem => ({
      ...seriesItem,
      data: seriesItem.data.slice(x, x + this.documentsLimit)
    }));

    return slicedSeries.slice(y, y + this.documentsLimit);
  }

  private getDataPoint(target: Submission, other: Submission, pairs: Map<string, SubmissionPair>) {
    if (target.id === other.id) {
      return { x: other.id.toFixed(0), y: SubmissionPairUtils.formatScore(1) };
    }

    const key1 = `${target.id}_${other.id}`;
    const key2 = `${other.id}_${target.id}`;
    const pair = pairs.get(key1) || pairs.get(key2);
    const score = pair ?
      SubmissionPairUtils.getFormattedScore(pair, this.displayScoreType) :
      SubmissionPairUtils.formatScore(0);

    return { x: other.id.toFixed(0), y: score };
  }

  public setDisplayScoreType(type: "META" | "JACCARD" | "SEMANTIC") {
    this.displayScoreType = type;
    this.documentSeries = null;
  }

  public setDocumentsLimit(limit: number) {
    this.documentsLimit = limit;
  }
}
