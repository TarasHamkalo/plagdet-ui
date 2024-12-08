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
import {MatChip} from "@angular/material/chips";

@Component({
  selector: 'app-configuration-options',
  imports: [
    MatListOption,
    MatListItemLine,
    MatSelectionList,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatListItemTitle,
    MatChip,
  ],
  templateUrl: './configuration-options.component.html',
  styleUrl: './configuration-options.component.css'
})
export class ConfigurationOptionsComponent implements OnInit {

  @Input() public title = '';

  @Input() public subTitle = '';

  @Input() public hasToLoadFromContext = true;

  @Input() public variant: 'chip' | 'select' = 'select';

  @Input() public configurationOptions = signal<ConfigurationOption[]>([]);

  constructor(private analysisContextService: AnalysisContextService) {}

  ngOnInit() {
    if (this.hasToLoadFromContext) {
      this.configurationOptions = this.analysisContextService.getConfigurationOptions()
    }

    this.title =
      this.variant === 'chip' ? 'Vlastnosti analýzy' : 'Základné možnosti';
    this.subTitle =
      this.variant === 'chip'
        ? 'Vlastnosti nastavené počas procesu konfigurácie'
        : '';
    console.log(this.configurationOptions());
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
