import {Component, Input} from "@angular/core";

@Component({
  selector: "app-titled-surface",
  imports: [],
  templateUrl: "./titled-surface.component.html",
  styleUrl: "./titled-surface.component.css"
})
export class TitledSurfaceComponent {

  @Input() public title = "Default Title";

  @Input() public subtitle = "Default subtitle";

  @Input() public isTitleCentered = false;

  @Input() public isHorizontal = false;

}
