import {Component, effect, Input, OnDestroy, signal, Signal} from "@angular/core";
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

  protected editor = signal<IStandaloneCodeEditor | null>(null);

  @Input({required: true}) public submission!: Signal<Submission | null>;

  @Input({required: true}) public markingSide!: 0 | 1;

  @Input({required: false}) public plagCases: Signal<SpecialMarking[] | null> | null = null;

  constructor(private monacoDecorationService: MonacoDecorationService) {
    effect(() => {
      if (!this.editor() || !this.submission()) {
        return;
      }

      const decorations = this.createDecorations();
      timer(100)
        .pipe(
          first(),
          switchMap(() => of(decorations))
        )
        .subscribe((decorations) => {
          this.editor()?.createDecorationsCollection(decorations);
        });
    });
  }

  private createDecorations(): IModelDeltaDecoration[] {
    const decorations: IModelDeltaDecoration[] = [];
    const plagCases = this.plagCases ? this.plagCases() : null;
    if (plagCases) {
      decorations.push(...this.monacoDecorationService.createDecorationsFromMarking(
        this.editor()!, plagCases, this.markingSide
      ));
    }
    decorations.push(...this.monacoDecorationService.createDecorationsFromMarking(
      this.editor()!, this.submission()!.markings, 0
    ));
    return decorations;
  }

  protected initEditor(editor: IStandaloneCodeEditor) {
    if (!this.editor()) {
      this.editor.set(editor);
    }
  }

  public ngOnDestroy(): void {
    const editor = this.editor();
    if (editor) {
      editor.dispose();
    }
  }
}
