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

  analyze(): void {
    const analyzedFile = this.analysisContext.getUploadedFile()().name ?? "Unknown";
    this.analysisContext.getAnalysis().set({
      name: this.analysisContext.getAnalysisName()(),
      analyzedFileName: analyzedFile,
      dateAnalyzed: new Date(Date.now()),
      numberOfComparisons: 100500,
      docFiles: 71,
      docxFiles: 67,
      pdfFiles: 51,
      configurationUsed: this.analysisContext.getConfigurationOptions()()
    });
  }
}
