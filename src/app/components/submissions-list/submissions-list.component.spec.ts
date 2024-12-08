import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsList } from './submissions-list.component';

describe('ClustersListComponent', () => {
  let component: SubmissionsList;
  let fixture: ComponentFixture<SubmissionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
