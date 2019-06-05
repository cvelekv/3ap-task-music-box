import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationService {
  protected basePath = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  //used in pipe so the image could be loaded
  getImage(url): Observable<any> {
    return this.http.get(url, { responseType: "blob" });
  }
  getBaseUrl() {
    return this.basePath;
  }
}
