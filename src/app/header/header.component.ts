import {Component, input, InputSignal, output} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  headerText: InputSignal<String> = input.required<String>();

  menuButtonPressed = output<void>();

  emitMenuButtonPressed(): void {
    this.menuButtonPressed.emit()
  }

}
