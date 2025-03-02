import {PlagdetConfiguration} from "./plagdet-configuration";


export interface Overview {
  name: string;
  analyzedFileName?: string;
  dateAnalyzed: Date;
  comparisonsCount: number;
  configuration: PlagdetConfiguration;
}
