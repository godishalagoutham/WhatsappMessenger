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
  headerType: 'Image' | 'Text' = 'Image';
  headerText: string = '';
  headerImage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.subscription = this.templateService.templateParams$.subscribe(params => {
      this.templateParams = params;
    });
    // Sync initial headerType and headerImage
    this.templateService.updateHeaderType(this.headerType);
    this.templateService.updateHeaderImage(this.headerImage);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onHeaderTypeChange(type: 'Image' | 'Text') {
    this.headerType = type;
    this.templateService.updateHeaderType(type);
  }

  onImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.headerImage = e.target?.result as string;
        this.templateService.updateHeaderImage(this.headerImage);
      };
      reader.readAsDataURL(file);
    }
  }

  updatePreview(): void {
    this.templateService.updateTemplateParams(this.templateParams);
  }
}