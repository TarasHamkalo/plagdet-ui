import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionGraphPageComponent } from "./submission-graph-page.component";

describe("SubmissionGraphPageComponent", () => {
  let component: SubmissionGraphPageComponent;
  let fixture: ComponentFixture<SubmissionGraphPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionGraphPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionGraphPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
