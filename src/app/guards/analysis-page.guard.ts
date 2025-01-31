import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AnalysisContextService} from "../context/analysis-context.service";
import {PageRoutes} from "../app.routes";

@Injectable({
  providedIn: "root",
})
export class AnalysisPageGuard implements CanActivate {

  constructor(
    private analysisContext: AnalysisContextService,
    private router: Router
  ) {
  }

  public canActivate(): boolean {
    const isFileUploaded = this.analysisContext.getSubmittedFile()() !== null;
    if (!isFileUploaded) {
      this.analysisContext.clearContext();
      this.router.navigate([PageRoutes.HOME]);
      return false;
    }
    return true;
  }
}
