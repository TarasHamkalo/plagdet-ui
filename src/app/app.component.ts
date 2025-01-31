import {Component, OnInit} from "@angular/core";
import {IconsRegistrationService} from "./services/icons-registration.service";
import {LayoutComponent} from "./layout/layout.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    LayoutComponent
  ],
  template: `
    <app-layout/>
  `,
  styles: ``
})
export class AppComponent implements OnInit {

  constructor(private iconsRegistrationService: IconsRegistrationService) {
  }

  public ngOnInit(): void {
    this.iconsRegistrationService.registerIcons(IconsRegistrationService.DEFAULT_ICONS);
  }

}