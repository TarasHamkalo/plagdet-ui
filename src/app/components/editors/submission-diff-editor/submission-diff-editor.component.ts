import {Component, Input, OnChanges, OnDestroy, signal} from "@angular/core";
import {editor} from "monaco-editor";
import {Submission} from "../../../model/submission";
import {DiffEditorComponent, DiffEditorModel} from "ngx-monaco-editor-v2";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


@Component({
  selector: "app-submission-diff-editor",
  imports: [
    DiffEditorComponent
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
    modifiedEditable: false,
  };

  @Input({required: true}) public first!: Submission;

  @Input({required: true}) public second!: Submission;

  protected editor = signal<IStandaloneCodeEditor | null>(null);

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

  protected firstModel = signal<DiffEditorModel | undefined>(undefined);

  protected secondModel = signal<DiffEditorModel | undefined>(undefined);

  public ngOnChanges() {
    if (this.first?.content && this.second?.content) {

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