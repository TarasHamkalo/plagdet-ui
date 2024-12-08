import {Injectable, signal} from '@angular/core';
import {FileWrapper} from "../model/file-wrapper";
import {ConfigurationOption} from "../model/configuration-option";
import {HttpClient} from "@angular/common/http";
import {FileUtilsService} from "./file-utils.service";

@Injectable({
  providedIn: 'root'
})
export class AnalysisContextService {

  private uploadedFile = signal<Partial<FileWrapper>>({});

  private analysisName = signal('');

  private configurationOptions = signal<ConfigurationOption[]>([]);

  constructor(private http: HttpClient,
              private fileUtils: FileUtilsService) {
    this.setUploadedFile(this.fileUtils.mockWrapper());
  }

  setUploadedFile(file: Partial<FileWrapper>) {
    this.uploadedFile.set(file);
    this.analysisName.set(file.name ?? '');
  }

  getUploadedFile() {
    return this.uploadedFile;
  }

  getAnalysisName() {
    return this.analysisName;
  }

  loadConfigurationOptions() {
    return this.http
      .get<ConfigurationOption[]>('./assets/configuration-options.json')
      .subscribe((options) => {
        this.configurationOptions.set(options);
        // this.configurationOptions = options;
      });
  }

  getConfigurationOptions() {
    return this.configurationOptions;
  }
}
