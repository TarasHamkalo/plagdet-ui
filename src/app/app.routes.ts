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
import {
  SubmissionGraphPageComponent
} from "./pages/analysis/submission-graph-page/submission-graph-page.component";
import {
  ClusterViewPageComponent
} from "./pages/analysis/cluster-view-page/cluster-view-page.component";
import {
  SubmissionsDiffViewPageComponent
} from "./pages/analysis/submissions-diff-view-page/submissions-diff-view-page.component";

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
  GRAPH = "/graph",
  CLUSTERS = "/clusters",
  DIFF = "/diff",
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
  {path: PageRoutes.GRAPH.substring(1), component: SubmissionGraphPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: `${PageRoutes.CLUSTERS.substring(1)}/:id`, component: ClusterViewPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: `${PageRoutes.DIFF.substring(1)}`, component: SubmissionsDiffViewPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: `${PageRoutes.DIFF.substring(1)}/:firstId/:secondId`, component: SubmissionsDiffViewPageComponent, canActivate: [AnalysisRelatedContentGuard]},
  {path: "**", redirectTo: PageRoutes.HOME.substring(1)}
];
