import {Component, signal} from "@angular/core";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NavListComponent} from "../components/navigation/nav-list/nav-list.component";
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../components/navigation/header/header.component";

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

  protected toggleSideNav() {
    this.isSidenavOpen.update(b => !b);
  }

}
