import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionInfoCardComponent } from "./submission-info-card.component";

describe("SubmissionInfoCardComponent", () => {
  let component: SubmissionInfoCardComponent;
  let fixture: ComponentFixture<SubmissionInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
