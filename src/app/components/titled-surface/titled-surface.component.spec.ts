import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TitledSurfaceComponent } from "./titled-surface.component";

describe("TitledSurfaceComponent", () => {
  let component: TitledSurfaceComponent;
  let fixture: ComponentFixture<TitledSurfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitledSurfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitledSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
