import { Component } from '@angular/core';
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {
  ConfigurationOptionsComponent
} from "../../components/configuration-options/configuration-options.component";
import {AnalysisContextService} from "../../services/analysis-context.service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-configuration-page',
  imports: [
    TitledSurfaceComponent,
    ConfigurationOptionsComponent,
    MatButton
  ],
  templateUrl: './configuration-page.component.html',
  styleUrl: './configuration-page.component.css'
})
export class ConfigurationPageComponent {

  constructor(private analysisContext: AnalysisContextService) {}

  logOptions() {
    this.analysisContext.getConfigurationOptions().apply((o: any) => {
      console.log(o);
    })
  }

}
