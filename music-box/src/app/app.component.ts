import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "music-box";
  isCollapsed = true;

  favorites;

  constructor(public dialog: MatDialog) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  openFavorites() {
    let status: boolean;
    let favoritesObj = localStorage.getItem("favoriteTracks");
    if (favoritesObj) {
      status = true;
      this.favorites = JSON.parse(favoritesObj);
    } else {
      status = false;
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "450px",
      autoFocus: false,
      data: {
        favoritesList: this.favorites,
        lookupType: "favorites",
        noFavs: !status
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
