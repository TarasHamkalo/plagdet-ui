import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDiffEditorComponent } from './submission-diff-editor.component';

describe('DiffEditorComponent', () => {
  let component: SubmissionDiffEditorComponent;
  let fixture: ComponentFixture<SubmissionDiffEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionDiffEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionDiffEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
