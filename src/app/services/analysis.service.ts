import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {Analysis} from "../model/analysis";
import {ConfigurationOption} from "../model/configuration-option";
import {AnalysisContextService} from "./analysis-context.service";

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(private analysisContext: AnalysisContextService) {}

  analyze(): Observable<Analysis> {
    const analyzedFile = this.analysisContext.getUploadedFile()().name ?? "Unknown";
    // this.analysisContext.getAnalysisName()()
    console.log(this.analysisContext.getConfigurationOptions()());
    return of({

      name: "Super name",
      analyzedFileName: analyzedFile,
      dateAnalyzed: new Date(Date.now()),
      numberOfComparisons: 100500,
      docFiles: 71,
      docxFiles: 67,
      pdfFiles: 51,
      configurationUsed: this.analysisContext.getConfigurationOptions()()
    })
  }
}
