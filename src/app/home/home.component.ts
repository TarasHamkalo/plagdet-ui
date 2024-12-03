import {Component, signal} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

// Combines side navigation-gen and content
@Component({
  selector: 'app-home',
  imports: [
    MatNavList, MatListItem,
    MatSidenav, MatSidenavContainer, MatSidenavContent,
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public isSidenavOpen = signal(false);

  toggleSideNav() {
    this.isSidenavOpen.update(b => !b)
  }

}
