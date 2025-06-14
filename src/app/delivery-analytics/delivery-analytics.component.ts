import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService, DeliveryAnalytics } from '../services/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delivery-analytics',
  templateUrl: './delivery-analytics.component.html',
  styleUrls: ['./delivery-analytics.component.scss']
})
export class DeliveryAnalyticsComponent implements OnInit, OnDestroy {
  analytics: DeliveryAnalytics = {
    pending: 0,
    sent: 0,
    failed: 0,
    delivered: 0,
    total: 0,
    skipped: 0
  };
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.subscription = this.contactService.analytics$.subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
