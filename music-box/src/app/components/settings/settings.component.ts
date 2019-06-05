import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { NotificationDialog } from '../notification-dialog/notification-dialog';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {
  showRecentSearched: boolean = true;

  visibleSelectValues: any[] = [
    { id: "0", value: 1 },
    { id: "1", value: 2 },
    { id: "2", value: 3 },
    { id: "3", value: 4 },
    { id: "4", value: 5 },
    { id: "5", value: 6 },
    { id: "6", value: 7 },
    { id: "7", value: 8 }
  ];

  storeSelectValues: any[] = [
    { id: "0", value: 1 },
    { id: "1", value: 2 },
    { id: "2", value: 3 },
    { id: "3", value: 4 },
    { id: "4", value: 5 },
    { id: "5", value: 6 },
    { id: "6", value: 7 },
    { id: "7", value: 8 },
    { id: "8", value: 9 },
    { id: "9", value: 10 }
  ];

  selectedNumVisible: number;
  selectedNumStore: number;
  durationInSeconds = 2;

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
