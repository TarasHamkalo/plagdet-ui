import {Component, signal} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NavListComponent} from "../components/nav-list/nav-list.component";
import {RouterOutlet} from "@angular/router";
import {SubmissionsListComponent} from "../components/submissions-list/submissions-list.component";

// Combines side navigation-gen and content
@Component({
  selector: 'app-home',
  imports: [
    MatSidenav, MatSidenavContainer, MatSidenavContent, NavListComponent, RouterOutlet, SubmissionsListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public isSidenavOpen = signal(false);

  toggleSideNav() {
    this.isSidenavOpen.update(b => !b);
  }

}
