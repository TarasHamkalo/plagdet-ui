import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComparisonFastNavComponent } from "./comparison-fast-nav.component";

describe("ComparisonFastNavComponent", () => {
  let component: ComparisonFastNavComponent;
  let fixture: ComponentFixture<ComparisonFastNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonFastNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonFastNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
