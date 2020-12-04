import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

export const INTRO_KEY = 'intro-seen';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) {}

  async canLoad(): Promise<boolean> {
    const hasSeenIntro = await Storage.get({key: INTRO_KEY})

    if(hasSeenIntro && (hasSeenIntro.value === 'true')){ // Strorage only store strings , so === 'true' we checking
      return true; // if user already seen intro wants to navigate to login
    } else{
      this.router.navigateByUrl('/intro', { replaceUrl:true }); //replaceUrl:true to reset the navigation stack
    }
    return true;
  }
}
