import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {NavItem} from "../model/nav-item";
import {routes} from "../app.routes";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {


  private readonly routesMap: Map<string, NavItem[]> = new Map([
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
    {isFullWidthOnly: true, fullWidthName: 'Dokumentácia', iconPath: 'file-document-outline', isIconSvg: true},
    {isFullWidthOnly: true, fullWidthName: 'Kontakt', iconPath: 'email-outline', isIconSvg: true},
    {isFullWidthOnly: true, fullWidthName: 'Často kladené otázky', iconPath: 'frequently-asked-questions', isIconSvg: true},
    {isFullWidthOnly: false, fullWidthName: 'Nahrať súbor odovzdaní', iconPath: 'upload', isIconSvg: false},
    {isFullWidthOnly: false, fullWidthName: 'Importovať analyzu', iconPath: 'import', isIconSvg: true},
    {isFullWidthOnly: false, fullWidthName: 'Predošlé analýzy', iconPath: 'list', isIconSvg: false}
  ];

  private readonly routesActivatedMocked: Map<string, NavItem | undefined> = new Map([
    ['analysis', this.routesMap.get('analysis')?.filter(i => i.fullWidthName === 'Súhrn analýzy').at(0)],
    ['**', this.defaultRoutes.filter(i => i.fullWidthName === 'Nahrať súbor odovzdaní').at(0)]
  ]);

  constructor(private router: Router) {}

  getRoutes(): NavItem[] {
    const url = this.router.url.slice(1);
    if (this.routesMap.has(url)) {
      return this.routesMap.get(url) ?? [];
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
}
