import {Component, EventEmitter, Output, signal} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SpecialMarking} from "../../../model/positioning/special-marking";
import {SpecialMarkingType} from "../../../model/positioning/special-marking-type";
import {PlagCaseItemComponent} from "../../plag-case-item/plag-case-item.component";
import {FormsModule} from "@angular/forms";
import {MarkingOffsets} from "../../../model/positioning/marking-offsets";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-plag-case-editor-card",
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    PlagCaseItemComponent,
    FormsModule,
    NgIf

  ],
  templateUrl: "./plag-case-editor-card.component.html",
  styleUrl: "./plag-case-editor-card.component.css"
})
export class PlagCaseEditorCardComponent {

  @Output() public exportEventEmitter = new EventEmitter<SpecialMarking[]>();

  @Output() public firstEditorSelectionEventEmitter = new EventEmitter<MarkingOffsets>();

  public plagCases = signal<SpecialMarking[]>([]);

  public selectedPlagCase = signal<SpecialMarking | null>(null);

  public focusedFieldUpdater = signal<((value: number) => void) | null>(null);

  public plagCaseCounter = 0;

  public onPlagCaseDelete(plagCase: SpecialMarking) {
    console.log("Deleting Plag Case ", plagCase);
    const targetId = this.plagCaseId(plagCase);
    this.plagCases.update(a => a.filter(p => this.plagCaseId(p) !== targetId));
    this.plagCases.update(a => a.sort((a, b) => this.plagCaseToString(a).localeCompare(this.plagCaseToString(b))));
  }

  public plagCaseId(plagCase: SpecialMarking) {
    //@ts-expect-error will have it :)
    return plagCase._id!;
  }

  public plagCaseToString(plagCase: SpecialMarking) {
    return `${plagCase.first.start}:${plagCase.first.end}-${plagCase.second!.start}:${plagCase.second!.end}`;
  }

  public addPlagCase() {
    const plagCase: SpecialMarking & { _id: number } = {
      _id: this.plagCaseCounter++,
      type: SpecialMarkingType.PLAG,
      first: {
        start: 0,
        end: 0,
        length: 0,
      },
      second: {
        start: 0,
        end: 0,
        length: 0,
      },
      comments: []
    };

    const newId = this.plagCaseId(plagCase);
    if (!this.plagCases().find(p => this.plagCaseId(p) == newId)) {
      this.plagCases.update(a =>
        ([...a, plagCase]).sort(
          (a, b) => this.plagCaseToString(a).localeCompare(this.plagCaseToString(b)))
      );
    }
  }

  public onPlagCaseEdit(plagCase: SpecialMarking) {
    this.selectedPlagCase.set(plagCase);
  }

  public onExport() {
    console.log(this.plagCases());
    this.exportEventEmitter.emit(this.plagCases());
    this.plagCases().sort(
      (a, b) => this.plagCaseToString(a).localeCompare(this.plagCaseToString(b))
    );
  }

  public updateFocusedField(value: number) {
    const updater = this.focusedFieldUpdater();
    if (updater) {
      updater(value);
      this.focusedFieldUpdater.set(null);
    }
  }

  public onFocusFirstStartField() {
    this.focusedFieldUpdater.set(val => this.selectedPlagCase()!.first.start = val);
  }

  public onFocusSecondStartField() {
    this.focusedFieldUpdater.set(val => this.selectedPlagCase()!.second!.start = val);
  }

  public onFocusFirstEndField() {
    this.focusedFieldUpdater.set(val => this.selectedPlagCase()!.first.end = val);
  }

  public onFocusSecondEndField() {
    this.focusedFieldUpdater.set(val => this.selectedPlagCase()!.second!.end = val);
  }

  public collectChanges() {
    console.log("Collecting");
    const selectedPlagCase = this.selectedPlagCase();
    if (selectedPlagCase) {
      this.makeOffsetsValid([selectedPlagCase.first, selectedPlagCase.second!]);
    }
  }

  public canExport() {
    for (const plagCase of this.plagCases()) {
      if (!this.isValidMarking(plagCase)) {
        return false;
      }
    }

    return true;
  }

  public isValidMarking(marking: SpecialMarking) {
    return this.isValidOffset(marking.first) && this.isValidOffset(marking.second!);
  }

  public isValidOffset(offset: MarkingOffsets) {
    return offset.end - offset.start > 0;
  }

  public makeOffsetsValid(offsets: MarkingOffsets[]) {
    offsets.forEach(offset => {
      offset.length = offset.end - offset.start;
    });
  }

}
