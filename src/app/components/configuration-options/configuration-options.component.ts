import {Component, Input, OnInit, signal} from '@angular/core';
import {AnalysisContextService} from "../../services/analysis-context.service";
import {ConfigurationOption} from "../../model/configuration-option";
import {
  MatListItemLine,
  MatListItemTitle,
  MatListOption,
  MatSelectionList
} from "@angular/material/list";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-configuration-options',
  imports: [
    MatListOption,
    MatListItemLine,
    MatSelectionList,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatListItemTitle
  ],
  templateUrl: './configuration-options.component.html',
  styleUrl: './configuration-options.component.css'
})
export class ConfigurationOptionsComponent implements OnInit {

  public configurationOptions = signal<ConfigurationOption[]>([]);

  @Input() public title = "Základné možnosti";

  constructor(private analysisContextService: AnalysisContextService) {
  }

  ngOnInit() {
    this.configurationOptions = this.analysisContextService.getConfigurationOptions();
  }

  toggleOption(targetOption: ConfigurationOption) {
    this.configurationOptions.update(options => {
      return options.map(option => {
        if (option.displayTitle === targetOption.displayTitle) {
          return { ...option, selected: !option.selected };
        }

        return option;
      });
    });
  }

  resetToDefault() {
    this.configurationOptions.update(options => {
      return options.map(option => {
        return { ... option,  selected: option.selectByDefault};
      });
    });
  }
}
