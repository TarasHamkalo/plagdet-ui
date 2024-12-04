import { Component } from '@angular/core';
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {FileUploadDndComponent} from "../../components/file-upload-dnd/file-upload-dnd.component";

@Component({
  selector: 'app-upload-dataset',
  imports: [
    TitledSurfaceComponent,
    FileUploadDndComponent
  ],
  templateUrl: './upload-dataset.component.html',
  styleUrl: './upload-dataset.component.css'
})
export class UploadDatasetComponent {

}
