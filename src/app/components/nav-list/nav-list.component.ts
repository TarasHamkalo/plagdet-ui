import {Component, Input, OnInit, signal} from "@angular/core";
import {MatNavList} from "@angular/material/list";
import {NavigationEnd, Router} from "@angular/router";
import {NavigationService} from "../../services/navigation/navigation.service";
import {filter} from "rxjs";
import {NavItem} from "../../model/nav-item";
import {NavItemViewComponent} from "../nav-item-view/nav-item-view.component";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: "app-nav-list",
  imports: [
    MatNavList,
    NavItemViewComponent,
    MatDivider
  ],
  templateUrl: "./nav-list.component.html",
  styleUrl: "./nav-list.component.css"
})
export class NavListComponent implements OnInit {

  @Input() public isFullWidth = signal(false);

  @Input() public displayHomeNav = false;

  public navItems: NavItem[] = [];

  public activatedNavItem: NavItem | undefined = undefined;

  public homeNavItem: NavItem | undefined = undefined;

  constructor(private router: Router,
              private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.navItems = this.navigationService.getRoutes();
      this.homeNavItem = this.navigationService.getHome();
      this.displayHomeNav = !this.navItems.some(item => item.route === this.homeNavItem?.route);
      this.navigationService.updateActive();
    });

  }

}
