import {Injectable} from "@angular/core";
import {AnalysisContextService} from "../context/analysis-context.service";
import {Submission} from "../model/submission";
import {SubmissionPair} from "../model/submission-pair";
import {SubmissionPairUtils} from "../utils/submission-pair-utils";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {DocumentSeriesPage} from "../types/document-series-page";

@Injectable({
  providedIn: "root"
})
export class SimilarityHeatmapService {

  private displayScoreType: "META" | "JACCARD" | "SEMANTIC" = "SEMANTIC";

  private documentsLimit = 25;

  private documentSeries: ApexAxisChartSeries | null = null;

  private previousPage: DocumentSeriesPage | null = null;

  private duplicateCategories: Record<string, number> = {};

  private duplicateSeries: Record<string, number> = {};

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
    const newSubmissions = Array.from(submissions).filter(s => !s.indexed && s.maxSimilarity !== 0.0);

    const series = [];
    for (const submission of newSubmissions) {
      this.duplicateCategories = {};
      series.push({
        name: this.getDataPointCategory(submission, this.duplicateSeries),
        data: newSubmissions.map(other => this.getDataPoint(submission, other, pairs))
      });
    }

    this.documentSeries = series;
    return true;
  }

  public getDocumentSeriesPage(x: number, y: number): DocumentSeriesPage {
    if (!this.initDocumentSeries()) {
      return {x: 0, y: 0, series: [], viewUpdate: false};
    }
    const maxPosSymmetric = this.getMaxPosition();
    const rx = Math.min(maxPosSymmetric, Math.max(0, x));
    const ry = Math.min(maxPosSymmetric, Math.max(0, y));
    if (this.previousPage && this.previousPage.x == rx && this.previousPage.y == ry) {
      return {...this.previousPage, viewUpdate: false};
    }

    const slicedSeries = this.documentSeries!.map(seriesItem => ({
      ...seriesItem,
      data: seriesItem.data.slice(rx, rx + this.documentsLimit)
    }));

    this.previousPage = {
      x: rx,
      y: ry,
      series: slicedSeries.slice(ry, ry + this.documentsLimit),
      viewUpdate: true
    };

    return this.previousPage;
  }

  public getMaxPosition(): number {
    return this.documentSeries![0].data.length - this.documentsLimit;
  }

  private getDataPoint(target: Submission, other: Submission, pairs: Map<string, SubmissionPair>) {
    if (target.id === other.id) {
      return {
        x: this.getDataPointCategory(other, this.duplicateCategories),
        y: SubmissionPairUtils.formatScore(1)
      };
    }

    const key1 = `${target.id}_${other.id}`;
    const key2 = `${other.id}_${target.id}`;
    const pair = pairs.get(key1) || pairs.get(key2);
    const score = pair ?
      SubmissionPairUtils.getFormattedScore(pair, this.displayScoreType) :
      SubmissionPairUtils.formatScore(0);

    return {x: this.getDataPointCategory(other, this.duplicateCategories), y: score};
  }

  private getDataPointCategory(submission: Submission, frequencyMap: Record<string, number>): string {
    const duplicateCount = frequencyMap[submission.submitter];
    if (duplicateCount) {
      frequencyMap[submission.submitter] = duplicateCount + 1;
      return `${submission.submitter}_${frequencyMap[submission.submitter]}`;
    }

    frequencyMap[submission.submitter] = 1;
    return `${submission.submitter}_1`;
  }

  public setDisplayScoreType(type: "META" | "JACCARD" | "SEMANTIC") {
    this.displayScoreType = type;
    this.documentSeries = null;
  }

  public setDocumentsLimit(limit: number) {
    this.documentsLimit = limit;
  }
}
