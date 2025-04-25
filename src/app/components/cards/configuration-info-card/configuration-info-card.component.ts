import {Component, effect, OnInit, signal, ViewEncapsulation} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatList, MatListItem, MatListItemTitle} from "@angular/material/list";
import {Overview} from "../../../model/overview";
import {AnalysisContextService} from "../../../context/analysis-context.service";
import {KeyValuePipe, NgIf} from "@angular/common";
import {AssetsLoaderService} from "../../../services/assets-loader.service";
import {ConfigurationDescription} from "../../../types/configuration-description";
import {MatDivider} from "@angular/material/divider";
import {TextOverflowScrollDirective} from "../../../directives/text-overflow-scroll.directive";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "app-configuration-info-card",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatList,
    MatListItem,
    MatCardModule,
    KeyValuePipe,
    NgIf,
    MatDivider,
    MatListItemTitle,
    TextOverflowScrollDirective
  ],
  templateUrl: "./configuration-info-card.component.html",
  styleUrls: ["../shared/card-base.scss", "./configuration-info-card.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationInfoCardComponent implements OnInit {

  public overview = signal<Overview | undefined>(undefined);

  protected configurationDescription = signal<ConfigurationDescription[]>([]);

  constructor(
    private analysisContext: AnalysisContextService,
    private assetsLoaderService: AssetsLoaderService,
    private sanitizer: DomSanitizer
  ) {
    effect(() => {
      const report = this.analysisContext.getReport()();
      if (report) {
        this.overview.set(report!.overview);
      }
    });
  }

  public ngOnInit() {
    this.assetsLoaderService.loadConfigurationDescription().subscribe((arr) => {
      this.configurationDescription.set(arr);
    });
  }

  public getDescription(key: string, suffix = ""): string | undefined {
    return this.configurationDescription().find(v => v.name === key + suffix)?.description;
  }

  public getFlag(key: string, suffix = ""): string | undefined {
    return this.configurationDescription().find(v => v.name === key + suffix)?.flag;
  }

  protected getExtensionStrategyParams() {
    return this.overview()?.configuration.extensionStrategyParameters as Record<string, any>;
  }

  protected getSeedingStrategyParams() {
    return this.overview()?.configuration.seedingStrategyParameters as Record<string, any>;
  }
  protected getFilteringStrategyParams() {
    return this.overview()?.configuration.filteringStrategyParameters as Record<string, any>;
  }
}
