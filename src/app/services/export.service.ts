import {Injectable} from "@angular/core";
import {Submission} from "../model/submission";
import {TimeFormatting} from "../utils/time-formatting";

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
