import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Album } from '../../models/album';
import { DataService } from '../../services/data.service';
import { DialogComponent } from '../dialog/dialog.component';
import { NotificationDialog } from '../notification-dialog/notification-dialog';
import { StorageService } from './../../services/storage.service';

@Component({
  selector: "app-detail-albums",
  templateUrl: "./detail-albums.component.html",
  styleUrls: ["./detail-albums.component.css"]
})
export class DetailAlbumsComponent implements OnInit {
  artistID: string;
  showSpinner: boolean = false;
  artistName: string;
  displayedColumns: string[] = ["name", "type", "contributors", "image"];
  dataSource: Album;
  length: number = 5;
  pageNumber: number = 0;
  pageSize: number = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  durationInSeconds: number = 3;
  private sub: any;

  constructor(
    private aRoute: ActivatedRoute,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.sub = this.aRoute.params.subscribe(val => {
      this.artistID = val.id;
      this.getAlbums();
    });
    this.dataService.artistNameSet.subscribe(val => {
      this.artistName = val;
      if (this.artistName) {
        this.storageService.setItemToStorage("artistName", this.artistName);
      }
    });
    if (!this.artistName) {
      this.artistName = this.storageService.getItemFromStorage("artistName");
    }
  }

  getAlbums(pagination?: PageEvent): void {
    this.showSpinner = true;

    this.dataService.getAlbums(this.artistID, pagination).subscribe(
      res => {
        this.dataSource = res["items"];
        this.length = res["total"];
        this.showSpinner = false;
        let notificationmsg = `There are ${this.length} albums.`;
        if (pagination === undefined)
          this.msgPrompt("notification", notificationmsg);
      },
      (err: Response) => {
        this.msgPrompt("error", err.statusText);
        this.showSpinner = false;
      }
    );
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

  openAlbumTracks(album: Album): void {
    this.showSpinner = true;

    this.dataService.getAlbumTracks(album).subscribe(
      res => {
        const albumObj = res;
        this.dialog.open(DialogComponent, {
          width: "490px",
          autoFocus: false,
          data: {
            albumTracks: albumObj,
            lookupType: "albumTracks",
            albumName: album.name
          }
        });

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
