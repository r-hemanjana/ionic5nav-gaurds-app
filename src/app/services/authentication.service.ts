import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';

import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null); //BehaviorSubject is different from Subject , it have initial value
  token = '';

  constructor(private http: HttpClient) { 
    this.loadToken();
  }

  async loadToken() {
    const token  = await Storage.get({key: TOKEN_KEY});
    if((token && token.value)){
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    }else{
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {email, password}):Observable<any> {
    return this.http.post('https://reqres.in/api/login', credentials).pipe(
      map((data:any) => data.token),  // plane mapping of data it extract token
      switchMap(token => {   // it switch data from original observable to new observable
        return from(Storage.set({key: TOKEN_KEY, value: token})); // see we return new Observable, Storage.set will return promise 'from' will transform a promise to an observable
      }),
      tap(_ => {  // tap look for an Observable
        this.isAuthenticated.next(true);   // call BehaviorSubject and emit new value with next, for more clarification look notes/New Documnent
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }
}