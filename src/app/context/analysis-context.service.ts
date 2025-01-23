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

  private report = signal<Partial<AnalysisReport>>({});

  constructor(private http: HttpClient,
              private fileUtils: FileUtilsService) {
    // this.setUploadedFile(this.fileUtils.mockWrapper());
  }

  setUploadedFile(file: Partial<FileWrapper>) {
    this.uploadedFile.set(file);
    this.analysisName.set(file.name ?? "");
    this.fileUtils.readReportFromZip(file.file!).subscribe(report => {
      console.log("report is ", report);
      if (report != null) {
        console.log(report);
        this.report.set(report);
      }
    });
  }

  getUploadedFile() {
    return this.uploadedFile;
  }

  getAnalysisName() {
    return this.analysisName;
  }

  getAnalysis() {
    return this.analysis;
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
}
