import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailAlbumsComponent } from './components/detail-albums/detail-albums.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HotReleasesComponent } from './components/hot-releases/hot-releases.component';
import { NotificationDialog } from './components/notification-dialog/notification-dialog';
import { ResultComponent } from './components/result/result.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { AuthorizationService } from './services/authorization.service';
import { DataService } from './services/data.service';
import { StorageService } from './services/storage.service';
import { MaterialModule } from './shared/material-module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    WrapperComponent,
    SearchComponent,
    ResultComponent,
    SettingsComponent,
    DetailAlbumsComponent,
    NotificationDialog,
    DialogComponent,
    HotReleasesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [AuthorizationService, DataService, StorageService],
  bootstrap: [AppComponent],
  entryComponents: [NotificationDialog, DialogComponent]
})
export class AppModule {}
