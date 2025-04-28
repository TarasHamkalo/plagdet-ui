import {Component, Input, signal} from "@angular/core";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-floating-toolbar",
  imports: [
    MatIconButton,
    MatIcon,
    NgIf
  ],
  templateUrl: "./floating-toolbar.component.html",
  styleUrl: "./floating-toolbar.component.scss"
})
export class FloatingToolbarComponent {

  @Input() public isHorizontal = false;

  protected isCollapsed = signal<boolean>(false);

  public toggleToolbar(): void {
    this.isCollapsed.update(value => !value);
  }
}
