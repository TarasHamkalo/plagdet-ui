import {Component, computed, Input, signal} from "@angular/core";
import {NavItem} from "../../../types/nav-item";
import {MatIcon} from "@angular/material/icon";
import {NavigationService} from "../../../services/navigation/navigation.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatRipple} from "@angular/material/core";
import {MatListItem, MatListItemLine, MatListItemTitle} from "@angular/material/list";

@Component({
  selector: "app-nav-item-view",
  imports: [
    MatIcon,
    RouterLink,
    MatRipple,
    RouterLinkActive,
    MatListItem,
    MatListItemTitle,
    MatListItemLine
  ],
  templateUrl: "./nav-item-view.component.html",
  styleUrl: "./nav-item-view.component.scss"
})
export class NavItemViewComponent {

  @Input() public isActivated = false;

  @Input() public isFullWidth = signal(true);

  @Input({required: true}) public navItem: Partial<NavItem> = {};

  @Input() public isActive = computed(() =>
    this.navItem.route === this.navigationService.getActive()()
  );

  constructor(private navigationService: NavigationService) {
  }

  protected fullWidthNameId(navItem: Partial<NavItem>): string {
    return `full-width-name-${navItem.fullWidthName}`;
  }
}
