import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  error: any;
}

export const initialState: AuthState = {
  user: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.signInSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(AuthActions.getUserSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(AuthActions.signInFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.logOutSuccess, (state) => ({ ...state, user: null })),
  on(AuthActions.logOutFailure, (state, { error }) => ({ ...state, error }))
);
