import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUploadComponent } from './contact-upload.component';

describe('ContactUploadComponent', () => {
  let component: ContactUploadComponent;
  let fixture: ComponentFixture<ContactUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
