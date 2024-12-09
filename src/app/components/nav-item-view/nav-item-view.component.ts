import {Component, Input, signal} from "@angular/core";
import {NavItem} from "../../model/nav-item";
import {MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "app-nav-item-view",
  imports: [
    MatListItem,
    MatIcon
  ],
  templateUrl: "./nav-item-view.component.html",
  styleUrl: "./nav-item-view.component.css"
})
export class NavItemViewComponent {

  @Input() public isActivated = false;

  @Input() public isFullWidth = signal(true);

  @Input({required: true}) public navItem: Partial<NavItem> = {};

}
