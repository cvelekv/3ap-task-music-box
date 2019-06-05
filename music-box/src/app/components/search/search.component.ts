import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatSnackBar, PageEvent } from "@angular/material";

import { DialogComponent } from "../dialog/dialog.component";
import { NotificationDialog } from "../notification-dialog/notification-dialog";
import { DataService } from "./../../services/data.service";

@Component({
  selector: "search-component",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchValue: string;
  receivedArtists: any;

  recentlyViewed: any;
  recentlyStoreLimit: number;
  recentlyViewLimit: number;
  visibleArray: any;

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
  }

  //used localStorage to store values since I wanted to persist the data even after closing the window/tab, but to avoid creating and dealing with db
  //here I store parameters from settings page and recently viewed objects
  processLocalStorage() {
    let retrievedObj = localStorage.getItem("recentlyObj");
    {
      try {
        this.recentlyViewed =
          retrievedObj !== null ? JSON.parse(retrievedObj) : [];
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    }

    let retrievedStorelimit = localStorage.getItem("recentStore");
    if (retrievedStorelimit) {
      try {
        this.recentlyStoreLimit = JSON.parse(retrievedStorelimit);
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    }

    let retrievedViewLimit = localStorage.getItem("recentVisible");
    if (retrievedViewLimit) {
      try {
        this.recentlyViewLimit = JSON.parse(retrievedViewLimit);
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    }

    let retrievedShowRecent = localStorage.getItem("showRecentBoolean");
    if (retrievedShowRecent === "true") this.showRecentBar = true;
    else if (retrievedShowRecent === "false") this.showRecentBar = false;
  }

  // removing stored values if the store limit is less than the current number
  adjustStoreLimit() {
    if (this.recentlyStoreLimit !== null) {
      const diff = this.recentlyStoreLimit - this.recentlyViewed.length;
      if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          this.recentlyViewed.pop();
          try {
            localStorage.setItem(
              "recentlyObj",
              JSON.stringify(this.recentlyViewed)
            );
          } catch (error) {
            console.error("Error while parsing JSON");
          }
        }
      }
    }
  }

  //adjusting view limit to match the set one
  adjustViewLimit() {
    this.visibleArray = this.recentlyViewed.filter(
      (item, index: number) => index < this.recentlyViewLimit
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
