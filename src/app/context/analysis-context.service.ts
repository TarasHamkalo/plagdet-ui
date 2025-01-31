import {Injectable, signal} from "@angular/core";
import {FileWrapper} from "../types/file-wrapper";
import {Report} from "../model/report";

@Injectable({
  providedIn: "root"
})
export class AnalysisContextService {

  private submittedFile = signal<FileWrapper | null>(null);

  private report = signal<Report | null>(null);

  private analysisImported = signal<boolean>(false);

  public setSubmittedFile(file: FileWrapper) {
    this.submittedFile.set(file);
  }

  public getSubmittedFile() {
    return this.submittedFile.asReadonly();
  }

  public setReport(report: Report) {
    return this.report.set(report);
  }

  public getReport() {
    return this.report.asReadonly();
  }

  public getAnalysisImported() {
    return this.analysisImported.asReadonly();
  }

  public setAnalysisImported(imported: boolean) {
    return this.analysisImported.set(imported);
  }

  public clearContext() {
    this.submittedFile.set(null);
    this.report.set(null);
    this.analysisImported.set(false);
  }
}
