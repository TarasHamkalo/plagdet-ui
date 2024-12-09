import {ConfigurationOption} from "./configuration-option";

export interface Analysis {
  name: string;
  analyzedFileName: string;
  dateAnalyzed: Date;
  numberOfComparisons: number;
  docxFiles: number;
  docFiles: number;
  pdfFiles: number;
  totalFilesCount: number; // shouldn't be there (but for prototype simplifies table logic)
  status: "success" | "in-process" | "error";
  configurationUsed: ConfigurationOption[];
}
