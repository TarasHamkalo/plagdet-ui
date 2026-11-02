import {Injectable, signal} from "@angular/core";
import {Router} from "@angular/router";
import {NavItem} from "../../types/nav-item";
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
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ],
    ],
    [
      PageRoutes.PAIRS,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ],
    ],
    [
      PageRoutes.METADATA,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ]
    ],
    [
      PageRoutes.SUBMISSIONS,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ]
    ],
    [
      PageRoutes.HEATMAP,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ]
    ],

    [
      PageRoutes.GRAPH,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ]
    ],
    [
      PageRoutes.CLUSTERS,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ]
    ],
    [
    PageRoutes.DIFF,
      [
        {route: PageRoutes.ANALYSIS, isFullWidthOnly: false, fullWidthName: "Súhrn analýzy", iconPath: "ballot-outline", isIconSvg: true},
        {route: PageRoutes.PAIRS, isFullWidthOnly: false, fullWidthName: "Dvojice odovzdaní", iconPath: "book-multiple-outline", isIconSvg: true},
        {route: PageRoutes.SUBMISSIONS, isFullWidthOnly: false, fullWidthName: "Odovzdania", iconPath: "list", isIconSvg: false},
        {route: PageRoutes.METADATA, isFullWidthOnly: false, fullWidthName: "Metaúdaje", iconPath: "badge-account-horizontal-outline", isIconSvg: true},
        {route: PageRoutes.HEATMAP, isFullWidthOnly: false, fullWidthName: "Teplotná mapa", iconPath: "table", isIconSvg: false},
        {route: PageRoutes.GRAPH, isFullWidthOnly: false, fullWidthName: "Graf", iconPath: "apache-kafka", isIconSvg: true},
        {route: PageRoutes.DIFF, isFullWidthOnly: false, fullWidthName: "Rozdiel obsahu", iconPath: "difference_outlined", isIconSvg: false}
      ]
    ]
  ]);

  private readonly defaultRoutes: NavItem[] = [
    {route: PageRoutes.UPLOAD, isFullWidthOnly: false, fullWidthName: "Nahrať súbor odovzdaní", iconPath: "upload-outline", isIconSvg: true},
    {route: PageRoutes.IMPORT, isFullWidthOnly: false, fullWidthName: "Importovať analyzu", iconPath: "import", isIconSvg: true},
    {route: PageRoutes.PREVIOUS_ANALYSIS, isFullWidthOnly: false, fullWidthName: "Predošlé analýzy", iconPath: "list", isIconSvg: false}
  ];

  private readonly supportRoutes: NavItem[] = [
    // {route: PageRoutes.NONE, isFullWidthOnly: true, fullWidthName: "Dokumentácia", iconPath: "file-document-outline", isIconSvg: true},
    // {route: PageRoutes.NONE, isFullWidthOnly: true, fullWidthName: "Kontakt", iconPath: "email-outline", isIconSvg: true},
    // {route: PageRoutes.NONE, isFullWidthOnly: true, fullWidthName: "Často kladené otázky", iconPath: "frequently-asked-questions", isIconSvg: true},
  ];

  private readonly homeRoute: NavItem = {
    route: PageRoutes.HOME,
    fullWidthName: "Späť na hlavnú stranu",
    iconPath: "arrow_back",
    isIconSvg: false,
    isFullWidthOnly: true
  };

  private readonly dynamicRoutesBase = [
    PageRoutes.PAIRS, PageRoutes.SUBMISSIONS, PageRoutes.CLUSTERS, PageRoutes.DIFF
  ];

  private activeRoute = signal(PageRoutes.HOME);

  private isNavigationLocked = signal(false);

  constructor(private router: Router) {}

  public getRoutes(): NavItem[] {
    const rawRoutes = this.rawRoutes();
    if (rawRoutes.length > 0) {
      return rawRoutes.concat(this.supportRoutes);
    }
    return [];
    // return this.defaultRoutes.concat(this.supportRoutes);
  }

  public rawRoutes(): NavItem[] {
    const url = this.router.url.split("?")[0].split("#")[0];
    const baseUrl = this.getBaseUrl(url);
    return this.routesMap.get(baseUrl) ?? [];
  }

  public getActive() {
    return this.activeRoute;
  }

  public updateActive() {
    const url = this.router.url;
    this.activeRoute.set(url as PageRoutes);
  }

  public getHome(): NavItem | undefined {
    return this.homeRoute;
  }


  public toggleNavigationLock(isLocked: boolean) {
    this.isNavigationLocked.set(isLocked);
  }

  public getNavigationLock() {
    return this.isNavigationLocked;
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
