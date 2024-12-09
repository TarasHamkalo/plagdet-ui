import {Component, computed, inject, Input, OnInit} from "@angular/core";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {
  ConfigurationOptionsComponent
} from "../../components/configuration-options/configuration-options.component";
import {AnalysisContextService} from "../../services/analysis-context.service";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {StopPropagationDirective} from "../../directives/stop-propagation.directive";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {
  ViewAnalysisModalComponent
} from "../../components/view-analysis-modal/view-analysis-modal.component";

@Component({
  selector: "app-configuration-page",
  imports: [
    TitledSurfaceComponent,
    ConfigurationOptionsComponent,
    MatFormField,
    MatInput,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatSuffix,
    StopPropagationDirective,
    MatButton,
    MatError,
    ReactiveFormsModule
  ],
  templateUrl: "./configuration-page.component.html",
  styleUrl: "./configuration-page.component.css"
})
export class ConfigurationPageComponent implements OnInit {

  public readonly analysisNameControl = new FormControl(
    "", [Validators.required, Validators.minLength(3)]
  );

  @Input() public formFieldLabel = "Názov analýzy";

  @Input() public errorMessage = "Je potrebné nastaviť názov";

  @Input() public cancelText = "Zrušiť";

  @Input() public confirmText = "Analyzovať";

  private dialog: MatDialog = inject(MatDialog);

  constructor(private analysisContext: AnalysisContextService,
              private router: Router) {
  }

  ngOnInit() {
    this.analysisNameControl.setValue(this.analysisContext.getAnalysisName()());
  }

  onCancel() {
    this.router.navigate(["/upload"]);
  }


  selected = computed(() => this.analysisContext.getConfigurationOptions()().reduce(
    (agg, cur) => agg + (cur.selected ? 1 : 0),
    0
  ));
  onProceed() {
    const dialogRef = this.dialog.open(ViewAnalysisModalComponent, {
      width: "50%",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // always be not null after validation succeed
        this.analysisContext.getAnalysisName().set(this.analysisNameControl.value ?? "");

        this.router.navigate(["/analysis"]);
      } else {
        this.router.navigate(["/upload"]);
      }

    });

    // const analysisName = this.analysisNameControl.getRawValue();
    // if (analysisName) {
    //   this.analysisContext.getAnalysisName().set(analysisName);
    //   this.router.navigate(['/analysis']);
    // }
  }
}
