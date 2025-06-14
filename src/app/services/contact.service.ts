import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Contact {
  name: string;
  phone: string;
  status?: string; // Status can be added later
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsSource = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSource.asObservable();

  constructor() { }

  updateContacts(contacts: Contact[]) {
    this.contactsSource.next(contacts);
  }
}