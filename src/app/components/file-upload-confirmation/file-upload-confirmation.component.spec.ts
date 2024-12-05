import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadConfirmationComponent } from './file-upload-confirmation.component';

describe('FileUploadConfirmationComponent', () => {
  let component: FileUploadConfirmationComponent;
  let fixture: ComponentFixture<FileUploadConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
