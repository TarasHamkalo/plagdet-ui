import {Component, effect, OnDestroy, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {ActivatedRoute} from "@angular/router";
import {SubmissionPair} from "../../model/submission-pair";
import {Submission} from "../../model/submission";
import {FormsModule} from "@angular/forms";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {editor, Range} from "monaco-editor";
import {MarkingOffsets} from "../../model/positioning/marking-offsets";
import {MonacoPosition} from "../../types/monaco-position";
import {first, timer} from "rxjs";
import {SpecialMarking} from "../../model/positioning/special-marking";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import IEditorDecorationsCollection = editor.IEditorDecorationsCollection;


@Component({
  selector: "app-submission-pair-view-page",
  imports: [
    FormsModule,
    EditorComponent,
    SurfaceComponent
  ],
  templateUrl: "./submission-pair-view-page.component.html",
  styleUrl: "./submission-pair-view-page.component.css"
})
export class SubmissionPairViewPageComponent implements OnInit, OnDestroy {

  protected pairId = signal<string | null>(null);

  protected submissionPair = signal<SubmissionPair | null>(null);

  protected first = signal<Submission | null>(null);

  protected second = signal<Submission | null>(null);

  protected editorOptions = {
    theme: "vs-white",
    language: "plaintext",
    readOnly: true,
    wordWrap: "on",
    wrappingIndent: "same",
    wordWrapBreakBeforeCharacters: "{([",
    wordWrapBreakAfterCharacters: " \t})"
  };

  private editors: IStandaloneCodeEditor[] = [];

  private decorationCollections: IEditorDecorationsCollection[] = [];

  constructor(protected analysisContext: AnalysisContextService,
              private route: ActivatedRoute) {
    effect(() => {
      console.log(this.pairId());
      if (this.pairId() === null) {
        return;
      }

      const pair = this.analysisContext.getReport()()!.pairs!.get(this.pairId()!);
      if (pair) {
        this.submissionPair.set(pair);
        console.log("update content");
        const firstSubmission = this.analysisContext.getReport()()!.submissions!.get(pair.firstId)!;
        this.first.set(firstSubmission);
        const secondSubmission = this.analysisContext.getReport()()!.submissions!.get(pair.secondId)!;
        this.second.set(secondSubmission);
      }
    });
  }

  public ngOnDestroy(): void {
    this.decorationCollections.forEach((collection) => collection.set([]));
    this.editors.forEach(editorInstance => {
      console.log("destroy editor");
      editorInstance.dispose();
    });

    this.decorationCollections = [];
    this.editors = [];
    this.pairId.set(null);
    this.submissionPair.set(null);
  }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pairId.set(params.get("id"));
    });
  }

  protected initEditor(editor: editor.IStandaloneCodeEditor, content: string | undefined, side: 0 | 1): void {
    if (content === undefined || this.submissionPair() === null) {
      return;
    }
    timer(
      100, 100
    ).pipe(first()).subscribe(() => {
      this.editors.push(editor);
      console.log("editor this is called");
      const decorations: IModelDeltaDecoration[] = [];
      console.log("this should be added ", this.submissionPair()!.plagCases);
      for (const specialMarking of this.submissionPair()!.plagCases) {
        const markingOffsets = this.getPlagCaseSide(specialMarking, side);
        const start = this.getLineColumnFromOffset(content, markingOffsets.start);
        const end = this.getLineColumnFromOffset(content, markingOffsets.end);
        decorations.push(
          {
            range: new Range(start.line, start.column, end.line, end.column),
            options: {
              inlineClassName: "highlight-plag",
              hoverMessage: {value: "Plagiarized fragment"}
            }
          }
        );
      }

      const specialMarkings: SpecialMarking[] = side == 0 ? this.first()!.markings : this.second()!.markings;
      for (const specialMarking of specialMarkings) {

        if (specialMarking.type === "CODE") {
          const markingOffsets = specialMarking.first;
          const start = this.getLineColumnFromOffset(content, markingOffsets.start);
          const end = this.getLineColumnFromOffset(content, markingOffsets.end);
          decorations.push(
            {
              range: new Range(start.line, start.column, end.line, end.column),
              options: {
                inlineClassName: "highlight-code",
                hoverMessage: {value: "Code fragment"}
              }
            }
          );
        } else {
          const markingOffsets = specialMarking.first;
          const start = this.getLineColumnFromOffset(content, markingOffsets.start);
          const end = this.getLineColumnFromOffset(content, markingOffsets.end);
          decorations.push(
            {
              range: new Range(start.line, start.column, end.line, end.column),
              options: {
                inlineClassName: "highlight-template",
                hoverMessage: {value: "Template fragment"}
              }
            }
          );
        }
      }

      console.log("decorations", decorations);
      const collection = editor.createDecorationsCollection(decorations);
      this.decorationCollections.push(collection);
    });
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

  protected getPlagCaseSide(plagCase: SpecialMarking, side: 0 | 1): MarkingOffsets {
    if (side === 0) {
      return plagCase.first;
    }

    return plagCase.second!;
  }

}
