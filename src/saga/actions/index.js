import * as types from './types'


export const ActionCreators = {
    getDevices: () => ({type: types.GET_DEVICES_ACTION}),

    login: (email, password, hubIp) => ({type: types.LOGIN_ACTION, payload: {email, password, hubIp}}),

    navigateTo: (screenName, extras) => ({type: screenName, extras}),
}
//export const getDevices = () => ({type: types.GET_DEVICES_ACTION})
//
//export const login = (email, password, hubIp) => ({type: types.LOGIN_ACTION, payload: {email, password, hubIp}})
//
//export const navigateTo = (screenName, extras) => ({type: screenName, extras})
