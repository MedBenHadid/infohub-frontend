import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectUser } from './store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): boolean {
    let access_token = localStorage.getItem('access_token');

    if (access_token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
