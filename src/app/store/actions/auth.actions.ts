import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const signIn = createAction(
  '[Auth] Sign In',
  props<{ email: string; password: string }>()
);

export const signInSuccess = createAction(
  '[Auth] Sign In Success',
  props<{ user: User }>()
);
export const getUser = createAction('[User] Get User');
export const getUserSuccess = createAction(
  '[User] Get User Success',
  props<{ user: User }>()
);

export const signInFailure = createAction(
  '[Auth] Sign In Failure',
  props<{ error: any }>()
);

export const logOut = createAction('[Auth] Log Out');
export const logOutSuccess = createAction('[Auth] Log Out Success');
export const logOutFailure = createAction(
  '[Auth] Log Out Failure',
  props<{ error: any }>()
);
