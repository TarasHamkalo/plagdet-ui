import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-image-wrapper',
  imports: [],
  templateUrl: './image-wrapper.component.html',
  styleUrl: './image-wrapper.component.css'
})
export class ImageWrapperComponent {

  @Input({required: true}) public imagePath: string = "";

  @Input({required: true}) public imageDesc: string = "";

  @Input() public imageWidth: number | null = null;

}
