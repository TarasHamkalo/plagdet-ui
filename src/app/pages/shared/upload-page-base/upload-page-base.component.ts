import {Directive, inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {
  FileUploadConfirmationComponent
} from "../../../components/files/file-upload-confirmation/file-upload-confirmation.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {FileUtilsService} from "../../../services/file-utils.service";
import {FileWrapper} from "../../../types/file-wrapper";

@Directive()
export abstract class UploadPageBaseComponent {

  private dialog: MatDialog = inject(MatDialog);

  constructor(
    protected analysisContext: AnalysisContextService,
    private fileUtils: FileUtilsService,
    private router: Router
  ) {
  }

  protected onFileUploaded(
    file: File,
    successRoute: string,
    failureRoute?: string,
    onSuccess?: (fileWrapper: FileWrapper) => void
  ): void {
    const fileWrapper = this.fileUtils.createWrapper(file);

    const dialogRef = this.dialog.open(FileUploadConfirmationComponent, {
      data: {fileWrapper},
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.analysisContext.setSubmittedFile(fileWrapper);
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
