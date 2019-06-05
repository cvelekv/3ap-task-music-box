import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationService } from './../services/authorization.service';

@Pipe({
  name: "securePipe"
})
export class SecurePipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer,
    private authorization: AuthorizationService
  ) {}

  transform(url): Observable<SafeUrl> {
    return this.authorization
      .getImage(url)
      .pipe(
        map(val =>
          this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))
        )
      );
  }
}
