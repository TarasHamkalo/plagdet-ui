import {Component, OnInit} from "@angular/core";
import {
  FileUploadDndComponent
} from "../../components/files/file-upload-dnd/file-upload-dnd.component";
import {UploadPageBaseComponent} from "../shared/upload-page-base/upload-page-base.component";
import {PageRoutes} from "../../app.routes";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {FileUtilsService} from "../../services/file-utils.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../services/navigation/navigation.service";
import {RouteContextService} from "../../context/route-context.service";

@Component({
  selector: "app-import-analysis-page",
  imports: [
    FileUploadDndComponent,
    SurfaceComponent,
    ContentContainerComponent,
  ],
  templateUrl: "./import-analysis-page.component.html",
})
export class ImportAnalysisPageComponent extends UploadPageBaseComponent implements OnInit {

  public supportedExtensions: Set<string> = new Set<string>(["zip"]);

  public subtitle = "Povolený formát je ZIP";

  constructor(
    private navigationService: NavigationService,
    private routeContextService: RouteContextService,
    protected override analysisContext: AnalysisContextService,
    protected override fileUtils: FileUtilsService,
    protected override router: Router
  ) {
    super(analysisContext, fileUtils, router);
  }

  public ngOnInit() {
    this.analysisContext.clearContext();
    this.routeContextService.clear();
  }

  protected override onFileUploaded(file: File) {
    super.onFileUploaded(
      file,
      PageRoutes.ANALYSIS,
      PageRoutes.IMPORT,
      () => {
        this.navigationService.toggleNavigationLock(true);
        this.analysisContext.setAnalysisImported(true);
      }
    );
  }

}
