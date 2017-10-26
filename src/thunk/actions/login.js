import * as types from './types'
import {handleErrors} from '../lib/utils'

export const getDevices = () =>
    (dispatch, getState) =>
        {
            let accountId = getState().data.accountId;
            let tokens = getState().data.tokens;

            console.log('accountId: `${accountId}`');
            console.log('tokens: `${tokens}`');
            dispatch(fetchDevices(accountId, tokens));

        }

const fetchDevices = (accountId, accessToken) =>
    dispatch => {
        return fetch('https://svcs.myharmony.com/UserAccountDirectorPlatform/UserAccountDirector.svc/json2/Account/' + accountId + '/SimpleRestGetDeviceList', {
            method: 'GET',
            credentials: 'same-origin', // Will include the cookies in the header. Reqd for iOS
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(handleErrors)
        .then(response => {
                //console.log('response from service end point: ' + JSON.stringify(response));
                return response.text();
             }
        )
        .then(response => {
            try {
                //console.log(response);
                let jsonResponse = JSON.parse(response);
                //console.log('jsonDevicesData: ' + JSON.stringify(jsonResponse.DevicesWithFeatures));
                dispatch({type: types.DEVICE_RETRIEVAL_SUCCESS, data: jsonResponse.DevicesWithFeatures })
            } catch (exception) {
                throw exception
            }
        })
        .catch(err => {
              dispatch({ type: types.DEVICE_RETRIEVAL_FAILED, error: {call: 'https://svcs.myharmony.com/UserAccountDirectorPlatform/UserAccountDirector.svc/json2/Account/' + accountId + '/SimpleRestGetDeviceList', error}});
          });
    }

export const login = (email, password, hubIp) =>
    (dispatch, getState) =>
        {
            console.log('Inside login');
            Promise.all([
                dispatch(getProvisionInfo(hubIp)),
                dispatch(signInAndGetCookies(email, password))
            ])
            .then(response => { console.log('login response: ' + response); dispatch({type: types.GO_TO_SETTINGS})},
                  error => dispatch({type: types.ERROR, error: {message: 'Login failed'}})
            );
        }

const signInAndGetCookies = (email, password) =>
    (dispatch, getState) => {
        return dispatch(signIn(email, password)).then(() => {
          console.log('^^^^^^^^^^^^^^^ getState: ' + JSON.stringify(getState()));
          const tokens = getState().data.tokens;
          return dispatch(getCookies(tokens))
        })
    }

const signIn = (email, password) =>
       dispatch => {
            return fetch('https://accounts.logi.com/identity/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: JSON.stringify({
                    "channel_id": "0a024d3b-1222-4a6f-8ae2-f1c2e2266997",
                    "create": false,
                    "email": email,
                    "password": password,
                    "verify_email": false,
                    "client_id": "aa10d1b6-d851-444c-8c80-7f63522cc3sd"
                })
            })
            .then(handleErrors)
            .then(response => {
                    //console.log(response);
                    return response.text();
                })
                .then(response => {
                    try {
                        //console.log(response);
                        let jsonResponse = JSON.parse(response);
                        //console.log('identity/signin: ' + jsonResponse);
                        const tokens = {
                                           id_token: jsonResponse.id_token,
                                           access_token: jsonResponse.access_token
                                       };
                        dispatch({
                            type: types.LIP_SIGNIN_SUCCESS,
                            data: tokens
                        });
                    } catch (exception) {
                        throw exception;
                    }
                })
            .catch (error => {
                    dispatch({ type: types.LIP_SIGNIN_FAILED, error: {call: 'https://accounts.logi.com/identity/signin', error}});
                    throw error;
                })


       }


const getCookies = (tokens) =>
        dispatch => {
            console.log('&&&&&&&&&&&&& getCookies: ' + JSON.stringify(tokens));

            if (!(tokens || tokens.id_token || tokens.access_token)) {
                dispatch({ type: types.BACKEND_SIGNIN_FAILED, error: {message: 'One or more tokens missing', tokens}});
                throw Error('One or more tokens are null: tokens: ' + tokens);
            }
            let accessToken = tokens.access_token;

            return fetch('https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    "reqId": "1",
                    "id_token": tokens.id_token,
                    "access_token": accessToken
                })
            })
            .then(handleErrors)
            .then((response) => {
                    try {
                        dispatch({
                                    type: types.BACKEND_SIGNIN_SUCCESS,
                                });
                    } catch (exception) {
                        throw exception;
                    }
                })
            .catch (error => {
                    dispatch({ type: types.BACKEND_SIGNIN_FAILED, error: {call: 'https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', error}});
                    throw error;
                })
        }

const getProvisionInfo = (hubIp) =>
        dispatch => {
            //console.log('Inside getProvisionInfo tokensWithCookie: ' + tokensWithCookie);
            return fetch('http://' + hubIp + ':8088/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://sl.dhg.myharmony.com'
                },
                body: JSON.stringify({
                    "id": 1,
                    "cmd": "setup.account?getProvisionInfo",
                    "timeout": 90000
                })
            })
            .then(handleErrors)
            .then(response => {
                    //console.log(response);
                    return response.text();
                })
            .then(response => {
                    console.log('******** provInfo response: ' + response);
                    try {
                        let provInfo = JSON.parse(response);
                        dispatch({
                            type: types.GET_PROVISION_INFO_SUCCESS,
                            message: {
                                accountId: provInfo.data.accountId
                            }
                        })
                    } catch (exception) {
                        throw exception;
                    }
                })
            .catch (error => {
                    console.log('******** provInfo catch: ' + error);
                    throw error;
                })


            .then((response) => {

                })

            /*.then(handleErrors)
            .then(response => {
                    //console.log(response);
                    return response.text();
                },
                error => {
                    Promise.reject('Unable to retrieve response for setup.account?getProvisionInfo');
                }
            )
            .then(response => {
                    if (response) {
                        console.log('******** provInfo: ' + response);
                        let provInfo = JSON.parse(response);
                        dispatch({
                            type: types.GET_PROVISION_INFO_SUCCESS,
                            message: {
                                accountId: provInfo.data.accountId
                            }
                        })
                        Promise.resolve({accountId: provInfo.data.accountId});
                    } else {
                        Promise.reject('Unable to retrieve response for setup.account?getProvisionInfo');
                    }
                })*/
            /*.catch(error => {
                    dispatch({ type: types.GET_PROVISION_INFO_FAILED, error: {call: 'http://' + hubIp + ':8088/', error}});
                    throw error;
                }
            );*/
        }
