import {Injectable} from '@angular/core';
import {NavInfo} from "../model/nav-info";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // TODO: normal icons, not mock
  navInfo: Array<NavInfo> = [
    {id: 1, label: 'Nahrať', icon: 'face', path: '/upload', current: false},
    {id: 2, label: 'Importovať', icon: 'face', path: '/import', current: false},
    {id: 3, label: 'Analýzy', icon: 'face', path: '/analyze', current: false}
  ]

  getNavItems() {
    return this.navInfo;
  }

}
