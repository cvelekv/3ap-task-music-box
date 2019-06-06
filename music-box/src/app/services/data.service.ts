import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { Artist } from './../models/artist';
import { AuthorizationService } from './authorization.service';

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

  search(searchValue: string, params: PageEvent):Observable<any> {
    // These are default values on search
    const limit = params ? params.pageSize : "5";
    const offset = params ? params.pageIndex : "0";
    const url = `${this.authorization.getBaseUrl()}/search?q=${searchValue}&type=artist&limit=${limit}&offset=${offset}`;

    return this.http.get(url);
  }

  openArtistInfo(artist: Artist):Observable<any> {
    const url = `${this.authorization.getBaseUrl()}/artists/${artist.id}`;

    return this.http.get(url);
  }

  getAlbums(artistID: string, params: PageEvent):Observable<any> {
    const limit = params ? params.pageSize : "5";
    const offset = params ? params.pageIndex : "0";
    const url = `${this.authorization.getBaseUrl()}/artists/${artistID}/albums?limit=${limit}&offset=${offset}`;

    return this.http.get(url);
  }

  getAlbumTracks(album) {
    const url = `${this.authorization.getBaseUrl()}/albums/${album.id}/tracks`;

    return this.http.get(url);
  }

  getReleases(countryID: string, params: PageEvent):Observable<any> {
    const limit = params ? params.pageSize : "5";
    const offset = params ? params.pageIndex : "0";
    const url = `${this.authorization.getBaseUrl()}/browse/new-releases?country=${countryID}&limit=${limit}&offset=${offset}`;

    return this.http.get(url);
  }
}
