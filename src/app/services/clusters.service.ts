import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Cluster} from "../model/cluster";

@Injectable({
  providedIn: 'root'
})
export class ClustersService {

  getClusters(): Observable<Cluster[]> {
    return of([
      {name: 'Bravo', avgSimilarity: 97, avgEditTime: 11, numberOfSubmissions: 3},
      {name: 'Charlie', avgSimilarity: 77, avgEditTime: 12, numberOfSubmissions: 3},
      {name: 'Albatros', avgSimilarity: 67, avgEditTime: 15.5, numberOfSubmissions: 7},
    ]);
  }

}
