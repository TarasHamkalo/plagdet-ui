import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SimilarityHeatmapPageComponent } from "./similarity-heatmap-page.component";

describe("SimilarityHeatmapPageComponent", () => {
  let component: SimilarityHeatmapPageComponent;
  let fixture: ComponentFixture<SimilarityHeatmapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarityHeatmapPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarityHeatmapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
