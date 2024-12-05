import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {DndDirective} from "../../directives/dnd.directive";
import {AnalysisContextService} from "../../services/analysis-context.service";

@Component({
  selector: 'app-file-upload-dnd',
  imports: [
    MatButton,
    DndDirective,
  ],
  templateUrl: './file-upload-dnd.component.html',
  styleUrl: './file-upload-dnd.component.css'
})
export class FileUploadDndComponent {

  @Input() public title: string = 'Vyberte súbor alebo ho sem vložte';

  @Input() public subtitle: string = 'Povolené formáty ZIP, TAR or TARGZ';

  @Input() public buttonText: string = 'Vyberte súbor';

  @Input() public supportedExtensions: Set<string> = new Set<string>(['tar', 'zip', 'targz']);

  @Output() public fileUploaded: EventEmitter<File> = new EventEmitter<File>();

  public onFileSelect(event: any): void {
    if (event.target) {
      this.processFiles(event.target.files);
    }
  }

  public onFileDrop(event: DragEvent): void {
    if (event.dataTransfer) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  // TODO: probably should be moved to a service...
  private processFiles(files: FileList): void {
    if (files.length > 1) {
      console.log('Error number of files should be equal 1');
      return;
    }

    const file = files[0];
    if (this.hasValidExtension(file)) {
      this.fileUploaded.emit(file)
    }
  }

  private hasValidExtension(file: File): boolean {
    const ext = file.type.split('/')[1];
    return this.supportedExtensions.has(ext);
  }


}
