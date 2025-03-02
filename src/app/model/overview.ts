import {PlagdetConfiguration} from "./plagdet-configuration";


export interface Overview {
  name: string;
  analyzedFileName?: string;
  dateAnalyzed: Date;
  numberOfComparisons: number;
  docxFiles: number;
  docFiles: number;
  pdfFiles: number;
  totalFilesCount: number; // shouldn't be there (but for prototype simplifies table logic)
  configuration: PlagdetConfiguration;
}
