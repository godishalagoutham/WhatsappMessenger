import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TemplateParams {
  customerName: string;
  promotionDetails: string;
  expiryDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private initialParams: TemplateParams = {
    customerName: '',
    promotionDetails: '',
    expiryDate: ''
  };

  private templateParamsSource = new BehaviorSubject<TemplateParams>(this.initialParams);
  templateParams$ = this.templateParamsSource.asObservable();

  constructor() { }

  updateTemplateParams(params: TemplateParams) {
    this.templateParamsSource.next(params);
  }
}