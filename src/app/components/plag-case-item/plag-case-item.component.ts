import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {SpecialMarking} from "../../model/positioning/special-marking";

@Component({
  selector: "app-plag-case-item",
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: "./plag-case-item.component.html",
  styleUrl: "./plag-case-item.component.css"
})
export class PlagCaseItemComponent {

  @Input({required: true}) public plagCaseMarking!: SpecialMarking;

  @Output() public deleteEventEmitter = new EventEmitter<SpecialMarking>();

  @Output() public editEventEmitter = new EventEmitter<SpecialMarking>();

  public onDelete() {
    this.deleteEventEmitter.emit(this.plagCaseMarking!);
  }

  public onEdit() {
    this.editEventEmitter.emit(this.plagCaseMarking!);
  }

}
