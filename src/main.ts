import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    switch (label) {
      case "json":
        return "/plagdet-ui/assets/monaco/min/vs/language/json/json.worker.js";
      case "css":
      case "scss":
      case "less":
        return "/plagdet-ui/assets/monaco/min/vs/language/css/css.worker.js";
      case "html":
      case "handlebars":
      case "razor":
        return "/plagdet-ui/assets/monaco/min/vs/language/html/html.worker.js";
      case "typescript":
      case "javascript":
        return "/plagdet-ui/assets/monaco/min/vs/language/typescript/ts.worker.js";
      default:
        return "/plagdet-ui/assets/monaco/min/vs/editor/editor.worker.js";
    }
  }
};
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
