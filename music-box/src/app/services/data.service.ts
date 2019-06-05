import { Artist } from "./../models/artist";
import { PageEvent } from "@angular/material";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { AuthorizationService } from "./authorization.service";

@Injectable({
  providedIn: "root"
})
export class DataService {
  // using this to pass the artist name for components that are not siblings
  artistNameSet = new BehaviorSubject("");

  constructor(
    private http: HttpClient,
    private authorization: AuthorizationService
  ) {}

  search(searchValue: string, params: PageEvent) {
    // These are default values on search
    let limit = params ? params.pageSize : "5";
    let offset = params ? params.pageIndex : "0";

    let url =
      this.authorization.getBaseUrl() +
      "/search?q=" +
      searchValue +
      "&type=artist" +
      "&limit=" +
      limit +
      "&offset=" +
      offset;

    return this.http.get(url);
  }

  openArtistInfo(artist: Artist) {
    let url = this.authorization.getBaseUrl() + "/artists/" + artist.id;

    return this.http.get(url);
  }

  getAlbums(artistID: string, params: PageEvent) {
    let limit = params ? params.pageSize : "5";
    let offset = params ? params.pageIndex : "0";

    let url =
      this.authorization.getBaseUrl() +
      "/artists/" +
      artistID +
      "/albums?" +
      "limit=" +
      limit +
      "&offset=" +
      offset;

    return this.http.get(url);
  }

  getAlbumTracks(album) {
    let url =
      this.authorization.getBaseUrl() + "/albums/" + album.id + "/tracks";

    return this.http.get(url);
  }

  getReleases(countryID: string, params: PageEvent) {
    let limit = params ? params.pageSize : "5";
    let offset = params ? params.pageIndex : "0";

    let url =
      this.authorization.getBaseUrl() +
      "/browse/new-releases?country=" +
      countryID +
      "&limit=" +
      limit +
      "&offset=" +
      offset;

    return this.http.get(url);
  }
}
