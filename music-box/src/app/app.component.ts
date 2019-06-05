import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DialogComponent } from "./components/dialog/dialog.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  isCollapsed: boolean = true;

  favorites: any = {};

  constructor(public dialog: MatDialog) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  openFavorites() {
    let status: boolean;
    const favoritesObj = localStorage.getItem("favoriteTracks");
    if (favoritesObj) {
      status = true;
      try {
        this.favorites = JSON.parse(favoritesObj);
      } catch (error) {
        console.error("Error while parsing JSON");
      }
    } else {
      status = false;
    }
    this.dialog.open(DialogComponent, {
      width: "450px",
      autoFocus: false,
      data: {
        favoritesList: this.favorites,
        lookupType: "favorites",
        noFavs: !status
      }
    });
  }
}
