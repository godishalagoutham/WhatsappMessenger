import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignService {

  constructor(private http: HttpClient) {}

  sendBulkMessage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8081/api/campaigns/send-bulk', formData,{responseType: 'text'});
  }

  sendPDF(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8081/api/campaigns/pdf-share', formData,{responseType: 'text'});
  }


  
  contactsFile: File | null = null;
  templateName: string = '';
  headerType: 'Image' | 'Text' = 'Image';
  headerImagePath: string = '';
  expiryDate: string = '';
  offerLink: string = '';

  setContactsFile(file: File) { this.contactsFile = file; }
  setTemplateName(name: string) { this.templateName = name; }
  setHeaderType(type: 'Image' | 'Text') { this.headerType = type; }
  setHeaderImagePath(path: string) { this.headerImagePath = path; }
  setExpiryDate(date: string) { this.expiryDate = date; }
  setOfferLink(link: string) { this.offerLink = link; }
}