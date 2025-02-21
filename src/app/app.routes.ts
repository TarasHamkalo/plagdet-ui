import {Routes} from "@angular/router";
// import {
//   UploadDatasetPageComponent
// } from "./pages/upload-dataset-page/upload-dataset-page.component";
// import {AnalysisPageComponent} from "./pages/analysis/overview-page/analysis-page.component";
import {
  ImportAnalysisPageComponent
} from "./pages/import-analysis-page/import-analysis-page.component";
import {
  SubmissionPairsPageComponent
} from "./pages/analysis/submission-pairs-page/submission-pairs-page.component";
import {
  SubmissionPairViewPageComponent
} from "./pages/analysis/submission-pair-view-page/submission-pair-view-page.component";
import {AnalysisRelatedContentGuard} from "./guards/analysis-related-content.guard";
import {MetadataPageComponent} from "./pages/analysis/metadata-page/metadata-page.component";
import {
  SubmissionsPageComponent
} from "./pages/analysis/submissions-page/submissions-page.component";
import {
  SubmissionViewPageComponent
} from "./pages/analysis/submission-view-page/submission-view-page.component";
import {
  SimilarityHeatmapPageComponent
} from "./pages/analysis/similarity-heatmap-page/similarity-heatmap-page.component";
import {AnalysisPageComponent} from "./pages/analysis/overview-page/analysis-page.component";
import {AnalysisPageGuard} from "./guards/analysis-page.guard";

export enum PageRoutes {
  NONE = "#",
  UPLOAD = "/upload",
  IMPORT = "/import",
  PREVIOUS_ANALYSIS = "/previous-analysis",
  CONFIGURATION = "/configuration",
  ANALYSIS = "/analysis",
  PAIRS = "/pairs",
  SUBMISSIONS = "/submissions",
  METADATA = "/metadata",
  HEATMAP = "/heatmap",
  HOME = IMPORT,
}
export const routes: Routes = [
  // {path: PageRoutes.UPLOAD.substring(1), component: UploadDatasetPageComponent},
  {path: PageRoutes.IMPORT.substring(1), component: ImportAnalysisPageComponent},
  {path: PageRoutes.ANALYSIS.substring(1), component: AnalysisPageComponent, canActivate: [AnalysisPageGuard]},
  {path: PageRoutes.PAIRS.substring(1), component: SubmissionPairsPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: `${PageRoutes.PAIRS.substring(1)}/:id`, component: SubmissionPairViewPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: PageRoutes.METADATA.substring(1), component: MetadataPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: PageRoutes.SUBMISSIONS.substring(1), component: SubmissionsPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: PageRoutes.HEATMAP.substring(1), component: SimilarityHeatmapPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: `${PageRoutes.SUBMISSIONS.substring(1)}/:id`, component: SubmissionViewPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: "**", redirectTo: PageRoutes.HOME.substring(1)}
];
