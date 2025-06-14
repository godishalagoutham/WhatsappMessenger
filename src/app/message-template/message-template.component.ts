import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.scss']
})
export class MessageTemplateComponent implements OnInit, OnDestroy {
  templateForm: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private templateService: TemplateService) {
    this.templateForm = this.fb.group({
      customerName: [''],
      promotionDetails: [''],
      expiryDate: ['']
    });
  }

  ngOnInit(): void {
    this.subscription = this.templateForm.valueChanges.subscribe(values => {
      this.templateService.updateTemplateParams(values);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}