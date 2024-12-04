import {Component, Input, signal} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-nav-list',
  imports: [
    MatNavList,
    MatIcon,
    MatListItem
  ],
  templateUrl: './nav-list.component.html',
  styleUrl: './nav-list.component.css'
})
export class NavListComponent {

  public navItems: string[] = ['Dashboard'];

  @Input() public fullWidthNavItems = signal(false);

}
