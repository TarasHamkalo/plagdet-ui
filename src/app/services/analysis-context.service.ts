import {Injectable, signal} from '@angular/core';
import {FileWrapper} from "../model/file-wrapper.type";
import {ConfigurationOption} from "../model/configuration-option";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AnalysisContextService {

  private uploadedFile = signal<Partial<FileWrapper>>({})

  private configurationOptions: ConfigurationOption[] = [];

  constructor(private http: HttpClient) {
  }

  setUploadedFile(file: Partial<FileWrapper>) {
    this.uploadedFile.set(file)
  }

  getUploadedFile() {
    return this.uploadedFile;
  }

  loadConfigurationOptions() {
    return this.http
      .get<ConfigurationOption[]>('./assets/configuration-options.json')
      .subscribe((options) => {
        this.configurationOptions = options;
      });
  }

  getConfigurationOptions() {
    console.log(this.configurationOptions);
    return this.configurationOptions;
  }
}
