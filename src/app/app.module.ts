import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ContactUploadComponent } from './contact-upload/contact-upload.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { MessagePreviewComponent } from './message-preview/message-preview.component';
import { DeliveryAnalyticsComponent } from './delivery-analytics/delivery-analytics.component';
import { ContactTableComponent } from './contact-table/contact-table.component';
import { PdfShareComponent } from './pdf-share/pdf-share.component';
import { LucideAngularModule, Upload, Users, Bell, User, FileText } from 'lucide-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContactService } from './services/contact.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    ContactUploadComponent,
    MessageTemplateComponent,
    MessagePreviewComponent,
    DeliveryAnalyticsComponent,
    ContactTableComponent,
    PdfShareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LucideAngularModule.pick({ Upload, Users, Bell, User, FileText })
  ],
  providers: [ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }