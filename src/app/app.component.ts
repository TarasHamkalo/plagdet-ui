import {Component, Signal, signal} from '@angular/core';
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [MatSlideToggle],
  template: `
    <h1>This is header !</h1>
    <mat-slide-toggle>Toggle me! ({{title()}})</mat-slide-toggle>
  `,
  styles: `
    h1 {
      color:  var(--mat-sys-on-surface);
      font-size: var(--mat-sys-display-large)
    }
  `

})
export class AppComponent {
  title: Signal<String> = signal('ux');
}
