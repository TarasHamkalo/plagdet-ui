import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationInfoCardComponent } from "./configuration-info-card.component";

describe("ConfigurationInfoCardComponent", () => {
  let component: ConfigurationInfoCardComponent;
  let fixture: ComponentFixture<ConfigurationInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
