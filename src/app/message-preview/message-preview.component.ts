import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemplateParams, TemplateService } from '../services/template.service';

@Component({
  selector: 'app-message-preview',
  templateUrl: './message-preview.component.html',
  styleUrls: ['./message-preview.component.scss']
})
export class MessagePreviewComponent implements OnInit, OnDestroy {
  params: TemplateParams = { customerName: '', promotionDetails: '', expiryDate: '' };
  private subscription: Subscription = new Subscription();

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.subscription = this.templateService.templateParams$.subscribe(params => {
      this.params = params;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}