import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {
  MetadataTableComponent
} from "../../components/tables/metadata-table/metadata-table.component";

@Component({
  selector: "app-metadata-page",
  imports: [
    FormsModule,
    SurfaceComponent,
    MetadataTableComponent
  ],
  templateUrl: "./metadata-page.component.html",
  styleUrl: "./metadata-page.component.css"
})
export class MetadataPageComponent {
}
