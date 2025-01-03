import { User } from "./models/user.model";
import { authReducer } from "./store/reducer/auth.reducer";


export interface AppState {
  userState: User;
}

export const reducers = {
    userState: authReducer,
};
