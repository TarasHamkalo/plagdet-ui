import {Injectable} from "@angular/core";
import {Submission} from "../model/submission";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubmissionsService {
  // zip -> context -> загрузи з нього усі submissions ->

  getSubmissions(): Observable<Submission[]> {
    return of([]);
    //   {submitter: "Serhii", fileName: "dokumentacia.docx", maxSimilarity: 97, totalEditTime: 15},
    //   {submitter: "Taras", fileName: "dokumentacia.docx", maxSimilarity: 67, totalEditTime: 360},
    //   {submitter: "Vlad", fileName: "dokumentacia.docx", maxSimilarity: 77, totalEditTime: 160}
    // ]);
  }
}
