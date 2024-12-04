import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-titled-surface',
  imports: [],
  templateUrl: './titled-surface.component.html',
  styleUrl: './titled-surface.component.css'
})
export class TitledSurfaceComponent {

  @Input() public title: string = "Default Title";

  @Input() public subtitle: string = "Default subtitle";

  @Input() public titleCentered: boolean = false;

}
