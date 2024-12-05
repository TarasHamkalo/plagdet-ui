import {Component} from "@angular/core";
import {HeaderComponent} from "./components/header/header.component";
import {HomeComponent} from "./home/home.component";
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from "@angular/platform-browser";

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
  // TODO: change to rem ?
})
export class AppComponent {

  constructor(private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer
  ) {

    const icons: string[] = [
      "file-document-multiple-outline",
      "rename-box-outline"
    ]

    this.registerIcons(icons);
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