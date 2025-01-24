import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AnalysisContextService} from "../context/analysis-context.service";
import {PageRoutes} from "../app.routes";

@Injectable({
  providedIn: "root",
})
export class AnalysisRelatedContentGuard implements CanActivate {
  constructor(
    private analysisContext: AnalysisContextService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isReportLoaded = this.analysisContext.getReport()() !== null;
    if (!isReportLoaded) {
      this.analysisContext.clear();
      this.router.navigate([PageRoutes.HOME]);
      return false;
    }
    return true;
  }
}
