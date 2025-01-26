import {Component} from "@angular/core";
import {TitledSurfaceComponent} from "../../components/titled-surface/titled-surface.component";
import {
  SubmissionsTableComponent
} from "../../components/submissions-table/submissions-table.component";

@Component({
  selector: "app-submissions-page",
  imports: [
    TitledSurfaceComponent,
    SubmissionsTableComponent,

  ],
  templateUrl: "./submissions-page.component.html",
  styleUrl: "./submissions-page.component.css"
})
export class SubmissionsPageComponent {

}
