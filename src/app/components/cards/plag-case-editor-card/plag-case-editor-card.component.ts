import {Component, signal} from "@angular/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SpecialMarking} from "../../../model/positioning/special-marking";
import {SpecialMarkingType} from "../../../model/positioning/special-marking-type";
import {PlagCaseItemComponent} from "../../plag-case-item/plag-case-item.component";

@Component({
  selector: "app-plag-case-editor-card",
  imports: [
    MatIconButton,
    MatIcon,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    PlagCaseItemComponent

  ],
  templateUrl: "./plag-case-editor-card.component.html",
  styleUrl: "./plag-case-editor-card.component.css"
})
export class PlagCaseEditorCardComponent {

  public plagCases = signal<SpecialMarking[]>([]);

  private plagCaseCounter = 0;

  public onPlagCaseDelete(plagCase: SpecialMarking) {
    const targetId = this.plagCaseId(plagCase);
    this.plagCases.update(p => p.filter(p => this.plagCaseId(p) !== targetId));
  }

  public plagCaseId(plagCase: SpecialMarking) {
    //@ts-expect-error will have it :)
    return plagCase._id!;
    // return `${plagCase.first.start}:${plagCase.first.end}-${plagCase.second!.start}:${plagCase.second!.end}`;
  }


  public addPlagCase() {
    const plagCase: SpecialMarking & {_id: number} = {
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
      this.plagCases.update(a => [...a, plagCase]);
    }
  }

  public onPlagCaseEdit(plagCase: SpecialMarking) {
    console.log(plagCase);
  }

  public onExport() {
    console.log(this.plagCases());
  }
}
