import * as types from './types'
import * as utils from '../../lib/utils'

export const getDevices = () =>
    (dispatch, getState) =>
        {
            let accountId = getState().data.accountId;
            let tokens = getState().data.tokens;

            console.log(`accountId: ${accountId}`);
            console.log(`tokens: ${JSON.stringify(tokens)}`);
            dispatch(fetchDevices(accountId, tokens.access_token));

        }

const fetchDevices = (accountId, accessToken) =>
    dispatch => {
        try {
            return utils.fetchDevices(accountId, accessToken)
            .then(response => dispatch({type: types.DEVICE_RETRIEVAL_SUCCESS, data: response }));
        } catch(error) {
            dispatch({ type: types.DEVICE_RETRIEVAL_FAILED, error: {call: `https://svcs.myharmony.com/UserAccountDirectorPlatform/UserAccountDirector.svc/json2/Account/${accountId}/SimpleRestGetDeviceList`, error}});
        }
    }

export const login = (email, password, hubIp) =>
    (dispatch, getState) => {
        console.log('Inside login');
        Promise.all([
            dispatch(getProvisionInfo(hubIp)),
            dispatch(signInAndGetCookies(email, password))
        ])
        .then(response => { dispatch({type: types.GO_TO_SETTINGS}) },
              error => dispatch({type: types.LOGIN_FAILED, error: {message: 'Login failed'}})
        );
    }

const signInAndGetCookies = (email, password) =>
    (dispatch, getState) => {
        return utils.signIn(email, password)
        .then(response =>
            {
                dispatch({ type: types.LIP_SIGNIN_SUCCESS, data: response });
                try {
                    utils.getCookies(response);
                    dispatch({ type: types.BACKEND_SIGNIN_SUCCESS })
                } catch (error) {
                    dispatch({ type: types.BACKEND_SIGNIN_FAILED, error: {call: 'https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', error}});
                    //return Promise.reject(new Error(types.BACKEND_SIGNIN_FAILED));
                    throw error;
                }
            },
            error => {
                dispatch({ type: types.LIP_SIGNIN_FAILED, error: {call: 'https://accounts.logi.com/identity/signin', error}});
                throw error;
            });

    }

const getProvisionInfo = (hubIp) =>
        dispatch => {
            return utils.getProvisionInfo(hubIp)
                .then(response => { dispatch({type: types.GET_PROVISION_INFO_SUCCESS, message: {accountId: response}}) },
                    error => {
                        dispatch({ type: types.GET_PROVISION_INFO_FAILED, error: {call: `http://${hubIp}:8088/`, error}});
                        throw error;
                    });

        }
