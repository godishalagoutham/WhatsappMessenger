import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemplateParams, TemplateService } from '../services/template.service';

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.scss']
})
export class MessageTemplateComponent implements OnInit, OnDestroy {
  templateParams: TemplateParams = {
    customerName: '',
    promotionDetails: '',
    expiryDate: ''
  };
  headerImage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.subscription = this.templateService.templateParams$.subscribe(params => {
      this.templateParams = params;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.headerImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updatePreview(): void {
    this.templateService.updateTemplateParams(this.templateParams);
  }
}