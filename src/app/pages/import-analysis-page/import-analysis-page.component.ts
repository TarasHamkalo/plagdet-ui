import {Component} from "@angular/core";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {FileUploadDndComponent} from "../../components/file-upload-dnd/file-upload-dnd.component";
import {UploadPageBaseComponent} from "../shared/upload-page-base/upload-page-base.component";
import {PageRoutes} from "../../app.routes";

@Component({
  selector: "app-import-analysis-page",
  imports: [
    TitledSurfaceComponent,
    FileUploadDndComponent,
  ],
  templateUrl: "./import-analysis-page.component.html",
})
export class ImportAnalysisPageComponent extends UploadPageBaseComponent {

  public supportedExtensions: Set<string> = new Set<string>(["zip"]);

  public subtitle = "Povolený formát je ANALYSIS";

  override onFileUploaded(file: File) {
    super.onFileUploaded(
      file,
      PageRoutes.ANALYSIS,
      PageRoutes.IMPORT,
      () => this.analysisContext.getAnalysisImported().set(true)
    );
  }

}
