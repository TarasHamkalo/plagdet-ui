import {Component, Input, OnDestroy} from "@angular/core";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {editor} from "monaco-editor";
import {Submission} from "../../model/submission";
import {FormsModule} from "@angular/forms";
import {MonacoDecorationService} from "../../services/monaco-decoration.service";
import {first, of, switchMap, timer} from "rxjs";
import {SpecialMarking} from "../../model/positioning/special-marking";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;

@Component({
  selector: "app-text-editor",
  imports: [
    EditorComponent,
    FormsModule
  ],
  templateUrl: "./text-editor.component.html",
  styleUrl: "./text-editor.component.css"
})

export class TextEditorComponent implements OnDestroy {

  protected editorOptions = {
    theme: "vs-white",
    language: "plaintext",
    readOnly: true,
    wordWrap: "on",
    wrappingIndent: "same",
    wordWrapBreakBeforeCharacters: "{([",
    wordWrapBreakAfterCharacters: " \t})"
  };

  protected editor: IStandaloneCodeEditor | null = null;

  @Input({required: true}) public submission!: Submission;

  @Input({required: true}) public markingSide!: 0 | 1;

  @Input({required: false}) public plagCases: SpecialMarking[] | null = null;

  constructor(private monacoDecorationService: MonacoDecorationService) {
  }

  protected initEditor(editor: IStandaloneCodeEditor) {
    if (!this.editor) {
      this.editor = editor;
      timer(100, 100)
        .pipe(
          first(),
          switchMap(() => {
            const decorations: IModelDeltaDecoration[] = [];
            if (this.plagCases) {
              decorations.push(...this.monacoDecorationService.createDecorationsFromMarking(
                this.editor!, this.plagCases, this.markingSide
              ));
            }

            decorations.push(...this.monacoDecorationService.createDecorationsFromMarking(
              this.editor!, this.submission.markings, this.markingSide
            ));

            return of(decorations);
          })
        )
        .subscribe((decorations) => {
          this.editor?.createDecorationsCollection(decorations);
        });
    }
  }

  public ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}
