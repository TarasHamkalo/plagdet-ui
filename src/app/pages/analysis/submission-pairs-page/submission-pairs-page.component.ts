import {Component, effect, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {PairsTableComponent} from "../../../components/tables/pairs-table/pairs-table.component";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {SubmissionPair} from "../../../model/submission-pair";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";

@Component({
  selector: "app-submission-pairs-page",
  imports: [
    FormsModule,
    NgIf,
    MatProgressBar,
    SurfaceComponent,
    PairsTableComponent,
    ContentContainerComponent
  ],
  templateUrl: "./submission-pairs-page.component.html",
  styleUrl: "./submission-pairs-page.component.css"
})
export class SubmissionPairsPageComponent {

  protected pairs = signal<SubmissionPair[]>([]);

  protected isReportLoaded = false;

  constructor(
    protected analysisContext: AnalysisContextService,
  ) {
    effect(() => {
      const reportPairs = this.analysisContext.getReport()()!.pairs!.values();
      if (reportPairs) {
        this.pairs.set(Array.from(reportPairs));
        console.log(this.pairs().length);
        this.isReportLoaded = true;
      }
    });
  }
}
