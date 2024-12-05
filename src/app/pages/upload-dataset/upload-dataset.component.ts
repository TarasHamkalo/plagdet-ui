import {Component, inject} from '@angular/core';
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {FileUploadDndComponent} from "../../components/file-upload-dnd/file-upload-dnd.component";
import {AnalysisContextService} from "../../services/analysis-context.service";
import {MatDialog} from "@angular/material/dialog";
import {
  FileUploadConfirmationComponent
} from "../../components/file-upload-confirmation/file-upload-confirmation.component";
import {FileWrapper} from "../../model/file-wrapper.type";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-upload-dataset',
  standalone: true,
  imports: [
    TitledSurfaceComponent,
    FileUploadDndComponent,
    MatButton,
  ],
  templateUrl: './upload-dataset.component.html',
  styleUrl: './upload-dataset.component.css'
})
export class UploadDatasetComponent {

  private dialog: MatDialog = inject(MatDialog);

  constructor(private analysisContext: AnalysisContextService,
              private router: Router) {}

  onFileUploaded(file: File): void {
    // TODO: Move to service
    const fileWrapper: FileWrapper = {
      file: file,
      filesContained: Math.trunc(file.size / 5000),
      dateModified: new Date(file.lastModified),
    };

    const dialogRef = this.dialog.open(FileUploadConfirmationComponent, {
      data: {
        fileWrapper: fileWrapper,
      }
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.analysisContext.setUploadedFile(fileWrapper);
        // navigate to another page
        this.router.navigate(['/configuration'])
      }
    })
  }

  moveToConfigPage(): void {
    this.router.navigate(['/configuration'])
  }
}
