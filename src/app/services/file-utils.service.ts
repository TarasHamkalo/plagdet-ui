import {Injectable} from '@angular/core';
import {FileWrapper} from "../model/file-wrapper.type";

@Injectable({
  providedIn: 'root'
})
export class FileUtilsService {

  public hasValidExtension(file: File, supportedExtensions: Set<string>): boolean {
    if (!file) {
      return false;
    }

    const ext = this.getFileExtension(file);
    return supportedExtensions.has(ext);
  }

  public mockWrapper(): FileWrapper {
    const file = new File([""], "Submissions", { type: 'text/zip' });
    return this.createWrapper(file);
  }

  public createWrapper(file: File): FileWrapper {
    return {
      file: file,
      name: file.name,
      extension: this.getFileExtension(file),
      filesContained: Math.trunc(file.size / 50000),
      dateModified: new Date(file.lastModified),
    };
  }

  private getFileExtension(file: File) {
    return file.type.split('/')[1];
  }
}
