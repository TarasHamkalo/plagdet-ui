import {Injectable} from "@angular/core";
import {Submission} from "../model/submission";
import {TimeFormatting} from "../utils/time-formatting";
import {ApexAxisChartSeries} from "ng-apexcharts";

@Injectable({
  providedIn: "root"
})
export class ExportService {

  public readonly typeToHeader: Record<string, string[]> = {
    "submission": [
      "Submitter", "Filename", "Filepath", "Creator", "Creation Date", "Modifier",
      "Modification Date", "Total Edit Time", "Revisions Number", "Last Printed"
    ]
  };


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
      this.escapeString(s.submitter),
      this.escapeString(s.filename),
      this.escapeString(s.filepath),
      this.escapeString(s.metadata.creator),
      s.metadata.creationDate ? TimeFormatting.mapUnixTimeToDate(s.metadata.creationDate) : "",
      this.escapeString(s.metadata.modifier),
      s.metadata.modificationDate ? TimeFormatting.mapUnixTimeToDate(s.metadata.modificationDate) : "",
      TimeFormatting.mapToSecondsToHhMmSs(s.metadata.totalEditTime),
      s.metadata.revisionsNumber,
      s.metadata.lastPrinted ? TimeFormatting.mapUnixTimeToDate(s.metadata.lastPrinted) : ""
    ]);

  }

  private getSeriesRows(data: ApexAxisChartSeries) {
    return data.map(s => [
      s.name,
      ...(s.data as {x: string; y: string}[]).map(d => d.y)
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
}
