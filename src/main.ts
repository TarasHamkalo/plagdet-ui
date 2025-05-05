import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";


(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    return `/~th776no/plagdet/assets/monaco/min/vs/base/worker/workerMain.js`;
  }
};
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
