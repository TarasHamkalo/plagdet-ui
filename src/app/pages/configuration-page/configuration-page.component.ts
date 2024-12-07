import {Component, Input, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-configuration-page',
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
  templateUrl: './configuration-page.component.html',
  styleUrl: './configuration-page.component.css'
})
export class ConfigurationPageComponent implements OnInit {

  public readonly analysisNameControl = new FormControl(
    '', [Validators.required, Validators.minLength(3)]
  );

  @Input() public formFieldLabel = 'Názov analýzy';

  @Input() public errorMessage = 'Je potrebné nastaviť názov';

  constructor(private analysisContext: AnalysisContextService,
              private router: Router) {
  }

  ngOnInit() {
    this.analysisNameControl.setValue(this.analysisContext.getAnalysisName()());
  }

  onCancel() {
    this.router.navigate(['/upload']);
  }

  onProceed() {
    const analysisName = this.analysisNameControl.getRawValue();
    if (analysisName) {
      this.analysisContext.getAnalysisName().set(analysisName);
      this.router.navigate(['/analysis']);
    }
  }
}
