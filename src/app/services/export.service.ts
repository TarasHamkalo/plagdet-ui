import {Injectable} from "@angular/core";
import {Submission} from "../model/submission";
import {TimeFormatting} from "../utils/time-formatting";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {SubmissionPair} from "../model/submission-pair";
import {AnalysisContextService} from "../context/analysis-context.service";
import {SubmissionPairUtils} from "../utils/submission-pair-utils";

@Injectable({
  providedIn: "root"
})
export class ExportService {

  public readonly typeToHeader: Record<string, string[]> = {
    "submission": [
      "Odosielateľ", "Názov súboru", "Cesta k súboru", "Autor", "Dátum vytvorenia", "Naposledy upravil",
      "Dátum úpravy", "Čas úpravy", "Počet revízií", "Naposledy vytlačené"
    ],
    "plagSource": [
      "Odosielateľ", "Názov súboru", "Cesta k súboru", "Autor", "Dátum vytvorenia", "Naposledy upravil",
      "Dátum úpravy", "Čas úpravy", "Počet revízií", "Naposledy vytlačené",
      "Zhoda metaúdajov", "Jaccardov koeficient (slovné n-gramy)", "Semantická podobnosť"
    ]

  };

  constructor(private analysisContextService: AnalysisContextService) {
  }


  public exportHeatmapToCsv(data: ApexAxisChartSeries, filename: string): void {
    const csvContent = this.getSeriesRows(data);
    const csvHeader = ["submitter", ...data.map(s => s.name)];
    const csv = [csvHeader, ...csvContent]
      .map(row => row.join(", "))
      .join("\n");
    this.createFile(csv, filename);
  }

  public exportSubmissionToCsv(data: Submission[], filename: string): void {
    const csvContent = this.getSubmissionRows(data);
    const csv = [this.typeToHeader["submission"], ...csvContent]
      .map(row => row.join(", "))
      .join("\n");

    this.createFile(csv, filename);
  }

  private createFile(csv: string, filename: string): void {
    const blob = new Blob([csv], {type: "text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  private getSubmissionRows(data: Submission[]): (string | number) [][] {
    return data.map(s => [
      this.escapeString(s.fileData.submitter),
      this.escapeString(s.fileData.filename),
      this.escapeString(s.fileData.persistentPath),
      this.escapeString(s.fileData.metadata.creator),
      s.fileData.metadata.creationDate ? TimeFormatting.mapUnixTimeToDate(s.fileData.metadata.creationDate) : "",
      this.escapeString(s.fileData.metadata.modifier),
      s.fileData.metadata.modificationDate ? TimeFormatting.mapUnixTimeToDate(s.fileData.metadata.modificationDate) : "",
      TimeFormatting.mapToSecondsToHhMmSs(s.fileData.metadata.totalEditTime),
      s.fileData.metadata.revisionsNumber,
      s.fileData.metadata.lastPrinted ? TimeFormatting.mapUnixTimeToDate(s.fileData.metadata.lastPrinted) : ""
    ]);
  }

  private getPlagSourceRow(s: Submission, submissionPair: SubmissionPair | null): (string | number)[] {
    return [
      this.escapeString(s.fileData.submitter),
      this.escapeString(s.fileData.filename),
      this.escapeString(s.fileData.persistentPath),
      this.escapeString(s.fileData.metadata.creator),
      s.fileData.metadata.creationDate ? TimeFormatting.mapUnixTimeToDate(s.fileData.metadata.creationDate) : "",
      this.escapeString(s.fileData.metadata.modifier),
      s.fileData.metadata.modificationDate ? TimeFormatting.mapUnixTimeToDate(s.fileData.metadata.modificationDate) : "",
      TimeFormatting.mapToSecondsToHhMmSs(s.fileData.metadata.totalEditTime),
      s.fileData.metadata.revisionsNumber,
      s.fileData.metadata.lastPrinted ? TimeFormatting.mapUnixTimeToDate(s.fileData.metadata.lastPrinted) : "",
      submissionPair ? SubmissionPairUtils.getFormattedScore(submissionPair, "META") : SubmissionPairUtils.formatScore(0),
      submissionPair ? SubmissionPairUtils.getFormattedScore(submissionPair, "JACCARD") : SubmissionPairUtils.formatScore(0),
      submissionPair ? SubmissionPairUtils.getFormattedScore(submissionPair, "SEMANTIC") : SubmissionPairUtils.formatScore(0)
    ];
  }

  private getSeriesRows(data: ApexAxisChartSeries) {
    return data.map(s => [
      s.name,
      ...(s.data as { x: string; y: string }[]).map(d => d.y)
    ]);
  }

  private escapeString(value: string | undefined): string {
    if (!value) {
      return "";
    }

    if (value.includes(",")) {
      return `"${value}"`;
    }

    return value;
  }

  public exportPlagSources(
    submission: Submission,
    semanticSubmissionPair: SubmissionPair | null,
    jaccardSubmissionPair: SubmissionPair | null,
    metaSubmissionPair: SubmissionPair | null,
    filename: string
  ): void {
    const report = this.analysisContextService.getReport()();
    if (!report) {
      return;
    }

    const submissions = report.submissions;
    const rows: (string | number)[][] = [];
    rows.push(this.typeToHeader["plagSource"]);

    rows.push([]);
    rows.push(["Podozrivý dokument"]);
    rows.push(this.getSubmissionRows([submission])[0]);
    const metaSub = this.getSourceSubmission(submission, metaSubmissionPair, submissions);

    this.pushSourceSubmission(
      rows, metaSub, metaSubmissionPair, "Zadanie s rovnakým autorstvom podľa metaúdajov"
    );
    const jaccardSub = this.getSourceSubmission(
      submission, jaccardSubmissionPair, submissions
    );
    this.pushSourceSubmission(
      rows, jaccardSub, jaccardSubmissionPair, "Najvyššia podobnosť zistená Jaccardovým koeficientom"
    );
    const semanticSub = this.getSourceSubmission(
      submission, semanticSubmissionPair, submissions
    );
    this.pushSourceSubmission(
      rows, semanticSub, semanticSubmissionPair, "Najväčšia podobnosť zistená pomocou sémantického porovnania"
    );
    const csv = rows.map(row => row.join(", ")).join("\n");
    this.createFile(csv, filename);
  }

  private pushSourceSubmission(
    rows: (string | number)[][],
    submission: Submission | null,
    submissionPair: SubmissionPair | null,
    title: string,
    notFoundText = "Nenájdený"
  ) {
    rows.push([]);
    rows.push([title]);
    rows.push(submission ? this.getPlagSourceRow(submission, submissionPair) : [notFoundText]);
  }

  public getSourceSubmission(
    submission: Submission,
    pair: SubmissionPair | null,
    submissions: Map<number, Submission>
  ): Submission | null {
    if (!pair) {
      return null;
    }
    const otherId = submission.id === pair.firstId ? pair.secondId : pair.firstId;
    return submissions.get(otherId) || null;
  }

  public exportPair(submissionPair: SubmissionPair, filename: string) {
    const report = this.analysisContextService.getReport()();
    if (!report) {
      return;
    }

    const submissions = report.submissions;
    const rows: (string | number)[][] = [];
    rows.push(this.typeToHeader["plagSource"]);

    const firstSubmission = submissions.get(submissionPair.firstId);
    const secondSubmission = submissions.get(submissionPair.secondId);
    rows.push(
      firstSubmission ? this.getPlagSourceRow(firstSubmission, submissionPair) : ["Nenájdený"]
    );
    rows.push(
      secondSubmission ? this.getPlagSourceRow(secondSubmission, submissionPair) : ["Nenájdený"]
    );

    const csv = rows.map(row => row.join(", ")).join("\n");
    this.createFile(csv, filename);
  }
}
