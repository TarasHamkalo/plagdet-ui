import {Injectable} from "@angular/core";
import {AnalysisContextService} from "../context/analysis-context.service";
import {FileUtilsService} from "./file-utils.service";
import {Observable, of} from "rxjs";
import {Report} from "../model/report";

@Injectable({
  providedIn: "root"
})
export class AnalysisService {

  constructor(
    private analysisContext: AnalysisContextService,
    private fileUtils: FileUtilsService
  ) {
  }

  public loadReport(): Observable<Report | null> {
    if (this.analysisContext.getReport()() != null) {
      return of(this.analysisContext.getReport()());
    }

    if (this.analysisContext.getAnalysisImported()) {
      return this.loadFromUploadedZip();
    }

    console.log("else"); //TODO: implement
    return of(null);
  }

  protected loadFromUploadedZip() {
    return this.fileUtils.readReportFromZip(
      this.analysisContext.getSubmittedFile()()!.file
    );
  }

}
