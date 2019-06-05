import { constants } from "./../../models/constants";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatSnackBar, PageEvent } from "@angular/material";

import { AuthorizationService } from "../../services/authorization.service";
import { DataService } from "../../services/data.service";
import { NotificationDialog } from "../notification-dialog/notification-dialog";
import { Release } from "../../models/release";

export interface Country {
  id: string;
  value: string;
}

@Component({
  selector: "app-hot-releases",
  templateUrl: "./hot-releases.component.html",
  styleUrls: ["./hot-releases.component.css"],
  // Encapsulation has to be disabled in order for the
  // component style to apply to the select panel.
  encapsulation: ViewEncapsulation.None
})
export class HotReleasesComponent implements OnInit {
  countries: Country[] = constants.countries;

  countryName: string;
  countrySelect = new FormControl();
  countryIDSet: string;
  showSpinner: boolean = false;

  displayedColumns: string[] = [
    "artist",
    "name",
    "type",
    "release_date",
    "image"
  ];

  dataSource: Release;
  length: number = 5;
  pageNumber: number = 0;
  pageSize: number = 5;
  durationInSeconds: number = 3;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authorization: AuthorizationService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.countrySelect.setValue("CH");
    this.countryName = "Switzerland";
    this.countryIDSet = "CH";
    this.getReleases(this.countryIDSet);

    this.countrySelect.valueChanges.subscribe((countryID: string) => {
      this.countryName = this.getCountryName(countryID);
      this.countryIDSet = countryID;
      this.getReleases(countryID);
    });
  }
  getCountryName(id: string) {
    return this.countries.find(n => n.id === id).value;
  }

  getReleases(country?: string, pagination?: PageEvent) {
    let tempCountryID = country ? country : this.countryIDSet;

    this.showSpinner = true;

    this.dataService.getReleases(tempCountryID, pagination).subscribe(
      res => {
        this.dataSource = res["albums"].items;

        this.length = res["albums"].total;
        this.showSpinner = false;
        let notificationmsg = this.length + " releases.";
        if (pagination === undefined)
          this.msgPrompt("notification", notificationmsg);
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

  setArtistName(name: string) {
    this.dataService.artistNameSet.next(name);
  }
}
