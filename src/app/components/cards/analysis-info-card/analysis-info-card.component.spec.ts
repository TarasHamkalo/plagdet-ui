import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AnalysisInfoCardComponent } from "./analysis-info-card.component";

describe("AnylysisInfoCardComponent", () => {
  let component: AnalysisInfoCardComponent;
  let fixture: ComponentFixture<AnalysisInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
