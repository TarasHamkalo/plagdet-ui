import {Injectable, signal, WritableSignal} from '@angular/core';
import {FileWrapper} from "../model/file-wrapper.type";

@Injectable({
  providedIn: 'root'
})
export class AnalysisContextService {

  private uploadedFile = signal<Partial<FileWrapper>>({})

  constructor() {}

  setUploadedFile(file: Partial<FileWrapper>) {
    this.uploadedFile.set(file)
  }

  getUploadedFile() {
    return this.uploadedFile;
  }

}
