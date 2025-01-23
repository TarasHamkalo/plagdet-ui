import {Directive, inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {
  FileUploadConfirmationComponent
} from "../../../components/file-upload-confirmation/file-upload-confirmation.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {FileUtilsService} from "../../../services/file-utils.service";
import {FileWrapper} from "../../../model/file-wrapper";

@Directive()
export abstract class UploadPageBaseComponent {

  private dialog: MatDialog = inject(MatDialog);

  public constructor(protected analysisContext: AnalysisContextService,
                     private fileUtils: FileUtilsService,
                     private router: Router) {
  }

  onFileUploaded(file: File, successRoute: string,
                 failureRoute?: string,
                 onSuccess?: (fileWrapper: FileWrapper) => void): void {
    const fileWrapper = this.fileUtils.createWrapper(file);

    const dialogRef = this.dialog.open(FileUploadConfirmationComponent, {
      data: {fileWrapper},
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.analysisContext.setUploadedFile(fileWrapper);
        if (onSuccess) {
          onSuccess(fileWrapper);
        }

        this.router.navigate([successRoute]);
      } else if (failureRoute) {
        this.router.navigate([failureRoute]);
      }
    });
  }
}
