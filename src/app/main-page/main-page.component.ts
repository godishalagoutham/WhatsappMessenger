import { Component } from '@angular/core';
import { CampaignService } from '../services/campaign.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  activeTab: 'templates' | 'pdf' = 'templates';

    constructor(private campaignService: CampaignService,private templateSerive: TemplateService) {}

  sendBulkMessage() {
    if (!this.campaignService.contactsFile) {
      alert('Please upload a contacts file.');
      return;
    }

    const formData = new FormData();
    formData.append('templateName', "PROMOTION");
    formData.append('headerType', this.templateSerive.getHeaderType());
    if (this.templateSerive.getHeaderType() === 'Image') {
      formData.append('headerImagePath', this.templateSerive.getHeaderImage() || '');
    }
    // formData.append('expiryDate', this.expiryDate);
    // formData.append('offerLink', this.offerLink);
    formData.append('contactsFile', this.campaignService.contactsFile);

    this.campaignService.sendBulkMessage(formData).subscribe({
      next: (res) => alert('Bulk message sent!'),
      error: (err) => alert('Failed to send: ' + err.message)
    });
  }
}
