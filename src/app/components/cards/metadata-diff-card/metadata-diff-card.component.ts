import {Component, Input, ViewEncapsulation} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {Submission} from "../../../model/submission";
import {SubmissionPair} from "../../../model/submission-pair";
import {MinutesTimePipe} from "../../../pipes/minutes-time.pipe";
import {UnixDatePipe} from "../../../pipes/unix-date.pipe";
import {
  MetadataDeviationHighlightDirective
} from "../../../directives/metadata-deviation-highlight.directive";
import {
  MetadataEqualityHighlightDirective
} from "../../../directives/metadata-equality-highlight.directive";
import {MatDivider} from "@angular/material/divider";
import {NgIf} from "@angular/common";
import {TextOverflowScrollDirective} from "../../../directives/text-overflow-scroll.directive";

@Component({
  selector: "app-metadata-diff-card",
  imports: [
    MatCardModule,
    MatGridListModule,
    UnixDatePipe,
    MinutesTimePipe,
    MetadataDeviationHighlightDirective,
    MetadataEqualityHighlightDirective,
    MatDivider,
    NgIf,
    TextOverflowScrollDirective
  ],
  templateUrl: "./metadata-diff-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./metadata-diff-card.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class MetadataDiffCardComponent {

  @Input({required: true}) public first!: Submission;

  @Input({required: true}) public second!: Submission;

  @Input({required: true}) public submissionPair!: SubmissionPair;

  protected isSourceIndexed(): boolean {
    return this.getSource().indexed;
  }

  protected getSource(): Submission {
    if (this.submissionPair.plagSource === "FIRST") {
      return this.first;
    }

    return this.second;
  }
}
