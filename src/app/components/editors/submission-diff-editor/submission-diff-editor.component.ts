import {Component, Input, OnChanges, OnDestroy, signal} from "@angular/core";
import {editor} from "monaco-editor";
import {Submission} from "../../../model/submission";
import {DiffEditorComponent, DiffEditorModel} from "ngx-monaco-editor-v2";
import {
  InfiniteLoadCardComponent
} from "../../cards/infinite-load-card/infinite-load-card.component";
import {NgIf} from "@angular/common";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


@Component({
  selector: "app-submission-diff-editor",
  imports: [
    DiffEditorComponent,
    InfiniteLoadCardComponent,
    NgIf
  ],
  templateUrl: "./submission-diff-editor.component.html",
  styleUrl: "./submission-diff-editor.component.css"
})
export class SubmissionDiffEditorComponent implements OnDestroy, OnChanges {

  protected editorOptions = {
    theme: "vs-white",
    language: "plaintext",
    readOnly: true,
    wordWrap: "on",
    wrappingIndent: "same",
    wordWrapBreakBeforeCharacters: "{([",
    wordWrapBreakAfterCharacters: " \t})",
    originalEditable: false,
    modifiedEditable: false
  };

  @Input({required: true}) public first!: Submission;

  @Input({required: true}) public second!: Submission;

  protected editor = signal<IStandaloneCodeEditor | null>(null);

  protected isLoading = signal<boolean>(false);

  protected firstModel = signal<DiffEditorModel | undefined>(undefined);

  protected secondModel = signal<DiffEditorModel | undefined>(undefined);

  protected initEditor(editor: IStandaloneCodeEditor) {
    if (!this.editor()) {
      this.editor.set(editor);

      //@ts-expect-error Not documented event... all other documented, are not actually defined
      editor.onDidUpdateDiff(() => {
        this.isLoading.set(false);
      });
      // editor.onDidChangeDecorations
    }
  }

  public ngOnDestroy(): void {
    const editor = this.editor();
    if (editor) {
      editor.dispose();
    }
  }

  public ngOnChanges() {
    if (this.first?.content && this.second?.content) {
      this.isLoading.set(true);
      this.firstModel.set({
        code: this.first.content,
        language: "plaintext"
      });

      this.secondModel.set({
        code: this.second.content,
        language: "plaintext"
      });

    }
  }

}