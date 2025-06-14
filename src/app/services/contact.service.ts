import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProcessResult } from './campaign.service';

export interface Contact {
  name: string;
  phone: string;
  status?: 'Pending' | 'Sent' | 'Failed' | 'Delivered';
  errorDetails?: string;
}

export interface DeliveryAnalytics {
  pending: number;
  sent: number;
  failed: number;
  delivered: number;
  total: number;
  skipped: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsSource = new BehaviorSubject<Contact[]>([]);
  private analyticsSource = new BehaviorSubject<DeliveryAnalytics>({
    pending: 0,
    sent: 0,
    failed: 0,
    delivered: 0,
    total: 0,
    skipped: 0
  });

  contacts$ = this.contactsSource.asObservable();
  analytics$ = this.analyticsSource.asObservable();

  constructor() { }

  updateContacts(contacts: Contact[]) {
    this.contactsSource.next(contacts);
    this.updateAnalytics();
  }

  updateFromProcessResults(results: ProcessResult[]) {
    // Get the current contacts
    const currentContacts = this.contactsSource.value;

    // Create a map of phone to result for quick lookup
    const resultMap = new Map(results.map(r => [r.contact.phone, r]));

    // Merge statuses into the original contacts
    const updatedContacts = currentContacts.map(contact => {
      const result = resultMap.get(contact.phone);
      if (result) {
        return {
          ...contact,
          status: this.determineOverallStatus(result),
          errorDetails: result.errorDetails
        };
      } else {
        // If no result yet, keep as pending
        return {
          ...contact,
          status: 'Pending' as Contact['status'],
          errorDetails: undefined
        };
      }
    });

    this.contactsSource.next(updatedContacts);
    this.updateAnalytics();
  }

  private determineOverallStatus(result: ProcessResult): Contact['status'] {
    const statuses = [result.textMessageStatus, result.pdfMessageStatus, result.imageMessageStatus];
    
    if (statuses.some(s => s.toUpperCase().includes("FAILED"))) return 'Failed';
    if (statuses.some(s => s.toUpperCase().includes("SKIPPED"))) return 'Pending';
    if (statuses.some(s => s.toUpperCase().includes("SUCCESS"))) return 'Sent';
    return 'Pending';
  }

  updateAnalyticsFromCampaignStatus(
    totalContacts: number,
    sentCount: number,
    failedCount: number,
    skippedCount: number
  ) {
    const analytics: DeliveryAnalytics = {
      total: totalContacts,
      sent: sentCount,
      failed: failedCount,
      skipped: skippedCount,
      pending: totalContacts - (sentCount + failedCount + skippedCount),
      delivered: 0 // This will be updated based on individual contact statuses
    };
    this.analyticsSource.next(analytics);
  }

  private updateAnalytics() {
    const contacts = this.contactsSource.value;
    const analytics: DeliveryAnalytics = {
      pending: 0,
      sent: 0,
      failed: 0,
      delivered: 0,
      total: contacts.length,
      skipped: 0
    };

    contacts.forEach(contact => {
      if (contact.status) {
        analytics[contact.status.toLowerCase() as keyof DeliveryAnalytics]++;
      } else {
        analytics.pending++;
      }
    });

    this.analyticsSource.next(analytics);
  }
} 