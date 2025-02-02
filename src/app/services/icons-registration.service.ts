import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class IconsRegistrationService {

  public static readonly DEFAULT_ICONS: string[] = [
    "file-document-multiple-outline",
    "rename-box-outline",
    "file-search-outline",
    "compare-horizontal",
    "ballot-outline",
    "book-multiple-outline",
    "file-document-outline",
    "list",
    "badge-account-horizontal-outline",
    "apache-kafka",
    "email-outline",
    "frequently-asked-questions",
    "import",
    "upload-outline",
    "file-document-check-outline"
  ];

  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
  }

  public registerIcons(icons: string[]) {
    for (const icon of icons) {
      this.iconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`./assets/${icon}.svg`)
      );
    }
  }

}
