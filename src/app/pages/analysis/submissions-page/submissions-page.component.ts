import {Component} from "@angular/core";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {
  SubmissionsTableComponent
} from "../../../components/tables/submissions-table/submissions-table.component";

@Component({
  selector: "app-submissions-page",
  imports: [
    SurfaceComponent,
    SubmissionsTableComponent,
  ],
  templateUrl: "./submissions-page.component.html",
  styleUrl: "./submissions-page.component.css"
})
export class SubmissionsPageComponent {

}
