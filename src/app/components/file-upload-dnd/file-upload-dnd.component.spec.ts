import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadDndComponent } from './file-upload-dnd.component';

describe('FileUploadDndComponent', () => {
  let component: FileUploadDndComponent;
  let fixture: ComponentFixture<FileUploadDndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadDndComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadDndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
