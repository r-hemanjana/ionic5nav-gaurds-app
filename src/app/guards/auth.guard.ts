import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router){}
  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1), // it means we take 1 true/false and then observale finishes, if we dont add this take(1), then observale not finishes and it dont display tabs page.
      map(isAuthenticated => {
        console.log('GUARD', isAuthenticated)  // we got null becoz null is default/first value of isAuthenticate, we need to add filter and filter out null value 
        if (isAuthenticated) {
          return true;  // if true then it goes to tabs, canLoad will only load tabs if these guards turns to true
        }else {
          this.router.navigateByUrl('/login')
          return false;
        }
      })
    )
  }
}
