import {Component, effect, signal, ViewEncapsulation} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {Overview} from "../../../model/overview";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {KeyValuePipe, NgForOf} from "@angular/common";

@Component({
  selector: "app-configuration-info-card",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatList,
    MatListItem,
    MatCardModule,
    NgForOf,
    KeyValuePipe
  ],
  templateUrl: "./configuration-info-card.component.html",
  styleUrl: "./configuration-info-card.component.css",
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationInfoCardComponent {

  public overview = signal<Overview | undefined>(undefined);

  constructor(private analysisContext: AnalysisContextService) {
    effect(() => {
      const report = this.analysisContext.getReport()();
      if (report) {
        this.overview.set(report!.overview);
      }
    });
  }

  public getParams() {
    return this.overview()?.configuration.sentenceComparatorParameters as Record<string, any>;
  }
}
