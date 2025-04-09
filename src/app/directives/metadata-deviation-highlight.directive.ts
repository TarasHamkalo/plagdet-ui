import {Directive, HostBinding, Input, OnChanges, SimpleChanges} from "@angular/core";
import {MetadataStatisticsService} from "../services/metadata-statistics.service";
import {Submission} from "../model/submission";

@Directive({
  selector: "[appMetadataDeviationHighlight]"
})
export class MetadataDeviationHighlightDirective implements OnChanges {

  @Input({required: true}) public submission!: Submission;

  @Input() public dateField: "modificationDate" | "creationDate" | null = null;

  @Input() public checkTimeDeviation = false;

  @HostBinding("class.meta-warning") private metaWarning = false;

  constructor(
    protected metadataStatisticsService: MetadataStatisticsService
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["submission"]) {
      // 
      if (this.checkTimeDeviation) {
        this.metaWarning = this.metadataStatisticsService.isBelowAvgEditTime(this.submission);
      } else if (this.dateField !== null) {
        this.metaWarning =
          this.metadataStatisticsService.isDateDeviating(this.submission, this.dateField);
      }
      // 
    }
  }


}