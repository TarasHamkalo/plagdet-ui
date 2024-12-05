import {Routes} from '@angular/router';
import {UploadDatasetComponent} from "./pages/upload-dataset/upload-dataset.component";
import {ConfigurationPageComponent} from "./pages/configuration-page/configuration-page.component";

export const routes: Routes = [

  {path: 'upload', component: UploadDatasetComponent},
  {path: 'configuration', component: ConfigurationPageComponent},
  {path: '**', redirectTo: 'upload'}

];
