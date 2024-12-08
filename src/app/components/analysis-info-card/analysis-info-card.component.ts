import {Component, OnInit, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemIcon, MatListItemTitle} from "@angular/material/list";
import {MatDivider} from "@angular/material/divider";
import {AnalysisService} from "../../services/analysis.service";
import {Analysis} from "../../model/analysis";
import {DatePipe, DecimalPipe} from "@angular/common";
import {MatChip, MatChipTrailingIcon} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";
import {
  ConfigurationOptionsComponent
} from "../configuration-options/configuration-options.component";
import {ConfigurationOption} from "../../model/configuration-option";

@Component({
  selector: 'app-analysis-info-card',
  imports: [
    MatIcon,
    MatList,
    MatListItem,
    MatDivider,
    MatListItemTitle,
    MatListItemIcon,
    DatePipe,
    DecimalPipe,
    MatChip,
    MatTooltip,
    MatChipTrailingIcon,
    ConfigurationOptionsComponent
  ],
  templateUrl: './analysis-info-card.component.html',
  styleUrl: './analysis-info-card.component.scss'
})
export class AnalysisInfoCardComponent implements OnInit {

  public analysis = signal<Partial<Analysis>>({});

  public configurationUsed = signal<ConfigurationOption[]>([]);

  constructor(private analysisService: AnalysisService) {
  }

  ngOnInit() {
    this.analysisService.analyze().subscribe(analysis => {
      console.log(`This analysis options ${analysis.configurationUsed}`);
      this.analysis.set(analysis)
      this.configurationUsed.set(this.analysis().configurationUsed ?? [])
    })

  }

}
