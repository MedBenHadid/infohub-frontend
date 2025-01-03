import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../api/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      mergeMap((action) =>
        this.authService.signIn(action.email, action.password).pipe(
          map((response: any) =>
            AuthActions.signInSuccess({ user: response.user })
          ),
          catchError((error) => of(AuthActions.signInFailure({ error })))
        )
      )
    )
  );
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUser),
      mergeMap((action) =>
        this.authService.userByToken().pipe(
          map((response: any) =>
            AuthActions.getUserSuccess({ user: response.user })
          ),
          catchError((error) => of(AuthActions.signInFailure({ error })))
        )
      )
    )
  );

  signInSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        tap(() => this.router.navigateByUrl('/home'))
      ),
    { dispatch: false }
  );
  getUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getUserSuccess)
        // tap(() => this.router.navigateByUrl('/home'))
      ),
    { dispatch: false }
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logOut),
      mergeMap(() => {
        console.log('logged out');
        return this.authService.logOut().pipe(
          map(() => AuthActions.logOutSuccess()),
          tap(() => this.router.navigateByUrl('/login'))
        );
      })
    )
  );
}
