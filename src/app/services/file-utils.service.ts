import {Injectable} from "@angular/core";
import {FileWrapper} from "../types/file-wrapper";
import {forkJoin, from, map, mergeMap, Observable, of} from "rxjs";
import {Report} from "../model/report";
import JSZip from "jszip";
import {Submission} from "../model/submission";
import {SubmissionPair} from "../model/submission-pair";
import {Overview} from "../model/overview";

@Injectable({
  providedIn: "root"
})
export class FileUtilsService {

  public readonly SUPPORTED_EXTENSIONS = new Set(["zip"]);

  public readonly OVERVIEW_FILEPATH = "overview.json";

  public readonly FILES_DIR_PATH = "files";

  public readonly PAIRS_DIR_PATH = "pairs";

  public readonly mimeToExtension: Record<string, string> = {
    "application/zip": "zip",
    "application/x-zip-compressed": "zip",
    "application/x-rar-compressed": "rar",
  };

  public hasValidExtension(file: File, supportedExtensions: Set<string>): boolean {
    if (!file) {
      return false;
    }

    const ext = this.getNormalizedExtension(file);
    return supportedExtensions.has(ext);
  }

  public getNormalizedExtension(file: File): string {
    const mimeType = file.type || "";
    return this.mimeToExtension[mimeType] || "";
  }

  public createWrapper(file: File): FileWrapper {
    return {
      file: file,
      name: file.name,
      extension: this.getNormalizedExtension(file),
      dateModified: new Date(file.lastModified),
    };
  }


  public readReportFromZip(file: File): Observable<Report | null> {
    if (!this.hasValidExtension(file, this.SUPPORTED_EXTENSIONS)) {
      return of(null);
    }

    return from(JSZip.loadAsync(file)).pipe(
      mergeMap((zip) => {
        const fileNames = Object.keys(zip.files);
        
        const overviewEntry =
          zip.files[this.OVERVIEW_FILEPATH] || zip.files["/" + this.OVERVIEW_FILEPATH];

        const overviewReadTask = from(overviewEntry.async("string")).pipe(
          map((content) => JSON.parse(content) as Overview)
        );
        const submissionsReadTasks: Observable<Submission>[] =
          this.getSubmissionsReadTasks(fileNames, zip);
        const pairReadTasks: Observable<SubmissionPair>[] =
          this.getPairReadTasks(fileNames, zip);
        return forkJoin({
          overview: overviewReadTask,
          submissions: submissionsReadTasks.length > 0 ? forkJoin(submissionsReadTasks).pipe(
            map((submissions) => {
              const submissionsMap = new Map<number, Submission>();
              submissions.forEach((submission) => {
                submissionsMap.set(submission.id, submission);
              });
              return submissionsMap;
            })
          ) : of(new Map<number, Submission>()),
          pairs: pairReadTasks.length > 0 ? forkJoin(pairReadTasks).pipe(
            map((pairs) => {
              const pairsMap = new Map<string, SubmissionPair>();
              pairs.forEach((pair) => {
                pairsMap.set(pair.id, pair);
              });
              return pairsMap;
            })
          ) : of(new Map<number, SubmissionPair>())
        });
      })
    ) as Observable<Report | null>;
  }

  private getPairReadTasks(fileNames: string[], zip: JSZip) {
    return fileNames
      .filter(path => this.isWithinDirectory(path, this.PAIRS_DIR_PATH) && path.endsWith(".json"))
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
      .filter(path => this.isWithinDirectory(path, this.FILES_DIR_PATH) && path.endsWith("_meta.json"))
      .map((path) => {
        return from(zip.files[path].async("string"))
          .pipe(
            mergeMap((submissionJson: string) => {
              const paths = path.split("/");
              const fileParent = paths[paths.length - 2]!;
              // 
              const submission: Submission = JSON.parse(submissionJson);
              const contentPath = `${this.FILES_DIR_PATH}/${fileParent}/${submission.id}_content.txt`;
              const contentEntry = zip.files[contentPath] || zip.files["/" + contentPath];
              if (contentEntry) {
                return from(contentEntry.async("string"))
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

  private isWithinDirectory(path: string, dirName: string) {
    return path.startsWith(dirName) || path.startsWith("/" + dirName);
  }
}
