import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {
  MetadataTableComponent
} from "../../../components/tables/metadata-table/metadata-table.component";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";

@Component({
  selector: "app-metadata-page",
  imports: [
    FormsModule,
    SurfaceComponent,
    MetadataTableComponent,
    ContentContainerComponent
  ],
  templateUrl: "./metadata-page.component.html",
  styleUrl: "./metadata-page.component.css"
})
export class MetadataPageComponent {
}
