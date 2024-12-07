import {Injectable, signal} from '@angular/core';
import {Submission} from "../model/submission";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  private submissions = signal<Submission[]>([]);


  getSubmissions(): Observable<Submission[]> {
    return of([
      {submitter: 'Serhii', fileName: 'dokumentacia.docx', maxSimilarity: 0.97, totalEditTime: 15},
      {submitter: 'Taras', fileName: 'dokumentacia.docx', maxSimilarity: 0.67, totalEditTime: 360},
      {submitter: 'Vlad', fileName: 'dokumentacia.docx', maxSimilarity: 0.77, totalEditTime: 160}
    ]);
  }

  loadSubmissions() {
    this.submissions.set([
      {submitter: 'Serhii', fileName: 'dokumentacia.docx', maxSimilarity: 0.97, totalEditTime: 15},
      {submitter: 'Taras', fileName: 'dokumentacia.docx', maxSimilarity: 0.67, totalEditTime: 360},
      {submitter: 'Vlad', fileName: 'dokumentacia.docx', maxSimilarity: 0.77, totalEditTime: 160}
    ])
  }

}
