import {Component, ViewEncapsulation} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";

@Component({
  selector: "app-submission-pair-info-card",
  imports: [
    MatCardModule,
    MatGridListModule
  ],
  templateUrl: "./submission-pair-info-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./submission-pair-info-card.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionPairInfoCardComponent {

}
