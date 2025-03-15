import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListPickerModalComponent } from "./list-picker-modal.component";

describe("ListPickerModalComponent", () => {
  let component: ListPickerModalComponent;
  let fixture: ComponentFixture<ListPickerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPickerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPickerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
