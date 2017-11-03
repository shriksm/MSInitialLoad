import React from 'react'
import { AppRegistry } from 'react-native'
import {AppWithNavigationState} from './navigators/AppNavigator'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { appReducers } from './reducers'

import { NavigationActions } from 'react-navigation';
import * as types from './actions/types'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware();
function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      sagaMiddleware
    )
  );
  return createStore(appReducers, initialState, enhancer);
}


const store = configureStore({});

sagaMiddleware.run(rootSaga);

export const App = () => (
  <Provider store={store}>
    <AppWithNavigationState />
  </Provider>
)



