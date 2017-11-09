import * as utils from '../lib/utils'
import * as types from '../actions/types'

import { put, take, call, select, all } from 'redux-saga/effects'

const signInAndGetCookies = function* (email, password) {
    let tokens = {};
    try {
        tokens = yield call(utils.signIn, email, password);
        yield put({ type: types.LIP_SIGNIN_SUCCESS, data: tokens});
    } catch(error) {
        yield put({ type: types.LIP_SIGNIN_FAILED, error: {call: 'https://accounts.logi.com/identity/signin', error}});
        throw error;
    }

    try {
        yield call(utils.getCookies, tokens);
        yield put({type: types.BACKEND_SIGNIN_SUCCESS});
    } catch (error) {
        console.log('error: ' + error);
        yield put({ type: types.BACKEND_SIGNIN_FAILED, error: {call: 'https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', error}});
        throw error;
    }
}

const getProvisionInfo = function* (hubIp) {
    try {
        const accountId = yield call(utils.getProvisionInfo, hubIp);
        yield put({type: types.GET_PROVISION_INFO_SUCCESS, message: {accountId: accountId}});
    } catch (error) {
        yield put({ type: types.GET_PROVISION_INFO_FAILED, error: {call: `http://${hubIp}:8088/`, error}});
        throw error;
    }
}

export const login = function* () {
    while (true) {
        const action = yield take(types.LOGIN_ACTION);
        try {
            yield all([
                call(signInAndGetCookies, action.payload.email, action.payload.password),
                call(getProvisionInfo, action.payload.hubIp)
            ]);
            yield put({type: types.GO_TO_SETTINGS});
        } catch (error) {
            yield put({type: types.LOGIN_FAILED, error: {message: 'Login failed'}});
        }
    }
}

const getAccountId = (state) => (state.data.accountId)
const getTokens = (state) => (state.data.tokens)

export const getDevices = function* () {
    while (true) {
        yield take(types.GET_DEVICES_ACTION);
        let accountId = yield select(getAccountId);
        let tokens = yield select(getTokens);
        console.log('accountId: ' + accountId);
        console.log('tokens: ' + tokens);
        yield call(fetchDevices, accountId, tokens.access_token);
    }
}

const fetchDevices = function* (accountId, accessToken) {
    try {
        let devices = yield call(utils.fetchDevices, accountId, accessToken);
        if (devices) {
            yield put({type: types.DEVICE_RETRIEVAL_SUCCESS, data: devices });
        } else {
            throw Error('Devices are empty or null');
        }
    } catch(error) {
        yield put({ type: types.DEVICE_RETRIEVAL_FAILED, error: {call: `https://svcs.myharmony.com/UserAccountDirectorPlatform/UserAccountDirector.svc/json2/Account/${accountId}/SimpleRestGetDeviceList`, error}});
    }
}