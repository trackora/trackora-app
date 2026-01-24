import {combineReducers} from 'redux';
import loginReducer from './login.slice'
import adminSlice from './admin.slice';
import userSlice from './user.slice';
export const rootReducer = combineReducers({
  login: loginReducer,
  admin: adminSlice,
  user: userSlice,
});
