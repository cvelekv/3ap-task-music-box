import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, PageEvent } from '@angular/material';

import { Artist } from '../../models/artist';
import { DialogComponent } from '../dialog/dialog.component';
import { NotificationDialog } from '../notification-dialog/notification-dialog';
import { DataService } from './../../services/data.service';
import { StorageService } from './../../services/storage.service';

@Component({
  selector: "result-component",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"]
})
export class ResultComponent implements OnInit {
  artistData: Artist[] = [];
  displayedColumns: string[] = ["artistName", "image", "actions"];
  showSpinner: boolean = false;
  dataSource: any;

  length: number = 5;
  pageNumber: number = 0;
  pageSize: number = 5;

  recentlyViewed = [];
  recentStoreLimit: number = 10;

  recentlyVisibleLimit: number;
  recentlyStoreLimit: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  _result: any;
  @Input() set result(val: any) {
    this._result = val;
    if (this._result) {
      this.artistData = [];
      this.handleResultData(this._result);
    }
  }

  @Output() setPagination = new EventEmitter<any>();

  durationInSeconds: number = 3;

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
    this.recentlyVisibleLimit = parseInt(
      this.storageService.getItemFromStorage("recentVisible")
    );
    this.recentlyStoreLimit = parseInt(
      this.storageService.getItemFromStorage("recentStore")
    );

    let retrievedObj = this.storageService.getItemFromStorage("recentlyObj");
    try {
      this.recentlyViewed =
        retrievedObj !== null ? JSON.parse(retrievedObj) : [];
    } catch (error) {
      console.error("Error while parsing JSON", error);
    }
  }

  // creating object to use as data source in table result
  handleResultData(data: any): void {
    data.items.forEach(artist => {
      this.artistData.push({
        id: artist.id,
        artistName: artist.name,
        image: artist.images ? artist.images[0] : ""
      });
    });
    this.dataSource = this.artistData;
    this.length = data.total;
  }

  // if pagination is changed it has to be sent to sibling component so the search will be triggered
  emitPagination(val: PageEvent): void {
    this.setPagination.emit(val);
  }

  //This prevents adding the same artist to recently viewed and adding that one to the top of the list.
  arrangeList(artist: Artist): void {
    let counters = this.recentlyViewed.filter(c => c.id !== artist.id);
    counters.unshift(artist);
    this.storageService.setObjToStorage("recentlyObj", counters);
  }

  addToRecentlyViewed(val: any): void {
    let exists: boolean = false;

    this.recentlyViewed.forEach(artist => {
      if (artist.artistName === val.artistName) {
        exists = true;
        this.dataService.artistNameSet.next(val.artistName);
        this.arrangeList(val);
      }
    });

    if (!exists) {
      this.dataService.artistNameSet.next(val.artistName);
      this.recentlyViewed.unshift(val);
      if (this.recentlyViewed.length > this.recentlyStoreLimit) {
        this.recentlyViewed.pop();
      }
      this.storageService.setObjToStorage("recentlyObj", this.recentlyViewed);
    }
  }

  openArtistInfo(artist: Artist): void {
    this.showSpinner = true;
    let artistObj: any;

    this.dataService.openArtistInfo(artist).subscribe(
      (res: any) => {
        artistObj = res;
        this.dialog.open(DialogComponent, {
          width: "450px",
          autoFocus: false,
          data: { artist: artistObj, lookupType: "artistInfo" }
        });

        this.showSpinner = false;
      },
      (err: Response) => {
        this.msgPrompt("error", err.statusText);
        this.showSpinner = false;
      }
    );
  }

  msgPrompt(type?: string, message?: string) {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }
}
