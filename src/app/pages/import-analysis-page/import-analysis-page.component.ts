import {Component} from "@angular/core";
import {
  FileUploadDndComponent
} from "../../components/files/file-upload-dnd/file-upload-dnd.component";
import {UploadPageBaseComponent} from "../shared/upload-page-base/upload-page-base.component";
import {PageRoutes} from "../../app.routes";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";

@Component({
  selector: "app-import-overview-page",
  imports: [
    FileUploadDndComponent,
    SurfaceComponent,
    ContentContainerComponent,
  ],
  templateUrl: "./import-analysis-page.component.html",
})
export class ImportAnalysisPageComponent extends UploadPageBaseComponent {

  public supportedExtensions: Set<string> = new Set<string>(["zip"]);

  public subtitle = "Povolený formát je ZIP";

  protected override onFileUploaded(file: File) {
    super.onFileUploaded(
      file,
      PageRoutes.ANALYSIS,
      PageRoutes.IMPORT,
      () => this.analysisContext.setAnalysisImported(true)
    );
  }

}
