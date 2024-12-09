import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreviousAnalysisPageComponent } from "./previous-analysis-page.component";

describe("PreviousAnalysisPageComponent", () => {
  let component: PreviousAnalysisPageComponent;
  let fixture: ComponentFixture<PreviousAnalysisPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousAnalysisPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousAnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
