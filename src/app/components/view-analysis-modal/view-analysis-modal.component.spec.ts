import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewAnalysisModalComponent } from "./view-analysis-modal.component";

describe("ViewAnalysisModalComponent", () => {
  let component: ViewAnalysisModalComponent;
  let fixture: ComponentFixture<ViewAnalysisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAnalysisModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
