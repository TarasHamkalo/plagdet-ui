import {Component, signal} from "@angular/core";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NavListComponent} from "../components/navigation/nav-list/nav-list.component";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../components/navigation/header/header.component";
import {NavigationService} from "../services/navigation/navigation.service";
import {filter} from "rxjs";

@Component({
  selector: "app-layout",
  imports: [
    MatSidenavContainer,
    MatSidenavContent,
    NavListComponent,
    MatSidenav,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css"
})
export class LayoutComponent {

  protected isSidenavOpen = signal(false);

  constructor(protected navigationService: NavigationService,
              private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.isSidenavOpen.set(false);
      });
  }

  protected toggleSideNav() {
    this.isSidenavOpen.update(b => !b);
  }

}
