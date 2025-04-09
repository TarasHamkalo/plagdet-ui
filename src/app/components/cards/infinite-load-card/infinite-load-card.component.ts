import {Component, Input} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: "app-infinite-load-card",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatProgressSpinner,
    MatCardTitle
  ],
  templateUrl: "./infinite-load-card.component.html",
  styleUrls: [
    "./infinite-load-card.component.css",
    "../shared/card-base.scss"
  ]
})
export class InfiniteLoadCardComponent {

  @Input({required: true}) public header = "";

}
