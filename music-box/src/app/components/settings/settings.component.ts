import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { constants } from '../../models/constants';
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

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    let storeNum = parseInt(localStorage.getItem("recentStore"));
    this.selectedNumStore = storeNum;
    let visibleNum = parseInt(localStorage.getItem("recentVisible"));

    this.selectedNumVisible = visibleNum;
    let visibleSettings = localStorage.getItem("showRecentBoolean");

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
    localStorage.setItem("recentVisible", this.selectedNumVisible.toString());
    localStorage.setItem("recentStore", this.selectedNumStore.toString());
    localStorage.setItem(
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
    localStorage.setItem("recentVisible", "");
    localStorage.setItem("recentStore", "");
    localStorage.setItem(
      "showRecentBoolean",
      this.showRecentSearched.toString()
    );
    this.router.navigate(["/search-page"]);
  }
}
