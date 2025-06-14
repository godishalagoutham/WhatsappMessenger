import { Component } from '@angular/core';
import { Contact, ContactService } from '../services/contact.service';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-contact-upload',
  templateUrl: './contact-upload.component.html',
  styleUrls: ['./contact-upload.component.scss']
})
export class ContactUploadComponent {
  activeTab = 'csv';
  fileName: string | null = null;

  constructor(private contactService: ContactService) {}

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files ? element.files[0] : null;

    if (file) {
      this.fileName = file.name;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const contacts = result.data as Contact[];
          // Basic validation to ensure 'name' and 'phone' columns exist
          if (contacts.length > 0 && 'name' in contacts[0] && 'phone' in contacts[0]) {
            this.contactService.updateContacts(contacts);
          } else {
            alert('Invalid CSV format. Please ensure it has "name" and "phone" columns.');
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
}