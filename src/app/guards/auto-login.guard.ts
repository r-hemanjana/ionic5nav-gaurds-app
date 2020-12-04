import { Injectable } from '@angular/core';
import { CanLoad, Router, } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router){}
  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1), // it means we take 1 true/false and then observale finishes, if we dont add this take(1), then observale not finishes and it dont display tabs page.
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/tabs', {replaceUrl:true});
        }else {
          return true; // means access the login page.
        }
      })
    )
  }
}
