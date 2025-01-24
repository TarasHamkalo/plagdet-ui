import {Injectable, signal} from "@angular/core";
import {Router} from "@angular/router";
import {NavItem} from "../../model/nav-item";
import {PageRoutes} from "../../app.routes";

@Injectable({
  providedIn: "root"
})
export class NavigationService {

  private readonly routesMap = new Map<string, NavItem[]>([
    [
      PageRoutes.ANALYSIS,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Zhluky", iconPath: "apache-kafka", isIconSvg: true}
      ],
    ],
    [
      PageRoutes.PAIRS,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Zhluky", iconPath: "apache-kafka", isIconSvg: true}
      ],
    ],
    [
      PageRoutes.PAIR,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.NONE, isFullWidthOnly: false, fullWidthName: "Zhluky", iconPath: "apache-kafka", isIconSvg: true}
      ]
    ]
  ]);

  private readonly defaultRoutes: NavItem[] = [
    {route: PageRoutes.UPLOAD, isFullWidthOnly: false, fullWidthName: "Nahrať súbor odovzdaní", iconPath: "upload-outline", isIconSvg: true},
    {route: PageRoutes.IMPORT, isFullWidthOnly: false, fullWidthName: "Importovať analyzu", iconPath: "import", isIconSvg: true},
    {route: PageRoutes.PREVIOUS_ANALYSIS, isFullWidthOnly: false, fullWidthName: "Predošlé analýzy", iconPath: "list", isIconSvg: false}
  ];

  private readonly supportRoutes: NavItem[] = [
    {route: PageRoutes.NONE, isFullWidthOnly: true, fullWidthName: "Dokumentácia", iconPath: "file-document-outline", isIconSvg: true},
    {route: PageRoutes.NONE, isFullWidthOnly: true, fullWidthName: "Kontakt", iconPath: "email-outline", isIconSvg: true},
    {route: PageRoutes.NONE, isFullWidthOnly: true, fullWidthName: "Často kladené otázky", iconPath: "frequently-asked-questions", isIconSvg: true},
  ];

  private readonly homeRoute: NavItem = {
    route: PageRoutes.HOME,
    fullWidthName: "Späť na hlavnú stranu",
    iconPath: "arrow_back",
    isIconSvg: false,
    isFullWidthOnly: true
  };

  private dynamicRoutesBase = [PageRoutes.PAIR];

  private activeRoute = signal(PageRoutes.HOME);

  constructor(private router: Router) {}

  getRoutes(): NavItem[] {
    const url = this.router.url.split("?")[0].split("#")[0];
    const baseUrl = this.getBaseUrl(url);
    console.log(baseUrl);
    if (this.routesMap.has(baseUrl)) {
      const routes = this.routesMap.get(baseUrl) ?? [];
      return routes.concat(this.supportRoutes);
    }

    return this.defaultRoutes.concat(this.supportRoutes);
  }

  getActive() {
    return this.activeRoute;
  }

  updateActive() {
    const url = this.router.url;
    this.activeRoute.set(url as PageRoutes);
    console.log(this.activeRoute());
  }

  getHome(): NavItem | undefined {
    return this.homeRoute;
  }

  private getBaseUrl(url: string) {
    for (const dynamicUrl of this.dynamicRoutesBase) {
      if (url.startsWith(dynamicUrl)) {
        return dynamicUrl;
      }
    }

    return url;
  }

}
