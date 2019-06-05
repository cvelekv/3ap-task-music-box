import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSnackBar, PageEvent } from '@angular/material';

import { AuthorizationService } from '../../services/authorization.service';
import { DataService } from '../../services/data.service';
import { NotificationDialog } from '../notification-dialog/notification-dialog';
import { Releases } from './../../models/releases';

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
  countries: Country[] = [
    { id: "CH", value: "Switzerland" },
    { id: "AT", value: "Austria" },
    { id: "DE", value: "Germany" },
    { id: "SE", value: "Sweden" },
    { id: "NO", value: "Norway" },
    { id: "US", value: "USA" }
  ];

  countryName: string;
  countrySelect = new FormControl();
  countryIDSet;
  showSpinner: boolean = false;

  displayedColumns: string[] = [
    "artist",
    "name",
    "type",
    "release_date",
    "image"
  ];

  dataSource: Releases;
  length = 5;
  pageNumber = 0;
  pageSize = 5;
  durationInSeconds = 3;

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
  getCountryName(id) {
    return this.countries.find(n => n.id === id).value;
  }

  getReleases(country?, pagination?: PageEvent) {
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

  msgPrompt(type?, message?) {
    this.snackBar.openFromComponent(NotificationDialog, {
      duration: this.durationInSeconds * 1000,
      data: { type: type, msg: message }
    });
  }

  setArtistName(name) {
    this.dataService.artistNameSet.next(name);
  }
}
