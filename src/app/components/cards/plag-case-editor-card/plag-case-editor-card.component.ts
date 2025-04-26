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

  @Output() public secondEditorSelectionEventEmitter = new EventEmitter<MarkingOffsets>();

  @Output() public firstEditorRemoveSelectionEvent = new EventEmitter<MarkingOffsets>();

  @Output() public secondEditorRemoveSelectionEvent = new EventEmitter<MarkingOffsets>();

  public plagCases = signal<SpecialMarking[]>([]);

  public selectedPlagCase = signal<SpecialMarking | null>(null);

  public focusedFieldUpdater = signal<((value: number) => void) | null>(null);

  public plagCaseCounter = 0;

  private collectChangesTimeout: NodeJS.Timeout | null = null;

  public onPlagCaseDelete(plagCase: SpecialMarking) {
    console.log("Deleting Plag Case ", plagCase);
    const targetId = this.plagCaseId(plagCase);
    const plagCasesCount = this.plagCases().length;
    this.plagCases.update(a => a.filter(p => this.plagCaseId(p) !== targetId));
    this.plagCases.update(a => a.sort((a, b) => this.plagCaseToString(a).localeCompare(this.plagCaseToString(b))));
    if (this.plagCases().length < plagCasesCount) {
      if (this.isValidOffset(plagCase.first)) {
        this.firstEditorRemoveSelectionEvent.emit(plagCase.first);
      }
      if (this.isValidOffset(plagCase.second!)) {
        this.secondEditorRemoveSelectionEvent.emit(plagCase.second!);
      }
    }

    const selectedCopy = this.selectedPlagCase();
    if (selectedCopy && this.plagCaseId(selectedCopy) == targetId) {
      this.selectedPlagCase.set(null);
    }
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
      this.collectChanges();
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
    if (this.collectChangesTimeout) {
      clearTimeout(this.collectChangesTimeout);
    }

    this.collectChangesTimeout = setTimeout(() => {
      console.log("collecting");
      const selectedPlagCase = this.selectedPlagCase();
      if (selectedPlagCase) {
        console.log("selectedPlagCase", selectedPlagCase);
        this.deriveLength([selectedPlagCase.first, selectedPlagCase.second!]);
        if (this.isValidOffset(selectedPlagCase.first)) {
          console.log("calling");
          this.firstEditorSelectionEventEmitter.emit(selectedPlagCase.first);
        }
        if (this.isValidOffset(selectedPlagCase.second!)) {
          console.log("calling");
          this.secondEditorSelectionEventEmitter.emit(selectedPlagCase.second!);
        }
      }
    }, 2500);
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

  public deriveLength(offsets: MarkingOffsets[]) {
    offsets.forEach(offset => {
      offset.length = offset.end - offset.start;
    });
  }

}
