import {Routes} from "@angular/router";
import {
  UploadDatasetPageComponent
} from "./pages/upload-dataset-page/upload-dataset-page.component";
import {ConfigurationPageComponent} from "./pages/configuration-page/configuration-page.component";
import {AnalysisPageComponent} from "./pages/analysis-page/analysis-page.component";
import {
  ImportAnalysisPageComponent
} from "./pages/import-analysis-page/import-analysis-page.component";
import {
  PreviousAnalysisPageComponent
} from "./pages/previous-analysis-page/previous-analysis-page.component";
import {
  SubmissionPairsPageComponent
} from "./pages/submission-pairs-page/submission-pairs-page.component";

export enum PageRoutes {
  NONE = "#",
  UPLOAD = "/upload",
  IMPORT = "/import",
  PREVIOUS_ANALYSIS = "/previous-analysis",
  CONFIGURATION = "/configuration",
  ANALYSIS = "/analysis",
  PAIRS = "/pairs",
  HOME = UPLOAD,
}
export const routes: Routes = [
  {path: PageRoutes.UPLOAD.substring(1), component: UploadDatasetPageComponent},
  {path: PageRoutes.PREVIOUS_ANALYSIS.substring(1), component: PreviousAnalysisPageComponent},
  {path: PageRoutes.IMPORT.substring(1), component: ImportAnalysisPageComponent},
  {path: PageRoutes.CONFIGURATION.substring(1), component: ConfigurationPageComponent},
  {path: PageRoutes.ANALYSIS.substring(1), component: AnalysisPageComponent},
  {path: PageRoutes.PAIRS.substring(1), component: SubmissionPairsPageComponent},
  {path: "**", redirectTo: PageRoutes.HOME.substring(1)}
];
