import {Injectable} from "@angular/core";
import {FileWrapper} from "../model/file-wrapper";
import {forkJoin, from, map, mergeMap, Observable, of} from "rxjs";
import {AnalysisReport} from "../model/analysisReport";
import JSZip from "jszip";
import {Submission} from "../model/submission";
import {SubmissionPair} from "../model/submission-pair";
import {Analysis} from "../model/analysis";

@Injectable({
  providedIn: "root"
})
export class FileUtilsService {

  public readonly SUPPORTED_EXTENSIONS = new Set(["zip"]);

  public readonly OVERVIEW_FILEPATH = "/overview.json";

  public readonly FILES_DIR_PATH = "/files";

  public readonly PAIRS_DIR_PATH = "/pairs";

  public readonly mimeToExtension: Record<string, string> = {
    "application/zip": "zip",
    "application/x-zip-compressed": "zip",
    "application/x-rar-compressed": "rar",
  };

  public hasValidExtension(file: File, supportedExtensions: Set<string>): boolean {
    if (!file) {
      return false;
    }

    const ext = this.getFileExtension(file);
    return supportedExtensions.has(ext);
  }

  public getNormalizedExtension(file: File): string {
    const mimeType = file.type || "";
    return this.mimeToExtension[mimeType] || "";
  }

  public mockWrapper(): FileWrapper {
    const file = new File([""], "Submissions", {type: "text/zip"});
    return this.createWrapper(file);
  }

  public createWrapper(file: File): FileWrapper {
    // this.
    return {
      file: file,
      name: file.name,
      extension: this.getFileExtension(file),
      filesContained: Math.trunc(file.size / 50000),
      dateModified: new Date(file.lastModified),
    };
  }

  private getFileExtension(file: File) {
    return this.getNormalizedExtension(file);
    // return file.type.split("/")[1];
  }

  public readReportFromZip(file: File): Observable<AnalysisReport | null> {
    if (!this.hasValidExtension(file, this.SUPPORTED_EXTENSIONS)) {
      return of(null);
    }

    return from(JSZip.loadAsync(file)).pipe(
      mergeMap((zip) => {
        const fileNames = Object.keys(zip.files);
        console.log("Loaded zip ", fileNames);
        const analysisTask = from(zip.files[this.OVERVIEW_FILEPATH].async("string")).pipe(
          map((content) => JSON.parse(content) as Analysis)
        );
        const submissionsReadTasks: Observable<Submission>[] = this.getSubmissionsReadTasks(fileNames, zip);
        const pairReadTasks: Observable<SubmissionPair>[] = this.getPairReadTasks(fileNames, zip);
        return forkJoin({
          analysis: analysisTask,
          submissions: forkJoin(submissionsReadTasks).pipe(
            map((submissions) => {
              console.log(submissions);
              const submissionsMap = new Map<number, Submission>();
              submissions.forEach((submission) => {
                submissionsMap.set(submission.id, submission);
              });
              return submissionsMap;
            })
          ),
          pairs: forkJoin(pairReadTasks).pipe(
            map((pairs) => {
              const pairsMap = new Map<string, SubmissionPair>();
              pairs.forEach((pair) => {
                pairsMap.set(pair.id, pair);
              });
              return pairsMap;
            })
          )
        });
      })
    ) as Observable<AnalysisReport | null>;
  }

  private getPairReadTasks(fileNames: string[], zip: JSZip) {
    return fileNames
      .filter(path => path.startsWith(this.PAIRS_DIR_PATH))
      .map(path => {
        return from(zip.files[path].async("string"))
          .pipe(
            mergeMap((pairJson) => {
              const pair: SubmissionPair = JSON.parse(pairJson);
              return of(pair);
            })
          );
      });
  }

  private getSubmissionsReadTasks(fileNames: string[], zip: JSZip) {
    return fileNames
      .filter(path => path.startsWith(this.FILES_DIR_PATH) && path.endsWith("_meta.json"))
      .map((path) => {
        return from(zip.files[path].async("string"))
          .pipe(
            mergeMap((submissionJson: string) => {
              const paths = path.split("/");
              const fileParent = paths[2]!;
              const submission: Submission = JSON.parse(submissionJson);
              const contentPath = `${this.FILES_DIR_PATH}/${fileParent}/${submission.id}_content.txt`;
              if (zip.files[contentPath]) {
                return from(zip.files[contentPath].async("string"))
                  .pipe(
                    map((content) => {
                      submission.content = content;
                      return submission;
                    })
                  );
              }
              return of(submission);
            })
          );
      });
  }
}
