import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemViewComponent } from './nav-item-view.component';

describe('NavItemViewComponent', () => {
  let component: NavItemViewComponent;
  let fixture: ComponentFixture<NavItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavItemViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
