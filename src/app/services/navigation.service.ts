import {Injectable, signal} from "@angular/core";
import {Router} from "@angular/router";
import {NavItem} from "../model/nav-item";
import {Routes} from "../enum/routes";

@Injectable({
  providedIn: "root"
})
export class NavigationService {

  private readonly routesMap = new Map<string, NavItem[]>([
    [
      Routes.ANALYSIS,
      [
        {route: Routes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: Routes.NONE, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: Routes.NONE, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: Routes.NONE, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: Routes.NONE, isFullWidthOnly: false, fullWidthName: "Zhluky", iconPath: "apache-kafka", isIconSvg: true}
      ]
    ]
  ]);

  private readonly defaultRoutes: NavItem[] = [
    {route: Routes.UPLOAD, isFullWidthOnly: false, fullWidthName: "Nahrať súbor odovzdaní", iconPath: "upload", isIconSvg: false},
    {route: Routes.NONE, isFullWidthOnly: false, fullWidthName: "Importovať analyzu", iconPath: "import", isIconSvg: true},
    {route: Routes.NONE, isFullWidthOnly: false, fullWidthName: "Predošlé analýzy", iconPath: "list", isIconSvg: false}
  ];

  private readonly supportRoutes: NavItem[] = [
    {route: Routes.NONE, isFullWidthOnly: true, fullWidthName: "Dokumentácia", iconPath: "file-document-outline", isIconSvg: true},
    {route: Routes.NONE, isFullWidthOnly: true, fullWidthName: "Kontakt", iconPath: "email-outline", isIconSvg: true},
    {route: Routes.NONE, isFullWidthOnly: true, fullWidthName: "Často kladené otázky", iconPath: "frequently-asked-questions", isIconSvg: true},
  ];

  private readonly homeRoute: NavItem = {
    route: Routes.HOME,
    fullWidthName: "Späť na hlavnú stranu",
    iconPath: "arrow_back",
    isIconSvg: false,
    isFullWidthOnly: true
  };

  private activeRoute = signal(Routes.HOME);

  constructor(private router: Router) {}

  getRoutes(): NavItem[] {
    const url = this.router.url;
    if (this.routesMap.has(url)) {
      const routes = this.routesMap.get(url) ?? [];
      return routes.concat(this.supportRoutes);
    }

    return this.defaultRoutes;
  }

  getActive() {
    return this.activeRoute;
  }

  updateActive() {
    const url = this.router.url;
    this.activeRoute.set(url as Routes)
    console.log(this.activeRoute())
  }

  getHome(): NavItem | undefined {
    return this.homeRoute;
  }

}
