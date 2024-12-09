import {Component, Input, OnInit, signal} from '@angular/core';
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
import {AnalysisContextService} from "../../services/analysis-context.service";

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

  @Input() public supportiveText = "V tejto časti sa zobrazujú informácie o analýze a o tom, aké parametre sa pri nej použili";

  public analysis = signal<Partial<Analysis>>({});

  constructor(private analysisContext: AnalysisContextService) {
  }

  ngOnInit() {
    console.log(this.analysisContext.getAnalysis()())
    this.analysis = this.analysisContext.getAnalysis();
    // this.analysisService.analyze().subscribe(analysis => {
    //   console.log(`This analysis options ${analysis.configurationUsed}`);
    //   this.analysis.set(analysis)
    //   this.configurationUsed.set(this.analysis().configurationUsed ?? [])
    // })

  }

}
