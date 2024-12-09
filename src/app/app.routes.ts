import {Routes} from "@angular/router";
import {UploadDatasetPageComponent} from "./pages/upload-dataset-page/upload-dataset-page.component";
import {ConfigurationPageComponent} from "./pages/configuration-page/configuration-page.component";
import {AnalysisPageComponent} from "./pages/analysis-page/analysis-page.component";
import {
  ImportAnalysisPageComponent
} from "./pages/import-analysis-page/import-analysis-page.component";

export const routes: Routes = [
  {path: "upload", component: UploadDatasetPageComponent},
  {path: "import", component: ImportAnalysisPageComponent},
  {path: "configuration", component: ConfigurationPageComponent},
  {path: "analysis", component: AnalysisPageComponent},
  {path: "**", redirectTo: "upload"}
];
