import React from 'react'
import { AppRegistry } from 'react-native'
import {AppWithNavigationState} from './navigators/AppNavigator'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { appReducers } from './reducers'

import { NavigationActions } from 'react-navigation';
import {AppNavigator} from "./navigators/AppNavigator"
import * as types from "./actions/types"



function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware
    )
  );
  return createStore(appReducers, initialState, enhancer);
}

const store = configureStore({});

export const App = () => (
  <Provider store={store}>
    <AppWithNavigationState />
  </Provider>
)



