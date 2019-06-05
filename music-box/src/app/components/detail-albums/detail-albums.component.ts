import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { Albums } from '../../models/albums';
import { DataService } from '../../services/data.service';
import { DialogComponent } from '../dialog/dialog.component';
import { NotificationDialog } from '../notification-dialog/notification-dialog';

@Component({
  selector: "app-detail-albums",
  templateUrl: "./detail-albums.component.html",
  styleUrls: ["./detail-albums.component.css"]
})
export class DetailAlbumsComponent implements OnInit {
  artistID: string;
  albumObj;

  showSpinner: boolean = false;

  artistName: string;
  displayedColumns: string[] = ["name", "type", "contributors", "image"];
  dataSource: Albums;
  length = 5;
  pageNumber = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  durationInSeconds = 3;
  private sub: any;

  constructor(
    private aRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.sub = this.aRoute.params.subscribe(val => {
      this.artistID = val.id;
      this.getAlbums();
    });
    this.dataService.artistNameSet.subscribe(val => {
      this.artistName = val;
      if (this.artistName) this.setStorage("artistName", this.artistName);
    });
    if (!this.artistName) {
      this.artistName = this.getStorage("artistName");
    }
  }

  getAlbums(pagination?: PageEvent) {
    this.showSpinner = true;

    this.dataService.getAlbums(this.artistID, pagination).subscribe(
      res => {
        this.dataSource = res["items"];
        this.length = res["total"];
        this.showSpinner = false;
        let notificationmsg = "There are " + this.length + " albums.";
        if (pagination === undefined)
          this.msgPrompt("notification", notificationmsg);
      },
      (err: Response) => {
        this.msgPrompt("error", err.statusText);
        this.showSpinner = false;
      }
    );
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

  setStorage(key, value) {
    localStorage.setItem(key, value.toString());
  }

  getStorage(key) {
    return localStorage.getItem(key);
  }

  openAlbumTracks(album) {
    this.showSpinner = true;
    let albumObj;

    this.dataService.getAlbumTracks(album).subscribe(
      res => {
        albumObj = res;
        const dialogRef = this.dialog.open(DialogComponent, {
          width: "490px",
          autoFocus: false,
          data: {
            albumTracks: albumObj,
            lookupType: "albumTracks",
            albumName: album.name
          }
        });
        dialogRef.afterClosed().subscribe(result => {});
        this.showSpinner = false;
      },
      err => {
        console.error(err);
        this.msgPrompt("error", "Error while fetching the data.");

        this.showSpinner = false;
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
