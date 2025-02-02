import {Component, Input, ViewEncapsulation} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {Submission} from "../../../model/submission";
import {SubmissionPair} from "../../../model/submission-pair";
import {MinutesTimePipe} from "../../../pipes/minutes-time.pipe";
import {UnixDatePipe} from "../../../pipes/unix-date.pipe";
import {CellHighlightDirective} from "../../../directives/cell-highlight.directive";

@Component({
  selector: "app-submission-pair-info-card",
  imports: [
    MatCardModule,
    MatGridListModule,
    UnixDatePipe,
    MinutesTimePipe,
    CellHighlightDirective
  ],
  templateUrl: "./submission-pair-info-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./submission-pair-info-card.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionPairInfoCardComponent {

  @Input({required: true}) public first!: Submission;

  @Input({required: true}) public second!: Submission;

  @Input({required: true}) public submissionPair!: SubmissionPair;

}
