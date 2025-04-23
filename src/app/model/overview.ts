import {PlagdetConfiguration} from "./plagdet-configuration";


export interface Overview {
  name: string;
  analyzedFileName?: string;
  dateAnalyzed: Date;
  configuration: PlagdetConfiguration;
}
