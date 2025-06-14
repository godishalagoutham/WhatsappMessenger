import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfShareComponent } from './pdf-share.component';

describe('PdfShareComponent', () => {
  let component: PdfShareComponent;
  let fixture: ComponentFixture<PdfShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
