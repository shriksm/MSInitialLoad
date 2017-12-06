import { put, take, call, race, all, select } from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'

import * as types from '../actions/types'

let requestId = 0;
let remoteId = null;
let lastRequest = null;

function wsListener(socket) {
    return eventChannel((emit) => {
        socket.onopen = () => {
            emit({type: types.PING_HUB});
        };
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log(`received msg: ${JSON.stringify(msg)}`)
            emit(msg);
        };
        return () => {
            console.log('closing socket');
            socket.close();
        };
    });
}

const getTabascoAccessToken = (state) => (state.data.tokens.tabascoAt)
const getRemoteId = (state) => (state.data.ids.remoteId)

function* sendRequest(socket) {
    while (true) {
        const {payload} = yield take(types.WS_REQUEST_ACTION);
        console.log(`sent msg: ${JSON.stringify(payload)}`);

        if (!remoteId) {
            remoteId = yield select(getRemoteId);
        }

        let hbus = payload;
        hbus.id = ++requestId;

        let request = {
            hubId: remoteId,
            hbus: hbus
        };

        lastRequest = request;

        socket.send(JSON.stringify(request));
    }
}

function* onMessageReceived(socketChannel) {
    while (true) {
        const message = yield take(socketChannel)
        console.log(`received msg: ${JSON.stringify(message)}`)
        let tabascoAccessToken = yield select(getTabascoAccessToken);

        if (!remoteId) {
            remoteId = yield select(getRemoteId);
        }
        
        let payload = null;

        // message will contain "type" only when
        // 1. PING_HUB action is dispatched after successfully connecting to websocket, or
        // 2. When events are dispatched by the hub
        if (message.type) {
            if (message.type === types.PING_HUB) {
                payload = {
                    cmd: "connect.ping",
                    // When the Tabasco is modified to support Pavarotti, the "token" need not be 
                    // sent with every request
                    token: tabascoAccessToken 
                };
                yield put({type: types.WS_REQUEST_ACTION, payload: payload});
            } else {
                // Handle the events from hub
                yield put({type: types.WS_EVENT_RCVD, data: message});
            }
        } else { // This is a response for my request
            if (message.code === '200') { // The request succeeded
                let data = {cmd: lastRequest.hbus.cmd, data: message.data}
                yield put({type: types.WS_REQUEST_SUCCESS, data});
                lastRequest = null;
            } else { // The request failed
                let data = {cmd: lastRequest.hbus.cmd, message}
                yield put({type: types.WS_REQUEST_FAILED, error: data});
                lastRequest = null;
            }   

        }
    }
}

export default function* startWebsocket() {
    while (true) {
      const {payload} = yield take(types.START_WEBSOCKET_ACTION)

      console.log(`websocket action: ${JSON.stringify(payload)}`)

      const socket = new WebSocket(payload.uri);

      console.log(`websocket socket: ${socket}`)

      const socketChannel = yield call(wsListener, socket);
      const { cancel } = yield race({
        task: all([call(onMessageReceived, socketChannel), call(sendRequest, socket)]),
        cancel: take('STOP_WEBSOCKET')
      });
      if (cancel) {
        socketChannel.close();
      }
    }
  }