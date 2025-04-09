import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InfiniteLoadCardComponent } from "./infinite-load-card.component";

describe("InfiniteLoadCardComponent", () => {
  let component: InfiniteLoadCardComponent;
  let fixture: ComponentFixture<InfiniteLoadCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteLoadCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfiniteLoadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
