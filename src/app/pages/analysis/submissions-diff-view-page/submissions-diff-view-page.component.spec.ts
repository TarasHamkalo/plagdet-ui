import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionsDiffViewPageComponent } from "./submissions-diff-view-page.component";

describe("SubmissionsDiffViewPageComponent", () => {
  let component: SubmissionsDiffViewPageComponent;
  let fixture: ComponentFixture<SubmissionsDiffViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionsDiffViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionsDiffViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
