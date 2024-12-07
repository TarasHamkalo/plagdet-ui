import {Component, computed, Input, signal} from '@angular/core';
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {
  ConfigurationOptionsComponent
} from "../../components/configuration-options/configuration-options.component";
import {AnalysisContextService} from "../../services/analysis-context.service";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {StopPropagationDirective} from "../../directives/stop-propagation.directive";
import {FileWrapper} from "../../model/file-wrapper.type";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatActionList, MatListItem} from "@angular/material/list";

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
    MatActionList,
    MatButton,
    MatListItem
  ],
  templateUrl: './configuration-page.component.html',
  styleUrl: './configuration-page.component.css'
})
export class ConfigurationPageComponent {

  public uploadedFile = signal<Partial<FileWrapper>>({})

  @Input() public placeHolderText: string = "Nastavte názov analýzy";

  @Input() public formFieldLabel: string = "Názov analýzy";

  public countSelected = computed(() => this.analysisContext.getConfigurationOptions()().reduce(
    (acc, option) => acc + (option.selected ? 1 : 0), 0
  ));

  constructor(private analysisContext: AnalysisContextService) {
  }

  ngOnInit() {
    this.uploadedFile = this.analysisContext.getUploadedFile()
    console.log(this.uploadedFile())
    this.placeHolderText = this.uploadedFile().name ?? "Nastavte názov analýzy";
  }

}
