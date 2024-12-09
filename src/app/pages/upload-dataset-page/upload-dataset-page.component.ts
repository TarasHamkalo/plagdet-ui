import {Component, inject} from "@angular/core";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {FileUploadDndComponent} from "../../components/file-upload-dnd/file-upload-dnd.component";
import {AnalysisContextService} from "../../services/analysis-context.service";
import {MatDialog} from "@angular/material/dialog";
import {
  FileUploadConfirmationComponent
} from "../../components/file-upload-confirmation/file-upload-confirmation.component";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {FileUtilsService} from "../../services/file-utils.service";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: "app-upload-dataset-page",
  standalone: true,
  imports: [
    TitledSurfaceComponent,
    FileUploadDndComponent,
    MatButton,
  ],
  templateUrl: "./upload-dataset-page.component.html",
  styleUrl: "./upload-dataset-page.component.css"
})
export class UploadDatasetPageComponent {

  private dialog: MatDialog = inject(MatDialog);

  constructor(private analysisContext: AnalysisContextService,
              private fileUtils: FileUtilsService,
              private router: Router,
              private navigationService: NavigationService) {}

  onFileUploaded(file: File): void {

    const fileWrapper = this.fileUtils.createWrapper(file);

    const dialogRef = this.dialog.open(FileUploadConfirmationComponent, {
      data: {
        fileWrapper: fileWrapper,
      }
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.analysisContext.setUploadedFile(fileWrapper);
        // navigate to another page
        this.router.navigate(["/configuration"]);
      }
    });
  }

  moveToConfigPage(): void {
    // this.router.navigate(['/configuration']);
    this.navigationService.getRoutes();
  }
}
