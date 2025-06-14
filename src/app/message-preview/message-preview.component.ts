import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemplateParams, TemplateService } from '../services/template.service';

@Component({
  selector: 'app-message-preview',
  templateUrl: './message-preview.component.html',
  styleUrls: ['./message-preview.component.scss']
})
export class MessagePreviewComponent implements OnInit, OnDestroy {
  params: TemplateParams = { customerName: '', promotionDetails: '', expiryDate: '', offerLink: '' };
  headerType: 'Image' | 'Text' = 'Image';
  headerImage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.subscription.add(this.templateService.templateParams$.subscribe(params => {
      this.params = params;
    }));
    this.subscription.add(this.templateService.headerType$.subscribe(type => {
      this.headerType = type;
    }));
    this.subscription.add(this.templateService.headerImage$.subscribe(img => {
      this.headerImage = img;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}