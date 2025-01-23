import {Component, OnInit} from "@angular/core";
import {HeaderComponent} from "./components/header/header.component";
import {HomeComponent} from "./home/home.component";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {AnalysisContextService} from "./context/analysis-context.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    HeaderComponent,
    HomeComponent,

  ],

  template: `
    <div class="app-layout">
      <app-header (menuToggle)="home.toggleSideNav()"/>
      <main class="content">
        <app-home #home/>
      </main>
    </div>
  `,

  styles: `
    .app-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex-grow: 1;
      padding-top: 64px;
    }
  `
  // TODO: change to rem ? => 3 days later =>  no :)
})
export class AppComponent implements OnInit {

  private icons: string[] = [
    "file-document-multiple-outline",
    "rename-box-outline",
    "file-search-outline",
    "compare-horizontal",
    "ballot-outline",
    "book-multiple-outline",
    "file-document-outline",
    "list",
    "badge-account-horizontal-outline",
    "apache-kafka",
    "email-outline",
    "frequently-asked-questions",
    "import",
    "upload-outline",
  ];

  constructor(private analysisContextService: AnalysisContextService,
              private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.analysisContextService.loadConfigurationOptions();
    this.registerIcons(this.icons);
  }

  private registerIcons(icons: string[]) {
    for (const icon of icons) {
      this.iconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`./assets/${icon}.svg`)
      );
    }
  }
}