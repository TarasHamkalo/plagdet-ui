import {Injectable} from "@angular/core";
import {Submission} from "../model/submission";
import {SubmissionPair} from "../model/submission-pair";
import {SubmissionPairUtils} from "../utils/submission-pair-utils";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {DocumentSeriesPage} from "../types/document-series-page";
import {PlagScore} from "../model/plag-score";
import {ExportService} from "./export.service";
import {SubmissionLabelingService} from "./submission-labeling.service";

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

  private displayedSubmissions: Submission[] = [];

  private submissionsMap = new Map<number, Submission>();

  private pairsMap = new Map<string, SubmissionPair>();

  constructor(
    private submissionLabelingService: SubmissionLabelingService,
    private exportService: ExportService
  ) {
  }

  public setSubmissionsMap(submissionsMap: Map<number, Submission>): void {
    this.submissionsMap = submissionsMap;
    this.reset();
  }

  public setPairsMap(pairsMap: Map<string, SubmissionPair>): void {
    this.pairsMap = pairsMap;
    this.reset();
  }

  private initDocumentSeries(): boolean {
    if (this.documentSeries !== null) {
      return true;
    }

    // const report = this.analysisContextService.getReport()();
    if (this.submissionsMap.size == 0 || this.pairsMap.size == 0) {
      this.documentSeries = null;
      return false;
    }

    const submissions = this.submissionsMap.values();
    const pairs = this.pairsMap;
    this.displayedSubmissions = Array.from(submissions)
      // !s.indexed
      .filter(s => this.getTypedSimilarity(s, pairs, this.submissionsMap))
      .sort((a, b) => a.fileData.submitter.localeCompare(b.fileData.submitter));

    const series = [];
    for (const submission of this.displayedSubmissions) {
      this.duplicateCategories = {};
      series.push({
        name: this.getDataPointCategory(submission, this.duplicateSeries),
        data: this.displayedSubmissions.map(other => this.getDataPoint(submission, other, pairs))
      });
    }

    this.documentSeries = series.reverse();
    return true;
  }

  private getTypedSimilarity(
    s: Submission,
    pairs: Map<string, SubmissionPair>,
    submissionsMap: Map<number, Submission>
  ): PlagScore | undefined {
    return s.pairIds
      .map(pId => pairs.get(pId))
      .filter(p => p !== undefined)// was  && !SubmissionPairUtils.hasIndexedSubmission(p!, submissionsMap)
      .map(p => SubmissionPairUtils.getScoreByType(p!, this.displayScoreType))
      .find(p => p !== null);
  }

  public getSubmissionPairIdByDatapoint(
    seriesIndex: number,
    dataPointIndex: number
  ): string | null {
    // const pairs = this.analysisContextService.getReport()()?.pairs;
    if (this.pairsMap.size == 0) {
      return null;
    }


    const dispLength = this.displayedSubmissions.length;

    const firstIndex = dispLength - 1 - (seriesIndex + this.previousPage!.y);
    const secondIndex = dataPointIndex + this.previousPage!.x;

    if (firstIndex == secondIndex) {
      return null;
    }

    const first = this.displayedSubmissions.at(firstIndex)!;
    const second = this.displayedSubmissions.at(secondIndex)!;
    const pair = this.pairsMap.get(`${first.id}_${second.id}`) ||
      this.pairsMap.get(`${second.id}_${first.id}`);

    return pair ? pair.id : null;
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
    if (this.initDocumentSeries() && this.documentSeries?.length != 0) {
      return Math.max(0, this.documentSeries![0].data.length - this.documentsLimit);
    }
    return -1;
  }

  private getDataPoint(target: Submission, other: Submission, pairs: Map<string, SubmissionPair>) {
    if (target.id === other.id) {
      return {
        x: this.getDataPointCategory(other, this.duplicateCategories),
        y: SubmissionPairUtils.formatScore(1, 1)
      };
    }

    const key1 = `${target.id}_${other.id}`;
    const key2 = `${other.id}_${target.id}`;
    const pair = pairs.get(key1) || pairs.get(key2);
    const score = pair ?
      SubmissionPairUtils.getFormattedScore(pair, this.displayScoreType, 1) :
      SubmissionPairUtils.formatScore(0, 1);

    return {x: this.getDataPointCategory(other, this.duplicateCategories), y: score};
  }

  private getDataPointCategory(
    submission: Submission,
    frequencyMap: Record<string, number>
  ): string {
    return this.submissionLabelingService.getSubmissionLabel(submission, frequencyMap, 20);
  }

  public getDisplayScoreType() {
    return this.displayScoreType;
  }

  public setDisplayScoreType(type: "META" | "JACCARD" | "SEMANTIC") {
    this.displayScoreType = type;
    this.reset();
  }

  private reset() {
    this.documentSeries = null;
    this.previousPage = null;
    this.duplicateSeries = {};
  }

  public setDocumentsLimit(limit: number) {
    this.documentsLimit = limit;
  }

  public export() {
    if (this.documentSeries != null) {
      this.exportService.exportHeatmapToCsv(this.documentSeries, Date.now().toFixed(0));
    }
  }

  public hasDataToDisplay() {
    return this.initDocumentSeries() && this.documentSeries?.length != 0;
  }

}
