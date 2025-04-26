import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagCaseEditorCardComponent } from './plag-case-editor-card.component';

describe('PlagcaseEditorCardComponent', () => {
  let component: PlagCaseEditorCardComponent;
  let fixture: ComponentFixture<PlagCaseEditorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagCaseEditorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagCaseEditorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
