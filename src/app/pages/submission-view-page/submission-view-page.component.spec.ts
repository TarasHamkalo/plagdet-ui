import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionViewPageComponent } from "./submission-view-page.component";

describe("SubmissionViewPageComponent", () => {
  let component: SubmissionViewPageComponent;
  let fixture: ComponentFixture<SubmissionViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
