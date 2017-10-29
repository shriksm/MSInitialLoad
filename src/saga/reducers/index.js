import { combineReducers } from 'redux';
import * as navigationReducers from './navigation'
import * as loginReducers from './login'
import * as errorReducers from './error'

export const appReducers = combineReducers({
  nav: navigationReducers.navReducer,
  data: loginReducers.loginReducer,
  error: errorReducers.errorReducer
})

