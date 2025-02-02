import {Component, Input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {Submission} from "../../../model/submission";
import {UnixDatePipe} from "../../../pipes/unix-date.pipe";
import {MinutesTimePipe} from "../../../pipes/minutes-time.pipe";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {StatCardComponent} from "../stat-card/stat-card.component";
import {MatIconButton} from "@angular/material/button";
import {ExportService} from "../../../services/export.service";

@Component({
  selector: "app-submission-info-card",
  imports: [
    MatCardModule,
    UnixDatePipe,
    MinutesTimePipe,
    MatList,
    MatListItem,
    MatIcon,
    StatCardComponent,
    MatIconButton
  ],
  templateUrl: "./submission-info-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./submission-info-card.component.css"]
})
export class SubmissionInfoCardComponent {

  @Input({required: true}) public submission!: Submission;

  constructor(private exportService: ExportService) {
  }

  public downloadMetadataCsv() {
    this.exportService.exportSubmissionToCsv([this.submission], this.submission.id.toFixed(0));
  }
}
