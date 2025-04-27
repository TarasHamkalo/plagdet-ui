import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  signal
} from "@angular/core";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {editor} from "monaco-editor";
import {Submission} from "../../../model/submission";
import {FormsModule} from "@angular/forms";
import {MonacoDecorationService} from "../../../services/monaco-decoration.service";
import {concatMap, first, of, switchMap, takeWhile, throwError, timer} from "rxjs";
import {SpecialMarking} from "../../../model/positioning/special-marking";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {SpecialMarkingType} from "../../../model/positioning/special-marking-type";
import {EditorScrollEvent} from "../../../types/editor-scroll-event";
import {MatDialog} from "@angular/material/dialog";
import {ListPickerModalComponent} from "../../base/list-picker-modal/list-picker-modal.component";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;

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

  @Output() public scrollEventEmitter = new EventEmitter<EditorScrollEvent>();

  @Output() public navigatePlagCaseEventEmitter = new EventEmitter<SpecialMarking>();

  @Output() public forceUnsubscribeFromScrollEventEmitter = new EventEmitter<void>();

  protected decorationIdToMarking = new Map<string, SpecialMarking>();

  protected isScrollSyncEnabled = signal<boolean>(true);

  private dialog = inject(MatDialog);

  protected isModalOpened = false;

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
          const editor = this.editor();
          if (!editor) {
            return;
          }

          const model = editor.getModel();
          if (!model) {
            return;
          }

          const ids = model.deltaDecorations([], decorations);
          const mergedMarkings = (this.plagCases || []).concat(this.submission.markings);
          mergedMarkings.forEach((m, i) => this.decorationIdToMarking.set(ids[i], m));
        });
    });
  }

  public unsubscribeFromScrolling(): void {
    this.isScrollSyncEnabled.set(false);
  }

  public subscribeOnScrolling(eventEmitter: EventEmitter<EditorScrollEvent>): void {
    this.isScrollSyncEnabled.set(true);
    eventEmitter.pipe(takeWhile(() => this.isScrollSyncEnabled())).subscribe((e) => {
     this.editor()!.setScrollTop(e.scrollEvent.scrollTop);
      this.editor()!.setScrollLeft(e.scrollEvent.scrollLeft);
    });
  }

  public subscribeOnNavigationEvent(eventEmitter: EventEmitter<SpecialMarking>): void {
    eventEmitter.subscribe((e) => {
      if (e && e.type === SpecialMarkingType.PLAG) {
        this.unsubscribeFromScrolling();
        this.forceUnsubscribeFromScrollEventEmitter.emit();
        this.monacoDecorationService.navigateToOffset(this.editor(), e, this.markingSide);
      }
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

    editor.onDidScrollChange((e) => this.scrollEventEmitter.emit({
      scrollEvent: e,
      editor: editor
    }));

    editor.onMouseUp((e) => {
      e.event.stopPropagation();
      if (e.target.position) {
        const model = editor.getModel();
        if (!model) {
          return;
        }

        const position = e.target.position;
        const decorations = model.getDecorationsInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column + 1,
        });

        if (decorations.length > 0) {
          // TODO: there could be more than one
          const plagDecorations = decorations.filter(
            d => d.options.inlineClassName === "highlight-plag"
          );

          if (!this.isModalOpened && plagDecorations && plagDecorations.length > 0) {
            this.openNavigationDialog(plagDecorations);
          }
        }
      }
    });
  }

  protected openNavigationDialog(
    plagDecorations: editor.IModelDecoration[]
  ): void {
    console.log(plagDecorations);
    this.isModalOpened = true;
    const dialogRef = this.dialog.open(ListPickerModalComponent, {
      data: {
        title: "Zvoľte možnosť navigacie ",
        options: plagDecorations.map((value) => {
          return {
            //@ts-expect-error value is kinda defined in that md string
            label: value.options.hoverMessage?.value.toString(),
            value: value.id
          };
        })
      },
    });
    dialogRef.afterClosed().pipe(
      concatMap(choiceValue => {
        console.log(choiceValue);
        if (choiceValue !== undefined) {
          return of(choiceValue);
        }

        return throwError(() => new Error("Cancel plag case navigation"));
      })
    ).subscribe({
      next: (choiceValue) => {
        this.unsubscribeFromScrolling();
        this.forceUnsubscribeFromScrollEventEmitter.emit();
        this.navigatePlagCaseEventEmitter.emit(
          this.decorationIdToMarking.get(choiceValue)
        );
        this.isModalOpened = false;
      },
      error: (e) => {
        this.isModalOpened = false;
        console.error(e);
      }
    });
  }

  public ngOnDestroy(): void {
    const editor = this.editor();
    if (editor) {
      editor.dispose();
    }
  }
}
