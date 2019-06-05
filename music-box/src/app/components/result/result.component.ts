import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSnackBar,
  PageEvent,
  MatTableDataSource
} from "@angular/material";

import { Artist } from "../../models/artist";
import { DialogComponent } from "../dialog/dialog.component";
import { NotificationDialog } from "../notification-dialog/notification-dialog";
import { DataService } from "./../../services/data.service";

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
    this.recentlyVisibleLimit = parseInt(this.getStorage("recentVisible"));
    this.recentlyStoreLimit = parseInt(this.getStorage("recentStore"));

    let retrievedObj = this.getStorage("recentlyObj");
    try {
      this.recentlyViewed =
        retrievedObj !== null ? JSON.parse(retrievedObj) : [];
    } catch (error) {
      console.error("Error while parsing JSON", error);
    }
  }

  // creating object to use as data source in table result
  handleResultData(data) {
    data.items.forEach(v => {
      this.artistData.push({
        id: v.id,
        artistName: v.name,
        image: v.images ? v.images[0] : ""
      });
    });
    this.dataSource = this.artistData;
    console.log("DATA SOURCE", this.dataSource);
    this.length = data.total;
  }

  // if pagination is changed it has to be sent to sibling component so the search will be triggered
  emitPagination(val: PageEvent) {
    this.setPagination.emit(val);
  }

  //This prevents adding the same artist to recently viewed and adding that one to the top of the list.
  arrangeList(artist: Artist) {
    let counters = this.recentlyViewed.filter(c => c.id !== artist.id);
    counters.unshift(artist);
    this.setStorage("recentlyObj", counters);
  }

  addToRecentlyViewed(val) {
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
      this.setStorage("recentlyObj", this.recentlyViewed);
    }
  }

  setStorage(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error while parsing JSON.");
    }
  }

  getStorage(key: string) {
    return localStorage.getItem(key);
  }

  openArtistInfo(artist: any) {
    console.log("artist info open", artist);
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

  msgPrompt(type?, message?) {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }
}
