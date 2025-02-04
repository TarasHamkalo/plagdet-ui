import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlagiarismScoreDistributionComponent } from "./plagiarism-score-distribution.component";

describe("PlagiaismScoreDistributionComponent", () => {
  let component: PlagiarismScoreDistributionComponent;
  let fixture: ComponentFixture<PlagiarismScoreDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagiarismScoreDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagiarismScoreDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
