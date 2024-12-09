import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {NavItem} from "../model/nav-item";
import {routes} from "../app.routes";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {


  private readonly routesMap = new Map<string, NavItem[]>([
    [
      'analysis',
      [
        {isFullWidthOnly: false, fullWidthName: 'Súhrn analýzy', iconPath: 'ballot-outline', isIconSvg: true},
        {isFullWidthOnly: false, fullWidthName: 'Dvojice odovzdaní', iconPath: 'book-multiple-outline', isIconSvg: true},
        {isFullWidthOnly: false, fullWidthName: 'Odovzdania', iconPath: 'list', isIconSvg: false},
        {isFullWidthOnly: false, fullWidthName: 'Metaúdaje', iconPath: 'badge-account-horizontal-outline', isIconSvg: true},
        {isFullWidthOnly: false, fullWidthName: 'Zhluky', iconPath: 'apache-kafka', isIconSvg: true}
      ]
    ]
  ]);

  private readonly defaultRoutes: NavItem[] = [
    {isFullWidthOnly: false, fullWidthName: 'Nahrať súbor odovzdaní', iconPath: 'upload', isIconSvg: false},
    {isFullWidthOnly: false, fullWidthName: 'Importovať analyzu', iconPath: 'import', isIconSvg: true},
    {isFullWidthOnly: false, fullWidthName: 'Predošlé analýzy', iconPath: 'list', isIconSvg: false}
  ];

  private readonly supportRoutes: NavItem[] = [
    {isFullWidthOnly: true, fullWidthName: 'Dokumentácia', iconPath: 'file-document-outline', isIconSvg: true},
    {isFullWidthOnly: true, fullWidthName: 'Kontakt', iconPath: 'email-outline', isIconSvg: true},
    {isFullWidthOnly: true, fullWidthName: 'Často kladené otázky', iconPath: 'frequently-asked-questions', isIconSvg: true},
  ];

  private readonly routesActivatedMocked = new Map<string, NavItem | undefined>([
    ['analysis', this.routesMap.get('analysis')?.filter(i => i.fullWidthName === 'Súhrn analýzy').at(0)],
    ['**', this.defaultRoutes.filter(i => i.fullWidthName === 'Nahrať súbor odovzdaní').at(0)]
  ]);

  private readonly homeNavItem: NavItem = {
    fullWidthName: 'Späť na hlavnú stranu',
    iconPath: 'arrow_back',
    isIconSvg: false,
    isFullWidthOnly: true
  };

  constructor(private router: Router) {}

  getRoutes(): NavItem[] {
    const url = this.router.url.slice(1);
    if (this.routesMap.has(url)) {
      const routes = this.routesMap.get(url) ?? [];
      return routes.concat(this.supportRoutes);
    }

    return this.defaultRoutes;
  }

  getActivated(): NavItem | undefined {
    const url = this.router.url.slice(1);
    if (this.routesActivatedMocked.has(url)) {
      return this.routesActivatedMocked.get(url);
    }

    return this.routesActivatedMocked.get('**');
  }

  getHome(): NavItem | undefined {
    return this.homeNavItem;
  }
}
