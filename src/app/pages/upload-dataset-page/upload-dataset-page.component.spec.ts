import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDatasetPageComponent } from './upload-dataset-page.component';

describe('UploadDatasetComponent', () => {
  let component: UploadDatasetPageComponent;
  let fixture: ComponentFixture<UploadDatasetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDatasetPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDatasetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
