import {Component} from "@angular/core";
import {HeaderComponent} from "./components/header/header.component";
import {HomeComponent} from "./home/home.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    HeaderComponent,
    HomeComponent
  ],
  // app header will send event there will be binding to app home function
  template: `
    <div class="app-layout">
      <app-header/>
      <main class="content">
        <app-home/>
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
      margin-top: 64px;
    }
  `
})
export class AppComponent {
}