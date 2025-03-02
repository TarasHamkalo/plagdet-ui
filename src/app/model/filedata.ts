import {Metadata} from "./metadata";

export interface FileData {
  filename: string;
  submitter: string;
  temporaryPath: string;
  persistentPath: string;
  extension: string;
  metadata: Metadata;
}
