import {Injectable, signal} from "@angular/core";
import {FileWrapper} from "../model/file-wrapper";
import {ConfigurationOption} from "../model/mock/configuration-option";
import {HttpClient} from "@angular/common/http";
import {FileUtilsService} from "../services/file-utils.service";
import {Analysis} from "../model/analysis";
import {AnalysisReport} from "../model/analysisReport";

@Injectable({
  providedIn: "root"
})
export class AnalysisContextService {

  private uploadedFile = signal<Partial<FileWrapper>>({});

  private analysisName = signal("");

  private configurationOptions = signal<ConfigurationOption[]>([]);

  private analysis = signal<Partial<Analysis>>({});

  private report = signal<AnalysisReport | null>(null);

  private analysisImported = signal<boolean>(false);

  constructor(private http: HttpClient,
              private fileUtils: FileUtilsService) {
  }

  setUploadedFile(file: Partial<FileWrapper>) {
    this.uploadedFile.set(file);
    this.analysisName.set(file.name ?? "");
  }

  getReport() {
    return this.report;
  }

  getAnalysisImported() {
    return this.analysisImported;
  }

  getUploadedFile() {
    return this.uploadedFile;
  }

  getAnalysisName() {
    return this.analysisName;
  }

  loadConfigurationOptions() {
    return this.http
      .get<ConfigurationOption[]>("./assets/configuration-options.json")
      .subscribe((options) => {
        this.configurationOptions.set(options);
        // this.configurationOptions = options;
      });
  }

  getConfigurationOptions() {
    return this.configurationOptions;
  }

  clear() {
    this.uploadedFile.set({});
    this.analysisName.set("");
    this.configurationOptions.set([]);
    this.analysis.set({});
    this.report.set(null);
    this.analysisImported.set(false);
  }
}
