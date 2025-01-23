import {Injectable} from "@angular/core";
import {AnalysisContextService} from "../context/analysis-context.service";
import {FileUtilsService} from "./file-utils.service";
import {Observable, of} from "rxjs";
import {AnalysisReport} from "../model/analysisReport";

@Injectable({
  providedIn: "root"
})
export class AnalysisService {

  constructor(private analysisContext: AnalysisContextService,
              private fileUtils: FileUtilsService) {}

  analyze(): void {
    // const analyzedFile = this.analysisContext.getUploadedFile()().name ?? "Unknown";
    // this.analysisContext.getAnalysis().set({
    //   name: this.analysisContext.getAnalysisName()(),
    //   analyzedFileName: analyzedFile,
    //   dateAnalyzed: new Date(Date.now()),
    //   numberOfComparisons: 100500,
    //   docFiles: 71,
    //   docxFiles: 67,
    //   pdfFiles: 51,
    //   configurationUsed: this.analysisContext.getConfigurationOptions()()
    // });
  }

  loadReport(): Observable<AnalysisReport | null> {
    if (this.analysisContext.getAnalysisImported()) {
      return this.loadFromUploadedZip();
    }
    console.log("else"); //TODO: implement
    return of(null);
  }

  loadFromUploadedZip() {
    return this.fileUtils.readReportFromZip(
      this.analysisContext.getUploadedFile()().file!
    );
  }

}
