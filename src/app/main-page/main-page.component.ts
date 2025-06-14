import { Component, OnDestroy } from '@angular/core';
import { CampaignService } from '../services/campaign.service';
import { TemplateService } from '../services/template.service';
import { ContactService } from '../services/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnDestroy {
  activeTab: 'templates' | 'pdf' = 'templates';
  private statusSubscription: Subscription | null = null;

  constructor(
    private campaignService: CampaignService,
    private templateService: TemplateService,
    private contactService: ContactService
  ) {}

  sendBulkMessage() {
    if (!this.campaignService.contactsFile) {
      alert('Please upload a contacts file.');
      return;
    }

    const formData = new FormData();
    formData.append('templateName', "PROMOTION");
    formData.append('headerType', this.templateService.getHeaderType());
    if (this.templateService.getHeaderType() === 'Image') {
      formData.append('headerImagePath', this.templateService.getHeaderImage() || '');
    }
    formData.append('contactsFile', this.campaignService.contactsFile);

    this.campaignService.sendBulkMessage(formData).subscribe({
      next: (response) => {
        const campaignId = response.campaignId;
        if (campaignId) {
          // Start polling for status updates
          this.statusSubscription = this.campaignService.pollCampaignStatus(campaignId)
            .subscribe({
              next: (status) => {
                // Update contact statuses from process results
                this.contactService.updateFromProcessResults(status.results);
                // Update analytics from campaign status
                this.contactService.updateAnalyticsFromCampaignStatus(
                  status.totalContacts,
                  status.sentCount,
                  status.failedCount,
                  status.skippedCount
                );
                // Stop polling if campaign is completed or failed
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                  this.statusSubscription?.unsubscribe();
                  this.statusSubscription = null;
                }
              },
              error: (error) => {
                console.error('Error polling campaign status:', error);
                this.statusSubscription?.unsubscribe();
                this.statusSubscription = null;
              }
            });
        }
      },
      error: (err) => alert('Failed to send: ' + err.message)
    });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }
}
