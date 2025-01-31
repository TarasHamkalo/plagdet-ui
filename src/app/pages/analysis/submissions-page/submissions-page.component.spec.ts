import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubmissionsPageComponent } from "./submissions-page.component";

describe("SubmissionsPageComponent", () => {
  let component: SubmissionsPageComponent;
  let fixture: ComponentFixture<SubmissionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
