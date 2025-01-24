import {Component, effect, OnInit, signal} from "@angular/core";
import {AnalysisContextService} from "../../context/analysis-context.service";
import {ActivatedRoute} from "@angular/router";
import {SubmissionPair} from "../../model/submission-pair";
import {Submission} from "../../model/submission";
// import {EditorComponent} from "ngx-monaco-editor-v2";
import {FormsModule} from "@angular/forms";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {editor, Range} from "monaco-editor";
import {PlagCase} from "../../model/plag-case";
import {PlagCaseSide} from "../../model/plag-case-side";
import {MonacoPosition} from "../../model/monaco-position";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

@Component({
  selector: "app-submission-pair-view-page",
  imports: [
    // EditorComponent,
    FormsModule,
    EditorComponent,
    TitledSurfaceComponent
  ],
  templateUrl: "./submission-pair-view-page.component.html",
  styleUrl: "./submission-pair-view-page.component.css"
})
export class SubmissionPairViewPageComponent implements OnInit {

  protected pairId = signal<string | null>(null);

  protected submissionPair = signal<SubmissionPair | null>(null);

  protected first = signal<Submission | null>(null);

  protected second = signal<Submission | null>(null);

  protected editorOptions = {
    theme: "vs-white",
    language: "plaintext",
    readOnly: true
  };

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
        const firstSubmission = this.analysisContext.getReport()()!.submissions!.get(pair.firstId)!;
        this.first.set(firstSubmission);
        const secondSubmission = this.analysisContext.getReport()()!.submissions!.get(pair.secondId)!;
        this.second.set(secondSubmission);
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pairId.set(params.get("id"));
    });
  }


  protected initEditor(editor: editor.IStandaloneCodeEditor, content: string | undefined, side: 0 | 1): void {
    if (content === undefined || this.submissionPair() === null) {
      return;
    }

    for (const plagCase of this.submissionPair()!.plagCases) {
      const plagCaseSide = this.getPlagCaseSide(plagCase, side);
      console.log(plagCaseSide);
      const plagStart = this.getLineColumnFromOffset(content, plagCaseSide.startOffset);
      console.log(plagStart);
      const plagEnd = this.getLineColumnFromOffset(content, plagCaseSide.endOffset);
      console.log(plagEnd);
      editor.createDecorationsCollection(
        [
          {
            range: new Range(plagStart.line, plagStart.column, plagEnd.line, plagEnd.column),
            options: {
              inlineClassName: "highlight",
              hoverMessage: { value: "Plagiarized fragment" }
            }
          }
        ]
      );
    }

  }

  protected getLineColumnFromOffset(content: string, offset: number): MonacoPosition {
    const lines = content.split("\n");
    let remainingOffset = offset;
    for (let i = 0; i < lines.length; i++) {
      if (remainingOffset <= lines[i].length) {
        return { line: i + 1, column: remainingOffset + 1 };
      }
      remainingOffset -= lines[i].length + 1; // Account for the newline character
    }
    return { line: lines.length, column: lines[lines.length - 1].length + 1 };
  }

  protected getPlagCaseSide(plagCase: PlagCase, side: 0 | 1): PlagCaseSide {
    if (side === 0) {
      return {
        startOffset: plagCase.firstStart,
        endOffset: plagCase.firstEnd,
        length: plagCase.firstLen
      } as PlagCaseSide;
    }

    return {
      startOffset: plagCase.secondStart,
      endOffset: plagCase.secondEnd,
      length: plagCase.secondLen
    } as PlagCaseSide;
  }

}
