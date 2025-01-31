import {Component, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {PairsTableComponent} from "../../components/tables/pairs-table/pairs-table.component";

@Component({
  selector: "app-submission-pairs-page",
  imports: [
    FormsModule,
    NgIf,
    MatProgressBar,
    SurfaceComponent,
    PairsTableComponent
  ],
  templateUrl: "./submission-pairs-page.component.html",
  styleUrl: "./submission-pairs-page.component.css"
})
export class SubmissionPairsPageComponent {

  public isTableLoaded = signal<boolean>(false);

}
