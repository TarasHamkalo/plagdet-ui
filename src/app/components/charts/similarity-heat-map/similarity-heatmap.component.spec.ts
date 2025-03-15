import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SimilarityHeatmapComponent } from "./similarity-heatmap.component";

describe("SimilarityHeatmapComponent", () => {
  let component: SimilarityHeatmapComponent;
  let fixture: ComponentFixture<SimilarityHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarityHeatmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarityHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
