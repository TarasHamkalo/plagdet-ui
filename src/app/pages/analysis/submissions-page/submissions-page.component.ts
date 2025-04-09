import {Component, signal, OnInit} from "@angular/core";
import {SurfaceComponent} from "../../../components/base/surface/surface.component";
import {
  SubmissionsTableComponent
} from "../../../components/tables/submissions-table/submissions-table.component";
import {
  ContentContainerComponent
} from "../../../components/base/content-container/content-container.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-submissions-page",
  imports: [
    SurfaceComponent,
    SubmissionsTableComponent,
    ContentContainerComponent,
  ],
  templateUrl: "./submissions-page.component.html",
  styleUrl: "./submissions-page.component.css"
})
export class SubmissionsPageComponent implements OnInit {

  protected filterSet = signal<Set<number> | null>(null);

  constructor(private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const filterSetParam: string | null = params.get("filter-set");
      if (filterSetParam) {
        const filterSetNumbers = filterSetParam.split(",").map(id => Number.parseInt(id));
        this.filterSet.set(new Set(filterSetNumbers));
        console.log(this.filterSet());
      } else {
        this.filterSet.set(null);
      }
    });
  }
}
