import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact, ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.scss']
})
export class ContactTableComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  pagedContacts: Contact[] = [];
  page = 1;
  pageSize = 4;
  totalPages = 1;
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Subscribe to contact updates
    this.subscription = this.contactService.contacts$.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      console.log(this.contacts)
      this.updatePagedContacts();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updatePagedContacts(): void {
    this.totalPages = Math.ceil(this.contacts.length / this.pageSize) || 1;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedContacts = this.contacts.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.updatePagedContacts();
  }

  get showingRange(): string {
    if (this.contacts.length === 0) return '';
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.contacts.length);
    return `Showing ${start}-${end} of ${this.contacts.length} contacts`;
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'Pending':
        return 'status-badge-pending';
      case 'Sent':
        return 'status-badge-sent';
      case 'Failed':
        return 'status-badge-failed';
      case 'Delivered':
        return 'status-badge-delivered';
      default:
        return 'status-badge-pending';
    }
  }
}