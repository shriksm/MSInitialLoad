import { all } from 'redux-saga/effects'

import * as loginSagas from './login'
import startWebsocket from './websocket'


// single entry point to start all Sagas at once
export default rootSaga = function* () {
  yield all([
    loginSagas.login(),
    loginSagas.getDevices(),
    startWebsocket()
  ])
}
