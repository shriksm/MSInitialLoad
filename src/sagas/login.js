import * as utils from '../lib/utils'
import * as types from '../actions/types'

import { put, take, call, select, all } from 'redux-saga/effects'

const signIn = function* (email, password) {
    try {
        let tokens = yield call(utils.signIn, email, password);
        yield put({ type: types.LIP_SIGNIN_SUCCESS, data: tokens});
        return tokens;
    } catch(error) {
        yield put({ type: types.LIP_SIGNIN_FAILED, error: {call: 'https://accounts.logi.com/identity/signin', error}});
        throw error;
    }
}

const getRefreshToken = function* (tokens) {
    try {
        refreshToken = yield call(utils.getTabascoTokens, tokens);
        console.log(`refresh token: ${refreshToken.refresh_token}; access token: ${refreshToken.access_token}`);
        yield put({ type: types.TABASCO_TOKENS_SUCCESS, data: refreshToken});
        return refreshToken;
    } catch (error) {
        console.log(`error retrieving refresh token: ${JSON.stringify(error)}`);
        yield put({ type: types.TABASCO_TOKENS_FAILED, error: {call: 'https://home.myharmony.com/oauth2/token', error}});
        throw error;
    }
}

const getCookies = function* (tokens) {
    try {
        yield call(utils.getCookies, tokens);
        yield put({type: types.BACKEND_SIGNIN_SUCCESS});
    } catch (error) {
        console.log('error: ' + error);
        yield put({ type: types.BACKEND_SIGNIN_FAILED, error: {call: 'https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', error}});
        throw error;
    }
}

const getDiscoveryInfo = function* (hubIp) {
    try {
        let ids = yield call(utils.getDiscoveryInfo, hubIp);
        yield put({type: types.GET_IDS_SUCCESS, data: ids});
        return ids;
    } catch (error) {
        console.log('error: ' + error);
        yield put({ type: types.GET_IDS_FAILED, error: {call: 'getDiscoveryInfo', error}});
        throw error;
    }
}

const initWs = function* (uri) {
    
    yield put({ type: types.START_WEBSOCKET_ACTION, payload: {uri: uri}});
}

export const login = function* () {
    while (true) {
        const action = yield take(types.LOGIN_ACTION);
        console.log(`login action: ${JSON.stringify(action)}`);
        try {
            const [tokens, ids] = yield all([
                call(signIn, action.payload.email, action.payload.password),
                call(getDiscoveryInfo, action.payload.hubIp)
            ]);

            const [id, tabascoTokens] = yield all([
                call(getCookies, tokens),
                call(getRefreshToken, tokens),
            ]);
            
            console.log(`login tokens: ${JSON.stringify(tabascoTokens)}`)
            // When the Tabasco is modified to support Pavarotti, the "auth" query param's value will be 
            // replaced by LIP access token instead of the current Tabasco's refresh token
            const uri = `wss://home.myharmony.com/cloudapi/connect?auth=${tabascoTokens.refresh_token}`;

            yield call(initWs, uri);

            yield put({type: types.GO_TO_SETTINGS});

        } catch (error) {
            yield put({type: types.LOGIN_FAILED, error: {message: 'Login failed'}});
        }
    }
}

const getAccountId = (state) => (state.data.ids.accountId)
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