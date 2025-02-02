import {Component, OnInit} from "@angular/core";
import {
  FileUploadDndComponent
} from "../../components/files/file-upload-dnd/file-upload-dnd.component";
import {PageRoutes} from "../../app.routes";
import {UploadPageBaseComponent} from "../shared/upload-page-base/upload-page-base.component";
import {FormsModule} from "@angular/forms";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";

@Component({
  selector: "app-upload-dataset-page",
  standalone: true,
  imports: [
    FileUploadDndComponent,
    FormsModule,
    SurfaceComponent,
    ContentContainerComponent,

  ],
  templateUrl: "./upload-dataset-page.component.html",
})
export class UploadDatasetPageComponent extends UploadPageBaseComponent implements OnInit {

  public ngOnInit(): void {
    this.analysisContext.clearContext();
  }

  protected override onFileUploaded(file: File): void {
    super.onFileUploaded(file, PageRoutes.CONFIGURATION, PageRoutes.UPLOAD);
  }

}

