import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contact, ContactService } from './services/contact.service';
import { Subscription } from 'rxjs';

interface PdfSendStatus {
  contact: Contact;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

@Component({
  selector: 'app-pdf-share',
  templateUrl: './pdf-share.component.html',
  styleUrls: ['./pdf-share.component.scss']
})
export class PdfShareComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  pagedContacts: Contact[] = [];
  selectedContacts: Set<string> = new Set(); // store phone numbers
  pdfFile: File | null = null;
  pdfFileName: string = '';
  sending = false;
  sendStatus: PdfSendStatus[] = [];
  searchTerm: string = '';
  page = 1;
  pageSize = 3;
  totalPages = 1;
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.subscription = this.contactService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
      this.applySearch();
      this.selectedContacts.clear();
      this.sendStatus = [];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfFile = input.files[0];
      this.pdfFileName = this.pdfFile.name;
    }
  }

  toggleContact(phone: string): void {
    if (this.selectedContacts.has(phone)) {
      this.selectedContacts.delete(phone);
    } else {
      this.selectedContacts.add(phone);
    }
  }

  isSelected(phone: string): boolean {
    return this.selectedContacts.has(phone);
  }

  selectAllOnPage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const checked = !!input && input.checked;
    this.pagedContacts.forEach(contact => {
      if (checked) {
        this.selectedContacts.add(contact.phone);
      } else {
        this.selectedContacts.delete(contact.phone);
      }
    });
  }

  isAllSelectedOnPage(): boolean {
    return this.pagedContacts.length > 0 && this.pagedContacts.every(c => this.selectedContacts.has(c.phone));
  }

  applySearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredContacts = term
      ? this.contacts.filter(c => c.name.toLowerCase().includes(term) || c.phone.toLowerCase().includes(term))
      : [...this.contacts];
    this.page = 1;
    this.updatePagedContacts();
  }

  updatePagedContacts(): void {
    this.totalPages = Math.ceil(this.filteredContacts.length / this.pageSize) || 1;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedContacts = this.filteredContacts.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.updatePagedContacts();
  }

  sendPdf(): void {
    if (!this.pdfFile || this.selectedContacts.size === 0) return;
    this.sending = true;
    this.sendStatus = [];
    const selected = this.contacts.filter(c => this.selectedContacts.has(c.phone));
    selected.forEach(contact => {
      setTimeout(() => {
        this.sendStatus.push({ contact, status: 'success' });
        if (this.sendStatus.length === selected.length) {
          this.sending = false;
        }
      }, 500 + Math.random() * 1000);
    });
  }

  reset(): void {
    this.pdfFile = null;
    this.pdfFileName = '';
    this.selectedContacts.clear();
    this.sendStatus = [];
    this.searchTerm = '';
    this.applySearch();
  }
} 