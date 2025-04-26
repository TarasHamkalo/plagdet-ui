import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagCaseItemComponent } from './plag-case-item.component';

describe('PlagCaseItemComponent', () => {
  let component: PlagCaseItemComponent;
  let fixture: ComponentFixture<PlagCaseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagCaseItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagCaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
