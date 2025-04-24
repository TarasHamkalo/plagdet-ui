import {Injectable} from "@angular/core";
import {AnalysisContextService} from "../context/analysis-context.service";
import {FileUtilsService} from "./file-utils.service";
import {Observable, of, tap} from "rxjs";
import {Report} from "../model/report";
import {SubmissionPairUtils} from "../utils/submission-pair-utils";

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
      return this.loadFromUploadedZip()
        .pipe(
          tap((report: Report | null) => {
            if (report) {
              this.assignComparisonsToIndexedSubmissions(report);
              this.calculateMaxSimilarities(report);
            }
          })
        );
    }

    return of(null);
  }

  protected loadFromUploadedZip() {
    return this.fileUtils.readReportFromZip(
      this.analysisContext.getSubmittedFile()()!.file
    );
  }

  public assignComparisonsToIndexedSubmissions(report: Report) {
    if (report) {
      const pairs = Array.from(report.pairs.values());
      pairs.forEach(p => {
        const submission = report.submissions.get(p.secondId);
        if (submission && submission.indexed) {
          submission.pairIds.push(p.id);
        }
      });
    }
  }

  public calculateMaxSimilarities(report: Report) {
    if (report != null) {
      const submissions = Array.from(report.submissions.values());
      const pairs = report.pairs;
      submissions
        .filter(s => !s.indexed)
        .forEach(s => {
          s.maxSimilarity = Math.max(
            ...s.pairIds
              .map((pId) => pairs.get(pId))
              .map(p => {
                const jaccardScore = SubmissionPairUtils.getScoreByType(p, "JACCARD");
                const semScore = SubmissionPairUtils.getScoreByType(p, "SEMANTIC");
                return Math.max(jaccardScore?.score ?? 0, semScore?.score ?? 0);
              })
          );
        });
    }
  }

}