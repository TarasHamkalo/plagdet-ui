import {Component, Input, OnInit, signal} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {NavigationEnd, Router} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";
import {filter} from "rxjs";
import {NavItem} from "../../model/nav-item";

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
export class NavListComponent implements OnInit {

  public navItems: NavItem[] = [];

  public activatedNavItem: NavItem | undefined = undefined;

  @Input() public fullWidthNavItems = signal(false);

  constructor(private router: Router,
              private navigationService: NavigationService) {
  }

  ngOnInit(): void {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.navItems = this.navigationService.getRoutes()
      this.activatedNavItem = this.navigationService.getActivated()
      // this.routes = this.router.config
      //   .filter(route => route.data && route.data.name)
      //   .map(route => ({ path: route.path, name: route.data.name }));
    });

    // console.log(this.route.snapshot.url.join('/'));

    // // Subscribe for future route changes
    // this.route.url.subscribe(url => console.log(url.join('/')));
    // this.route.url.subscribe(url => console.log(url));
    // this.navigationService.getRoutes()
  }
}
