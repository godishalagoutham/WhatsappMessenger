import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAnalyticsComponent } from './delivery-analytics.component';

describe('DeliveryAnalyticsComponent', () => {
  let component: DeliveryAnalyticsComponent;
  let fixture: ComponentFixture<DeliveryAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
