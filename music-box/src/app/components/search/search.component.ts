import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';

import { DialogComponent } from '../dialog/dialog.component';
import { NotificationDialog } from '../notification-dialog/notification-dialog';
import { Artist } from './../../models/artist';
import { DataService } from './../../services/data.service';
import { StorageService } from './../../services/storage.service';

@Component({
  selector: "search-component",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchValue: string;
  receivedArtists: any;

  recentlyViewed: Artist[];
  recentlyStoreLimit: number;
  recentlyViewLimit: number;
  visibleArray: Artist[];

  showRecentBar: boolean;

  @Output() searchedObjEmited = new EventEmitter<{}>();

  showSpinner: boolean = false;

  _pagination;
  @Input() set pagination(val) {
    this._pagination = val;
    if (val) {
      this.search(val);
    }
  }
  durationInSeconds: number = 3;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.processLocalStorage();
    this.adjustStoreLimit();
    this.adjustViewLimit();
  }

  search(pagination?: PageEvent): void {
    this.showSpinner = true;
    this.dataService.search(this.searchValue, pagination).subscribe(
      data => {
        this.receivedArtists = data["artists"];
        this.searchedObjEmited.emit(this.receivedArtists);
        this.showSpinner = false;
        let notificationmsg =
          "Search returned " + data["artists"].total + " results.";
        if (pagination === undefined) {
          this.msgPrompt("notification", notificationmsg);
        }
      },
      (err: Response) => {
        this.msgPrompt("error", err.statusText);
        this.showSpinner = false;
      }
    );
  }

  //used localStorage to store values since I wanted to persist the data even after closing the window/tab, but to avoid creating and dealing with db
  //here I store parameters from settings page and recently viewed objects
  processLocalStorage(): void {
    let retrievedObj = this.storageService.getItemFromStorage("recentlyObj");
    {
      try {
        this.recentlyViewed =
          retrievedObj !== null ? JSON.parse(retrievedObj) : [];
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    }

    let retrievedStorelimit = this.storageService.getItemFromStorage(
      "recentStore"
    );
    if (retrievedStorelimit) {
      try {
        this.recentlyStoreLimit = JSON.parse(retrievedStorelimit);
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    }

    let retrievedViewLimit = this.storageService.getItemFromStorage(
      "recentVisible"
    );
    if (retrievedViewLimit) {
      try {
        this.recentlyViewLimit = JSON.parse(retrievedViewLimit);
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    }
    try {
      JSON.parse(
        this.storageService.getItemFromStorage("showRecentBoolean")
      ) === true
        ? (this.showRecentBar = true)
        : (this.showRecentBar = false);
    } catch (error) {
      console.error("Error while parsing JSON");
    }
  }

  // removing stored values if the store limit is less than the current number
  adjustStoreLimit(): void {
    if (this.recentlyStoreLimit !== null) {
      const diff = this.recentlyStoreLimit - this.recentlyViewed.length;
      if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          this.recentlyViewed.pop();

          this.storageService.setObjToStorage(
            "recentlyObj",
            this.recentlyViewed
          );
        }
      }
    }
  }

  //adjusting view limit to match the set one
  adjustViewLimit(): void {
    this.visibleArray = this.recentlyViewed.filter(
      (item, index: number) => index < this.recentlyViewLimit
    );
  }

  openShowMoreRecent(): void {
    this.dialog.open(DialogComponent, {
      width: "450px",
      autoFocus: false,
      data: { recent: this.recentlyViewed, lookupType: "recent" }
    });
  }

  setArtistName(name: string): void {
    this.dataService.artistNameSet.next(name);
  }

  msgPrompt(type?: string, message?: string): void {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }
}
