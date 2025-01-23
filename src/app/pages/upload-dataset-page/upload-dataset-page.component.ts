import {Component} from "@angular/core";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {FileUploadDndComponent} from "../../components/file-upload-dnd/file-upload-dnd.component";
import {PageRoutes} from "../../app.routes";
import {UploadPageBaseComponent} from "../shared/upload-page-base/upload-page-base.component";

@Component({
  selector: "app-upload-dataset-page",
  standalone: true,
  imports: [
    TitledSurfaceComponent,
    FileUploadDndComponent,

  ],
  templateUrl: "./upload-dataset-page.component.html",
})
export class UploadDatasetPageComponent extends UploadPageBaseComponent {

  override onFileUploaded(file: File): void {
    super.onFileUploaded(file, PageRoutes.CONFIGURATION, PageRoutes.UPLOAD);
  }

}

