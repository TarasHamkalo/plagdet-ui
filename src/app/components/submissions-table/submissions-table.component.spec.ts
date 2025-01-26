import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsTableComponent } from './submissions-table.component';

describe('SubmissionsTableCardComponent', () => {
  let component: SubmissionsTableComponent;
  let fixture: ComponentFixture<SubmissionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
