import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';

import { DialogComponent } from '../dialog/dialog.component';
import { NotificationDialog } from '../notification-dialog/notification-dialog';
import { DataService } from './../../services/data.service';

@Component({
  selector: "search-component",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchValue: string;
  receivedArtists;

  recentlyViewed;
  recentlyStoreLimit: number;
  recentlyViewLimit: number;
  visibleArray;

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
  durationInSeconds = 3;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.processLocalStorage();
    this.adjustStoreLimit();
    this.adjustViewLimit();
  }

  search(pagination?: PageEvent) {
    this.showSpinner = true;
    this.dataService.search(this.searchValue, pagination).subscribe(
      data => {
        this.receivedArtists = data["artists"];
        this.searchedObjEmited.emit(this.receivedArtists);
        this.showSpinner = false;
        let notificationmsg =
          "Search returned " + data["artists"].total + " results.";
        if (pagination === undefined)
          this.msgPrompt("notification", notificationmsg);
      },
      (err: Response) => {
        this.msgPrompt("error", err.statusText);
        this.showSpinner = false;
      }
    );
    // constructing the URL that is sent to server's endpoint
    // let url =
    //   this.authorization.getBaseUrl() +
    //   "/search?q=" +
    //   this.searchValue +
    //   "&type=artist" +
    //   "&limit=" +
    //   limit +
    //   "&offset=" +
    //   offset;

    // this.http.get(url).subscribe(
    //   data => {
    //     this.receivedArtists = data["artists"];
    //     this.searchedObjEmited.emit(this.receivedArtists);
    //     this.showSpinner = false;
    //     let notificationmsg =
    //       "Search returned " + data["artists"].total + " results.";
    //     if (pagination === undefined)
    //       this.msgPrompt("notification", notificationmsg);
    //   },
    //   (err: Response) => {
    //     this.msgPrompt("error", err.statusText);
    //     this.showSpinner = false;
    //   }
    // );
  }

  //used localStorage to store values since I wanted to persist the data even after closing the window/tab, but to avoid creating and dealing with db
  //here I store parameters from settings page and recently viewed objects
  processLocalStorage() {
    let retrievedObj = localStorage.getItem("recentlyObj");
    this.recentlyViewed = retrievedObj !== null ? JSON.parse(retrievedObj) : [];

    let retrievedStorelimit = localStorage.getItem("recentStore");
    if (retrievedStorelimit)
      this.recentlyStoreLimit = JSON.parse(retrievedStorelimit);

    let retrievedViewLimit = localStorage.getItem("recentVisible");
    if (retrievedViewLimit)
      this.recentlyViewLimit = JSON.parse(retrievedViewLimit);

    let retrievedShowRecent = localStorage.getItem("showRecentBoolean");
    if (retrievedShowRecent === "true") this.showRecentBar = true;
    else if (retrievedShowRecent === "false") this.showRecentBar = false;
  }

  // removing stored values if the store limit is less than the current number
  adjustStoreLimit() {
    let diff;
    if (this.recentlyStoreLimit !== null) {
      diff = this.recentlyStoreLimit - this.recentlyViewed.length;
      if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          this.recentlyViewed.pop();
          localStorage.setItem(
            "recentlyObj",
            JSON.stringify(this.recentlyViewed)
          );
        }
      }
    }
  }

  //adjusting view limit to match the set one
  adjustViewLimit() {
    this.visibleArray = this.recentlyViewed.filter(
      (item, index) => index < this.recentlyViewLimit
    );
  }

  openShowMoreRecent(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "450px",
      autoFocus: false,
      data: { recent: this.recentlyViewed, lookupType: "recent" }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  setArtistName(name) {
    this.dataService.artistNameSet.next(name);
  }

  msgPrompt(type?, message?) {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }
}
