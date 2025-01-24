import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionPairsPageComponent } from "./submission-pairs-page.component";

describe("SubmissionPairsPageComponent", () => {
  let component: SubmissionPairsPageComponent;
  let fixture: ComponentFixture<SubmissionPairsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionPairsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionPairsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
