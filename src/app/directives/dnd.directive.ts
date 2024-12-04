import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  @HostBinding('class.dnd-faint') private faintClass: boolean = false;

  @Output() public dragDrop = new EventEmitter<DragEvent>();

  constructor() {}

  ngOnInit() {
    this.faintClass = false;
  }

  @HostListener('dragover', ['$event']) onDragenter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.faintClass = true
    console.log(event)
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.faintClass = false
    console.log(event)
  }

  @HostListener('drop', ['$event']) onDragDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.faintClass = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        this.dragDrop.emit(event)
    }
  }
}
