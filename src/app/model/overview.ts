import {Submission} from "./submission";

export interface Overview {
  name: string;
  analyzedFileName?: string;
  dateAnalyzed: Date;
  numberOfComparisons: number;
  docxFiles: number;
  docFiles: number;
  pdfFiles: number;
  totalFilesCount: number; // shouldn't be there (but for prototype simplifies table logic)
  status: "success" | "in-process" | "error";
  submissions: Submission[];
}
