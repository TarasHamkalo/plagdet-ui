import {Component} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatNavList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

// Combines side navigation-gen and content
@Component({
  selector: 'app-home',
  imports: [
    MatNavList, MatListItem,
    MatSidenav, MatSidenavContainer, MatSidenavContent,
    MatIcon, MatIconButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
