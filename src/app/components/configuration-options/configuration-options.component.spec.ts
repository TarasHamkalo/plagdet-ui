import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationOptionsComponent } from './configuration-options.component';

describe('ConfigurationOptionsComponent', () => {
  let component: ConfigurationOptionsComponent;
  let fixture: ComponentFixture<ConfigurationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
