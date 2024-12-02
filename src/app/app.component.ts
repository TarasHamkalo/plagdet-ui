import {Component, Signal, signal} from '@angular/core';
import {CardWithInput} from "./components/card-with-input/card-with-input.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CardWithInput
  ],
  template: `
    <app-card-with-input/>
<!--    <app-header (menuButtonPressed)="sidenav.toggle()" [headerText]="'Plagdet'"/>-->
  
<!--    <mat-sidenav-container style="height: 100%">-->

<!--      <mat-sidenav #sidenav mode="push">-->
<!--        <app-navigation/>-->
<!--      </mat-sidenav>-->
<!--      -->
<!--      <mat-sidenav-content>-->
<!--        <main>-->
<!--          <router-outlet/>-->
<!--        </main>-->
<!--      </mat-sidenav-content>-->

<!--    </mat-sidenav-container>-->

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
