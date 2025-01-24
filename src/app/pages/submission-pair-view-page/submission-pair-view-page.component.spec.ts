import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionPairViewPageComponent } from "./submission-pair-view-page.component";

describe("SubmissionPairViewPageComponent", () => {
  let component: SubmissionPairViewPageComponent;
  let fixture: ComponentFixture<SubmissionPairViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionPairViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionPairViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
