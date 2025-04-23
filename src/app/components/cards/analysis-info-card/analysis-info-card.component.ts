import {Component, computed, Input} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemIcon, MatListItemTitle} from "@angular/material/list";
import {MatDivider} from "@angular/material/divider";
import {DatePipe, DecimalPipe} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {TextOverflowScrollDirective} from "../../../directives/text-overflow-scroll.directive";

@Component({
  selector: "app-analysis-info-card",
  imports: [
    MatIcon,
    MatList,
    MatListItem,
    MatDivider,
    MatListItemTitle,
    MatListItemIcon,
    DatePipe,
    DecimalPipe,
    MatChip,
    MatTooltip,
    TextOverflowScrollDirective,
  ],
  templateUrl: "./analysis-info-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./analysis-info-card.component.scss"]
})
export class AnalysisInfoCardComponent {

  @Input() public supportiveText = "V tejto časti sa zobrazujú informácie o analýze";

  protected analysis = computed(() => {
    const report = this.analysisContext.getReport()();
    if (report) {
      return report!.overview;
    }
    return null;
  });

  protected extensionToCount = computed(() => {
    const report = this.analysisContext.getReport()();
    if (report) {
      return Array.from(report.submissions.values())
        .map(submission => submission.fileData.extension)
        .reduce((acc, ext) => {
          acc.set(ext, (acc.get(ext) || 0) + 1);
          return acc;
        }, new Map<string, number>());
    }

    return new Map<string, number>();
  });

  constructor(private analysisContext: AnalysisContextService) {
  }

}
