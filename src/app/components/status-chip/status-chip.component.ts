import {Component, Input} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: "app-status-chip",
  imports: [
    MatIcon,
    NgIf,
    MatChip,
    MatTooltip
  ],
  templateUrl: "./status-chip.component.html",
  styleUrl: "./status-chip.component.css"
})
export class StatusChipComponent {

  @Input() public variant: "success" | "in-process" | "error" = "in-process";

  getVariantText(): string {
    switch (this.variant) {
      case "success":
        return "Dokončené"; // Success
      case "in-process":
        return "V procese"; // In Process
      case "error":
        return "Neúspešné"; // Error
      default:
        return "";
    }
  }

}
