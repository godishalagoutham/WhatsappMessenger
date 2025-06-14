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
}