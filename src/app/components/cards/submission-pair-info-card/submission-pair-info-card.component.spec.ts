import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionPairInfoCardComponent } from "./submission-pair-info-card.component";

describe("SubmissionPairCardComponent", () => {
  let component: SubmissionPairInfoCardComponent;
  let fixture: ComponentFixture<SubmissionPairInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionPairInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionPairInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
