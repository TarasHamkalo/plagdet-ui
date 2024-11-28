import {Component, Signal, signal} from '@angular/core';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {HeaderComponent} from "./header/header.component";
import {MatSidenav, MatSidenavContainer, MatSidenavContent,} from "@angular/material/sidenav";
import {RouterOutlet} from "@angular/router";
import {NavigationComponent} from "./components/navigation/navigation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSlideToggle,
    HeaderComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    RouterOutlet,
    NavigationComponent
  ],
  template: `
    <app-header (menuButtonPressed)="sidenav.toggle()" [headerText]="'Plagdet'"/>

    <mat-sidenav-container style="height: 100%">

      <mat-sidenav #sidenav mode="push">
        <app-navigation/>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <main>
          <router-outlet/>
        </main>
      </mat-sidenav-content>

    </mat-sidenav-container>

  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `

})
export class AppComponent {

  public title: Signal<String> = signal('ux');

}
