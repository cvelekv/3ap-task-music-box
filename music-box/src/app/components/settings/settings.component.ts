import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { constants } from '../../models/constants';
import { StorageService } from '../../services/storage.service';
import { NotificationDialog } from '../notification-dialog/notification-dialog';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {
  showRecentSearched: boolean = true;

  visibleSelectValues: any[] = constants.visibleSelectValues;
  storeSelectValues: any[] = constants.storeSelectValues;

  selectedNumVisible: number;
  selectedNumStore: number;
  durationInSeconds: number = 2;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const storeNum = parseInt(
      this.storageService.getItemFromStorage("recentStore")
    );
    this.selectedNumStore = storeNum;
    const visibleNum = parseInt(
      this.storageService.getItemFromStorage("recentVisible")
    );

    this.selectedNumVisible = visibleNum;
    const visibleSettings = this.storageService.getItemFromStorage(
      "showRecentBoolean"
    );

    if (visibleSettings === "true") {
      this.showRecentSearched = true;
    } else if (visibleSettings === "false") {
      this.showRecentSearched = false;
    }
  }

  save() {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: "notification", msg: "Settings succesfully saved" }
    });
    this.storageService.setItemToStorage(
      "recentVisible",
      this.selectedNumVisible.toString()
    );
    this.storageService.setItemToStorage(
      "recentStore",
      this.selectedNumStore.toString()
    );
    this.storageService.setItemToStorage(
      "showRecentBoolean",
      this.showRecentSearched.toString()
    );
    this.router.navigate(["/search-page"]);
  }

  clearSettings() {
    this.selectedNumVisible = undefined;
    this.selectedNumStore = undefined;
    this.showRecentSearched = false;
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: "notification", msg: "Settings cleared" }
    });
    this.storageService.setItemToStorage("recentVisible", "");
    this.storageService.setItemToStorage("recentStore", "");
    localStorage.setItem(
      "showRecentBoolean",
      this.storageService.setItemToStorage.toString()
    );
    this.router.navigate(["/search-page"]);
  }
}
