import {Component, computed} from '@angular/core';
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {
  ConfigurationOptionsComponent
} from "../../components/configuration-options/configuration-options.component";
import {AnalysisContextService} from "../../services/analysis-context.service";

@Component({
  selector: 'app-configuration-page',
  imports: [
    TitledSurfaceComponent,
    ConfigurationOptionsComponent,
  ],
  templateUrl: './configuration-page.component.html',
  styleUrl: './configuration-page.component.css'
})
export class ConfigurationPageComponent {

  constructor(private analysisContext: AnalysisContextService) {}

  countSelected = computed(() => this.analysisContext.getConfigurationOptions()().reduce(
    (acc, option) => acc + (option.selected ? 1 : 0), 0
  ));

}
