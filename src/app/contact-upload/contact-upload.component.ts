import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact, ContactService } from '../services/contact.service';
import * as Papa from 'papaparse';
import { Subscription } from 'rxjs';

interface RawContact {
  [key: string]: string;
}

@Component({
  selector: 'app-contact-upload',
  templateUrl: './contact-upload.component.html',
  styleUrls: ['./contact-upload.component.scss']
})
export class ContactUploadComponent implements OnInit, OnDestroy {
  activeTab = 'csv';
  fileName: string | null = null;
  contacts: Contact[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.subscription = this.contactService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files ? element.files[0] : null;
    this.processFile(file);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] || null;
    this.processFile(file);
  }

  private processFile(file: File | null): void {
    if (file) {
      this.fileName = file.name;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.toLowerCase().trim(),
        complete: (result) => {
          const contacts = result.data as RawContact[];
          // Basic validation to ensure 'name' and 'phone' columns exist (case-insensitive)
          if (contacts.length > 0) {
            const firstRow = contacts[0];
            const hasName = Object.keys(firstRow).some(key => key.toLowerCase() === 'name');
            const hasPhone = Object.keys(firstRow).some(key => key.toLowerCase() === 'phone');

            if (hasName && hasPhone) {
              // Normalize the data to ensure consistent property names
              const normalizedContacts = contacts.map(contact => {
                const normalizedContact: Contact = {
                  name: '',
                  phone: ''
                };
                
                // Find the name field regardless of case
                const nameKey = Object.keys(contact).find(key => key.toLowerCase() === 'name');
                if (nameKey) {
                  normalizedContact.name = contact[nameKey];
                }

                // Find the phone field regardless of case
                const phoneKey = Object.keys(contact).find(key => key.toLowerCase() === 'phone');
                if (phoneKey) {
                  normalizedContact.phone = contact[phoneKey];
                }

                return normalizedContact;
              });

              this.contactService.updateContacts(normalizedContacts);
            } else {
              alert('Invalid CSV format. Please ensure it has "name" and "phone" columns (case-insensitive).');
              this.fileName = null;
            }
          } else {
            alert('The CSV file is empty.');
            this.fileName = null;
          }
        },
        error: (error) => {
          console.error('CSV Parsing Error:', error);
          alert('Failed to parse the CSV file.');
          this.fileName = null;
        }
      });
    }
  }

  clearContacts(): void {
    this.contactService.updateContacts([]);
    this.fileName = null;
  }
}