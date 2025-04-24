import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlagiarismSourcesComponent } from "./plagiarism-sources.component";

describe("PlagiarismSourcesComponent", () => {
  let component: PlagiarismSourcesComponent;
  let fixture: ComponentFixture<PlagiarismSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagiarismSourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagiarismSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
