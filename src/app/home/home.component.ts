import {Component, signal} from "@angular/core";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NavListComponent} from "../components/nav-list/nav-list.component";
import {RouterOutlet} from "@angular/router";

// Combines side navigation-gen and content
@Component({
  selector: "app-home",
  imports: [
    MatSidenav, MatSidenavContainer, MatSidenavContent, NavListComponent, RouterOutlet
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css"
})
export class HomeComponent {

  public isSidenavOpen = signal(false);

  toggleSideNav() {
    this.isSidenavOpen.update(b => !b);
  }

}
