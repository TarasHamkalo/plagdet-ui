import {Component, computed, Input, OnInit, signal} from "@angular/core";
import {NavItem} from "../../model/nav-item";
import {MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {NavigationService} from "../../services/navigation/navigation.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: "app-nav-item-view",
  imports: [
    MatListItem,
    MatIcon,
    RouterLink
  ],
  templateUrl: "./nav-item-view.component.html",
  styleUrl: "./nav-item-view.component.css"
})
export class NavItemViewComponent implements OnInit {

  @Input() public isActivated = false;

  @Input() public isFullWidth = signal(true);

  @Input({required: true}) public navItem: Partial<NavItem> = {};

  @Input() public isActive = computed(() =>
    this.navItem.route === this.navigationService.getActive()()
  );

  constructor(private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    console.log(`${this.navItem.route}: ${this.isActive}`);
  }

  fullWidthNameId(navItem: any): string {
    return `full-width-name-${navItem.fullWidthName}`;
  }
}
