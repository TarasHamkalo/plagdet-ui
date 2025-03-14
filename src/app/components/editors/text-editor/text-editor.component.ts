import {Component, effect, EventEmitter, Input, OnDestroy, Output, signal} from "@angular/core";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {editor, IScrollEvent} from "monaco-editor";
import {Submission} from "../../../model/submission";
import {FormsModule} from "@angular/forms";
import {MonacoDecorationService} from "../../../services/monaco-decoration.service";
import {first, of, switchMap, takeWhile, timer} from "rxjs";
import {SpecialMarking} from "../../../model/positioning/special-marking";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: "app-text-editor",
  imports: [
    EditorComponent,
    FormsModule,
    MatIcon,
    NgIf,
    MatTooltip
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

  @Input({required: true}) public submission!: Submission;

  @Input({required: true}) public markingSide!: 0 | 1;

  @Input({required: false}) public plagCases: SpecialMarking[] | null = null;

  @Output() public scrollEventEmitter = new EventEmitter<IScrollEvent>();

  protected isScrollSyncEnabled = signal<boolean>(true);

  constructor(private monacoDecorationService: MonacoDecorationService) {
    effect(() => {
      if (!this.editor() || !this.submission) {
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

  public unsubscribeFromScrolling(): void {
    this.isScrollSyncEnabled.set(false);
  }

  public subscribeOnScrolling(eventEmitter: EventEmitter<IScrollEvent>): void {
    this.isScrollSyncEnabled.set(true);
    eventEmitter.pipe(takeWhile(() => this.isScrollSyncEnabled())).subscribe((e) => {
      this.editor()!.setScrollTop(e.scrollTop);
      this.editor()!.setScrollLeft(e.scrollLeft);
    });
  }

  private createDecorations(): IModelDeltaDecoration[] {
    const decorations: IModelDeltaDecoration[] = [];
    if (this.plagCases) {
      decorations.push(...this.monacoDecorationService.createDecorationsFromMarking(
        this.editor()!, this.plagCases, this.markingSide
      ));
    }
    decorations.push(...this.monacoDecorationService.createDecorationsFromMarking(
      this.editor()!, this.submission.markings, 0
    ));
    return decorations;
  }

  protected initEditor(editor: IStandaloneCodeEditor) {
    if (!this.editor()) {
      this.editor.set(editor);
    }

    editor.onDidScrollChange((e) => this.scrollEventEmitter.emit(e));
  }

  public ngOnDestroy(): void {
    const editor = this.editor();
    if (editor) {
      editor.dispose();
    }
  }
}
