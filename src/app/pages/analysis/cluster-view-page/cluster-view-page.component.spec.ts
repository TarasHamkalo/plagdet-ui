import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ClusterViewPageComponent } from "./cluster-view-page.component";

describe("ClusterViewPageComponent", () => {
  let component: ClusterViewPageComponent;
  let fixture: ComponentFixture<ClusterViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
