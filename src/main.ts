import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    return `/plagdet-ui/assets/monaco/${label}.worker.js`;
  }
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
