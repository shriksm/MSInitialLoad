import * as loginSagas from './login'
import { all } from 'redux-saga/effects'


// single entry point to start all Sagas at once
export default rootSaga = function* () {
  yield all([
    loginSagas.login(),
    loginSagas.getDevices()
  ])
}
