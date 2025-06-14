import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ProcessResult {
  contact: {
    name: string;
    phone: string;
  };
  textMessageStatus: string;
  pdfMessageStatus: string;
  imageMessageStatus: string;
  timestamp: string;
  errorDetails: string;
}

export interface CampaignStatus {
  campaignId: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalContacts: number;
  sentCount: number;
  failedCount: number;
  skippedCount: number;
  results: ProcessResult[];
}

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private currentCampaignId: string | null = null;

  constructor(private http: HttpClient) {}

  sendBulkMessage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8081/api/campaigns/send-bulk', formData, {responseType: 'text'})
      .pipe(
        map(response => {
          const parsedResponse = JSON.parse(response);
          this.currentCampaignId = parsedResponse.campaignId;
          return parsedResponse;
        })
      );
  }

  sendPDF(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8081/api/campaigns/pdf-share', formData, {responseType: 'text'});
  }

  pollCampaignStatus(campaignId: string): Observable<CampaignStatus> {
    return interval(3000).pipe( // Poll every 3 seconds
      switchMap(() => this.http.get<CampaignStatus>(`http://localhost:8081/api/campaigns/status/${campaignId}`))
    );
  }

  getCurrentCampaignId(): string | null {
    return this.currentCampaignId;
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