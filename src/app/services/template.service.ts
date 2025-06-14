import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TemplateParams {
  customerName: string;
  promotionDetails: string;
  expiryDate: string;
  offerLink: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private initialParams: TemplateParams = {
    customerName: '',
    promotionDetails: '',
    expiryDate: '',
    offerLink: ''
  };

  private templateParamsSource = new BehaviorSubject<TemplateParams>(this.initialParams);
  templateParams$ = this.templateParamsSource.asObservable();

  private headerTypeSource = new BehaviorSubject<'Image' | 'Text'>('Image');
  headerType$ = this.headerTypeSource.asObservable();

  private headerImageSource = new BehaviorSubject<string | null>(null);
  headerImage$ = this.headerImageSource.asObservable();

  private templatesSource = new BehaviorSubject<MessageTemplate[]>([]);
  templates$ = this.templatesSource.asObservable();

  constructor() { }

  updateTemplateParams(params: TemplateParams) {
    this.templateParamsSource.next(params);
  }

  updateHeaderType(type: 'Image' | 'Text') {
    this.headerTypeSource.next(type);
  }

  updateHeaderImage(image: string | null) {
    this.headerImageSource.next(image);
  }

  getTemplates(): MessageTemplate[] {
    return this.templatesSource.value;
  }

  addTemplate(template: MessageTemplate) {
    const templates = [...this.templatesSource.value, template];
    this.templatesSource.next(templates);
  }


  updateTemplate(updated: MessageTemplate) {
    const templates = this.templatesSource.value.map(t => t.id === updated.id ? updated : t);
    this.templatesSource.next(templates);
  }

  deleteTemplate(id: string) {
    const templates = this.templatesSource.value.filter(t => t.id !== id);
    this.templatesSource.next(templates);
  }

  getHeaderType(): 'Image' | 'Text' {
    return this.headerTypeSource.value;
  }

  getHeaderImage(): string | null {
    return this.headerImageSource.value;
  }
}