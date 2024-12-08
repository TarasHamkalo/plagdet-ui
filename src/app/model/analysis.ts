import {ConfigurationOption} from "./configuration-option";

export interface Analysis {
  name: string;
  analyzedFileName: string;
  dateAnalyzed: Date;
  numberOfComparisons: number;
  docxFiles: number;
  docFiles: number;
  pdfFiles: number;
  configurationUsed: ConfigurationOption[];
}
