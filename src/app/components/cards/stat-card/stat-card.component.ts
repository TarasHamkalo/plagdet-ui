import {Component, Input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: "app-stat-card",
  imports: [
    MatCardModule,
  ],
  templateUrl: "./stat-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./stat-card.component.css"]
})
export class StatCardComponent {

  @Input({required: true}) public value = "";

  @Input({required: true}) public name = "";


}
