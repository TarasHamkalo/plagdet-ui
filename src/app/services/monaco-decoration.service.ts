import {Injectable} from "@angular/core";
import {SpecialMarking} from "../model/positioning/special-marking";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import {MarkingOffsets} from "../model/positioning/marking-offsets";
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import {MonacoPosition} from "../types/monaco-position";
import {editor, Range} from "monaco-editor";

@Injectable({
  providedIn: "root"
})
export class MonacoDecorationService {

  public readonly markingTypeToDecorationOptions: Record<string, editor.IModelDecorationOptions> = {
    "PLAG": {
      inlineClassName: "highlight-plag",
      hoverMessage: {value: "Plagiarized fragment"}
    },
    "CODE": {
      inlineClassName: "highlight-code",
      hoverMessage: {value: "Code fragment"}
    },
    "TEMPLATE": {
      inlineClassName: "highlight-template",
      hoverMessage: {value: "Template fragment"}
    },
    "MISSPELLED": {
      inlineClassName: "highlight-misspelled",
      hoverMessage: {value: "Misspelled fragment"}
    }
  };

  public createDecorationsFromMarking(
    editor: IStandaloneCodeEditor,
    markings: SpecialMarking[],
    markingSide: 0 | 1
  ): IModelDeltaDecoration[] {

    const decorations: IModelDeltaDecoration[] = [];
    for (const specialMarking of markings) {
      const markingOffsets = this.getMarkingOffset(specialMarking, markingSide);
      const start = this.getLineColumnFromOffset(editor.getValue(), markingOffsets.start);
      const end = this.getLineColumnFromOffset(editor.getValue(), markingOffsets.end);
      decorations.push(
        {
          range: new Range(start.line, start.column, end.line, end.column),
          options: this.markingTypeToDecorationOptions[specialMarking.type]
        }
      );
    }

    return decorations;
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

}
