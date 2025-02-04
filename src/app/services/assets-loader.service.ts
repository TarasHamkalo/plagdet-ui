import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PlagdetConfiguration} from "../model/plagdet-configuration";
import {ConfigurationDescription} from "../types/configuration-description";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AssetsLoaderService {

  constructor(private http: HttpClient) { }

  public loadConfigurationDescription(): Observable<ConfigurationDescription[]> {
    return this.http.get<ConfigurationDescription[]>("./assets/configuration-descriptions.json");
  }
}
