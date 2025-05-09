import {Component, HostListener, Input, signal, OnInit} from "@angular/core";

@Component({
  selector: "app-surface",
  imports: [],
  templateUrl: "./surface.component.html",
  styleUrl: "./surface.component.css",
  host: {
    "[attr.title]": "null"
  }
})
export class SurfaceComponent implements OnInit {

  @Input() public title = "Default Title";

  @Input() public subtitle = "Default subtitle";

  @Input() public isTitleCentered = false;

  @Input() public isHorizontal = false;

  @Input() public isContentCentered = true;

  @Input() public wrapBreakpoint: number | null = null;

  protected shouldWrap = signal<boolean>(true);

  public ngOnInit() {
    if (this.wrapBreakpoint) {
      this.recalculateWrap();
    }
  }

  @HostListener("window:resize", ["$event.target.innerWidth"])
  protected onResize() {
    this.recalculateWrap();
  }

  private recalculateWrap() {
    if (!this.wrapBreakpoint) {
      this.shouldWrap.set(true);
      return;
    }

    this.shouldWrap.set(window.innerWidth <= this.wrapBreakpoint);
  }
}
