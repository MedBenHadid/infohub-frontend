import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectUser } from './store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class IsAdmin implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectUser).pipe(
      map((store) => {
        return store?.user?.role?.id == 1;
      })
    );
  }
}
