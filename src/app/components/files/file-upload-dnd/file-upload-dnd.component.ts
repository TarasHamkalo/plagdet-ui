import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {DndDirective} from "../../../directives/dnd.directive";
import {FileUtilsService} from "../../../services/file-utils.service";

@Component({
  selector: "app-file-upload-dnd",
  imports: [
    MatButton,
    DndDirective,
  ],
  templateUrl: "./file-upload-dnd.component.html",
  styleUrl: "./file-upload-dnd.component.css"
})
export class FileUploadDndComponent {

  @Input() public title = "Vyberte súbor alebo ho sem vložte";

  @Input() public subtitle = "Povolené formáty ZIP, TAR or TARGZ";

  @Input() public buttonText = "Vyberte súbor";

  @Input() public supportedExtensions: Set<string> = new Set<string>(["tar", "zip", "targz"]);

  @Output() public fileUploaded: EventEmitter<File> = new EventEmitter<File>();

  constructor(private fileUtils: FileUtilsService) {}

  public onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    }
  }

  public onFileDrop(event: DragEvent): void {
    if (event.dataTransfer) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  private processFiles(files: FileList): void {
    if (files.length > 1) {
      
      return;
    }

    const file = files[0];
    if (this.fileUtils.hasValidExtension(file, this.supportedExtensions)) {
      this.fileUploaded.emit(file);
    }
  }

}
