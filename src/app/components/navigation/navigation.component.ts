import {Component, inject, signal} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {NavigationService} from "../../service/navigation.service";
import {NavInfo} from "../../model/nav-info";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatSidenav,
    MatNavList,
    MatIcon,
    MatLabel,
    MatListItem
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  private navigationService: NavigationService  = inject(NavigationService);
  public navInfos = signal<Array<NavInfo>>([])

  ngOnInit(): void {
    this.navInfos.set(this.navigationService.getNavItems());
    console.log(this.navInfos);
  }
}
