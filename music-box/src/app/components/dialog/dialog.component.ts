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
  lookupType;
  artistData;
  albumTracksData;

  albumName: string;
  numOfTracks: number;

  favoriteTracksList = [];
  trackFavor: boolean = false;
  durationInSeconds = 2;
  favoritesStatus;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.lookupType = this.data.lookupType;
    if (this.data.artist) this.artistData = this.data.artist;

    if (this.data.albumTracks) {
      this.albumTracksData = this.data.albumTracks.items;
      this.albumName = this.data.albumName;
      this.numOfTracks = this.albumTracksData.length;
    }
    if (this.data.lookupType === "favorites") {
      this.favoriteTracksList = JSON.parse(this.getStorage("favoriteTracks"));
    }
  }

  ngAfterViewInit(): void {
    this.processFavorites();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setArtistName(name) {
    this.dataService.artistNameSet.next(name);
    this.dialogRef.close();
  }

  favorite(track, button: ElementRef) {
    let obj = this.getStorage("favoriteTracks");
    obj !== null
      ? (this.favoriteTracksList = JSON.parse(obj))
      : (this.favoriteTracksList = []);
    if (document.getElementById("button" + track.id).style.color === "red") {
      document.getElementById("button" + track.id).style.color = "black";
      this.removeFavorite(track.id);
    } else {
      this.favoriteTracksList.push(track);
      button["_elementRef"].nativeElement.style.color = "red";
      this.setStorage("favoriteTracks", this.favoriteTracksList);
      this.msgPrompt("notification", "Favorite added to list.");
    }
  }

  processFavorites() {
    let obj = this.getStorage("favoriteTracks");
    let favs;
    if (obj) {
      favs = JSON.parse(obj);
    }
    favs.forEach(track => {
      if (document.getElementById("button" + track.id))
        document.getElementById("button" + track.id).style.color = "red";
    });
  }

  removeFavorite(id) {
    let array = this.favoriteTracksList.filter(val => val.id != id);
    this.favoriteTracksList = array;
    this.setStorage("favoriteTracks", this.favoriteTracksList);
    this.msgPrompt("notification", "Favorite removed!");
  }

  getStorage(key) {
    return localStorage.getItem(key);
  }

  setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  msgPrompt(type?, message?) {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }
}
