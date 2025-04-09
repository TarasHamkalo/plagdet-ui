import {ChangeDetectorRef, Component, computed, effect, OnInit, signal} from "@angular/core";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {
  SubmissionDiffEditorComponent
} from "../../../components/editors/submission-diff-editor/submission-diff-editor.component";
import {ActivatedRoute} from "@angular/router";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {Submission} from "../../../model/submission";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {
  FloatingToolbarComponent
} from "../../../components/floating-toolbar/floating-toolbar.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {map, Observable, startWith} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: "app-submissions-diff-view-page",
  imports: [
    SurfaceComponent,
    SubmissionDiffEditorComponent,
    ContentContainerComponent,
    FloatingToolbarComponent,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    AsyncPipe,
    MatOption,
    MatLabel
  ],
  templateUrl: "./submissions-diff-view-page.component.html",
  styleUrl: "./submissions-diff-view-page.component.css"
})
export class SubmissionsDiffViewPageComponent implements OnInit {

  protected firstId = signal<number | null>(null);

  protected secondId = signal<number | null>(null);

  protected first = signal<Submission | null>(null);

  protected second = signal<Submission | null>(null);

  protected firstDocumentFormControl = new FormControl<Submission | null>(null);

  protected secondDocumentFormControl = new FormControl<Submission | null>(null);

  protected firstFilteredOptions!: Observable<Submission[]>;

  protected secondFilteredOptions!: Observable<Submission[]>;

  protected submissionOptions = computed<Submission[]>(() => {
    const report = this.analysisContextService.getReport()();
    if (report) {
      return Array.from(report.submissions.values());
    }
    return [];
  });

  private updateFormControl = false;

  protected isOldEditor = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private analysisContextService: AnalysisContextService,
    private route: ActivatedRoute
  ) {
    this.analysisContextService = analysisContextService;
    effect(() => {
      if (this.firstId() === null || this.secondId() === null) {
        return;
      }
      this.isOldEditor = true;
      this.changeDetector.detectChanges();
      setTimeout(() => {
        this.isOldEditor = false;
        const report = this.analysisContextService.getReport()();
        if (!report) {
          return;
        }

        const firstSubmission = report.submissions.get(this.firstId()!);
        const secondSubmission = report.submissions.get(this.secondId()!);
        if (!firstSubmission || !secondSubmission) {
          return;
        }

        this.first.set(firstSubmission);
        this.second.set(secondSubmission);

        if (this.updateFormControl) {
          this.updateFormControl = false;
          this.firstDocumentFormControl.setValue(firstSubmission);
          this.secondDocumentFormControl.setValue(secondSubmission);
        }
      }, 500);
    });
  }


  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.firstId.set(Number.parseInt(params.get("firstId")!));
      this.secondId.set(Number.parseInt(params.get("secondId")!));
      this.updateFormControl = true;
    });

    this.firstDocumentFormControl.valueChanges.subscribe(
      (s: Submission | null) => this.firstId.set(s !== null ? s.id : null)
    );
    this.secondDocumentFormControl.valueChanges.subscribe(
      (s: Submission | null) => this.secondId.set(s !== null ? s.id : null)
    );
    this.firstFilteredOptions = this.firstDocumentFormControl.valueChanges
      .pipe(startWith(""), map(value => this.filter(value || "")));

    this.secondFilteredOptions = this.secondDocumentFormControl.valueChanges
      .pipe(
        startWith(""),
        map(value => this.filter(value || ""))
      );
  }

  private filter(value: any) {
    if (typeof value !== "string") {
      return this.submissionOptions();
    }

    const filterValue = value.toLowerCase();
    return this.submissionOptions().filter(s => {
      const hasSubmitter = s.fileData.submitter.toLowerCase().includes(filterValue);
      const hasFile = s.fileData.filename.toLowerCase().includes(filterValue);
      return hasSubmitter || hasFile;
    });
  }

  public displaySubmission(submission: Submission | null) {
    if (submission) {
      return `${submission?.fileData.submitter} [${submission?.fileData.filename}]`;
    }

    return "";

  }
}
