import { Routes } from '@angular/router';
import {UploadDatasetComponent} from "./upload-dataset/upload-dataset.component";

export const routes: Routes = [
  { path: 'upload', component: UploadDatasetComponent},
  { path: '**', redirectTo: 'upload'}

  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadComponent: () => {
  //     return import('./upload-dataset/upload-dataset.component')
  //       .then((m) => m.UploadDatasetComponent);
  //   }
  // }
];
