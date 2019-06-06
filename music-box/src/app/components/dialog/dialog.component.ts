import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { NotificationDialog } from '../notification-dialog/notification-dialog';
import { DataService } from './../../services/data.service';

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"]
})
export class DialogComponent implements OnInit, AfterViewInit {
  lookupType: string;
  artistData: any;
  albumTracksData: any;

  albumName: string;
  numOfTracks: number;

  favoriteTracksList = [];
  trackFavor: boolean = false;
  durationInSeconds: number = 2;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.lookupType = this.data.lookupType;
    if (this.data.artist) {
      console.log("artistData", this.data.artist);
      this.artistData = this.data.artist;
    }

    if (this.data.albumTracks) {
      console.log("albumTracksData", this.data.albumTracks);

      this.albumTracksData = this.data.albumTracks.items;
      this.albumName = this.data.albumName;
      this.numOfTracks = this.albumTracksData.length;
    }
    if (this.data.lookupType === "favorites") {
      try {
        this.favoriteTracksList = JSON.parse(
          this.getItemFromStorage("favoriteTracks")
        );
      } catch (error) {
        console.error("Error while parsing JSON.");
      }
    }
  }

  ngAfterViewInit(): void {
    this.processFavorites();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setArtistName(name: string): void {
    this.dataService.artistNameSet.next(name);
    this.dialogRef.close();
  }

  favorite(track: any, button: ElementRef): void {
    let obj = this.getItemFromStorage("favoriteTracks");
    obj !== null
      ? (this.favoriteTracksList = JSON.parse(obj))
      : (this.favoriteTracksList = []);
    if (document.getElementById("button" + track.id).style.color === "red") {
      document.getElementById("button" + track.id).style.color = "black";
      this.removeFavorite(track.id);
    } else {
      this.favoriteTracksList.push(track);
      button["_elementRef"].nativeElement.style.color = "red";
      this.setItemToStorage("favoriteTracks", this.favoriteTracksList);
      this.msgPrompt("notification", "Favorite added to list.");
    }
  }

  processFavorites(): void {
    let obj = this.getItemFromStorage("favoriteTracks");
    let favs;
    if (obj) {
      favs = JSON.parse(obj);
    }
    favs.forEach(track => {
      if (document.getElementById("button" + track.id))
        document.getElementById("button" + track.id).style.color = "red";
    });
  }

  removeFavorite(id: number): void {
    let array = this.favoriteTracksList.filter(val => val.id != id);
    this.favoriteTracksList = array;
    this.setItemToStorage("favoriteTracks", this.favoriteTracksList);
    this.msgPrompt("notification", "Favorite removed!");
  }

  getItemFromStorage(key: string): string {
    return localStorage.getItem(key);
  }

  setItemToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  msgPrompt(type?: string, message?: string): void {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }
}
