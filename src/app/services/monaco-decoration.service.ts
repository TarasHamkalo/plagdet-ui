import {Injectable} from "@angular/core";
import {SpecialMarking} from "../model/positioning/special-marking";
import {MarkingOffsets} from "../model/positioning/marking-offsets";
import {MonacoPosition} from "../types/monaco-position";
import {editor, Range} from "monaco-editor";
import {SpecialMarkingType} from "../model/positioning/special-marking-type";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;

@Injectable({
  providedIn: "root"
})
export class MonacoDecorationService {

  public readonly markingTypeToDecorationOptions: Record<SpecialMarkingType, editor.IModelDecorationOptions> = {
    [SpecialMarkingType.PLAG]: {
      inlineClassName: "highlight-plag",
      hoverMessage: {value: "Spoločný fragment"},
      zIndex: 1
    },
    [SpecialMarkingType.CODE]: {
      inlineClassName: "highlight-code",
      hoverMessage: {value: "Fragment kódu"},
      zIndex: 5
    },
    [SpecialMarkingType.TEMPLATE]: {
      inlineClassName: "highlight-template",
      hoverMessage: {value: "Text zadania"},
      zIndex: 2
    },
    [SpecialMarkingType.MISSPELLED]: {
      inlineClassName: "highlight-misspelled",
      zIndex: 3
    },
    [SpecialMarkingType.SPOOF]: {
      inlineClassName: "highlight-spoof",
      hoverMessage: {value: "Boli použité iné ako latinské znaky (Unicode Look-Alike)"},
      zIndex: 3
    }
  };

  public createDecorationsFromMarking(
    editor: IStandaloneCodeEditor,
    markings: SpecialMarking[],
    markingSide: 0 | 1,
  ): IModelDeltaDecoration[] {

    const decorations: IModelDeltaDecoration[] = [];

    for (const specialMarking of markings) {
      const markingOffsets = this.getMarkingOffset(specialMarking, markingSide);
      const start = this.getLineColumnFromOffset(editor.getValue(), markingOffsets.start);
      const end = this.getLineColumnFromOffset(editor.getValue(), markingOffsets.end);
      decorations.push({
        range: new Range(start.line, start.column, end.line, end.column),
        options: this.getOptionsForSpecialMarking(specialMarking),
      });
    }

    return decorations;
  }

  public getOptionsForSpecialMarking(specialMarking: SpecialMarking) {
    if (specialMarking.type === SpecialMarkingType.MISSPELLED) {
      return {
        ...this.markingTypeToDecorationOptions[specialMarking.type],
        hoverMessage: {value: `Pravdepodobný preklep [${specialMarking.comments || ""}]`}
      };
    } else if (specialMarking.type === SpecialMarkingType.PLAG) {
      return {
        ...this.markingTypeToDecorationOptions[specialMarking.type],
        hoverMessage: {
          value: `Spoločný fragment [${specialMarking.first.start}:${specialMarking.first.end}:${specialMarking.second!.start}:${specialMarking.second!.end}]`
        }
      };
    }

    return this.markingTypeToDecorationOptions[specialMarking.type];
  }

  public getMarkingOffset(marking: SpecialMarking, side: 0 | 1): MarkingOffsets {
    if (side == 0) {
      return marking.first;
    }

    return marking.second!;
  }


  protected getLineColumnFromOffset(content: string, offset: number): MonacoPosition {
    const lines = content.split("\n");
    let remainingOffset = offset;
    for (let i = 0; i < lines.length; i++) {
      if (remainingOffset <= lines[i].length) {
        return {line: i + 1, column: remainingOffset + 1};
      }
      remainingOffset -= lines[i].length + 1; // Account for the newline character
    }
    return {line: lines.length, column: lines[lines.length - 1].length + 1};
  }

  public navigateToOffset(
    editor: editor.IStandaloneCodeEditor | null,
    marking: SpecialMarking,
    markingSide: 0 | 1
  ) {
    if (editor == null) {
      return;
    }
    const offset = this.getMarkingOffset(marking, markingSide);
    const position = this.getLineColumnFromOffset(editor.getModel()!.getValue(), offset.start);
    console.log("navigation to line " + position.line);
    editor.setScrollTop(position.line);
    editor.revealLineInCenter(position.line);
    editor.setPosition({lineNumber: position.line, column: position.column});
  }

  public hashCode(str: string): number {
    const MOD = 728437125089;
    const RAND_P = 22570092147931;
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * RAND_P + str.charCodeAt(i)) % MOD;
    }

    return h % MOD;
  }
}
