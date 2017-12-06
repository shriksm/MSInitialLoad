import * as types from "../actions/types"

export const loginReducer = (state = {}, action) => {
  let nextState;
//   console.log('login reducer: action ' + JSON.stringify(action));
//  console.log('login reducer: state ' + JSON.stringify(state));
  switch (action.type) {

    case types.LIP_SIGNIN_SUCCESS:
        nextState = Object.assign({}, state, {
                       tokens: action.data
                     });
        break;
    case types.LIP_SIGNIN_FAILED:
        nextState = Object.assign({}, state, {
                       tokens: action.message
                     });
        break;
    // No need to handle BACKEND_SIGNIN_SUCCESS because backend signin will only set the
    // cookies.
    case types.BACKEND_SIGNIN_SUCCESS:
        break;
    case types.BACKEND_SIGNIN_FAILED:
        nextState = Object.assign({}, state, {
                       signin: action.message
                     });
        break;
    case types.GET_IDS_SUCCESS:
        nextState = Object.assign({}, state, {
                       ids: action.data
                     });
        break;
    case types.TABASCO_TOKENS_SUCCESS:
        let tokens = state.tokens;
        tokens.rt = action.data.refresh_token;
        tokens.tabascoAt = action.data.access_token;
        nextState = Object.assign({}, state, {
                        tokens: tokens
                    });
        console.log('login reducer: nextState ' + JSON.stringify(nextState));
        break;          
    case types.DEVICE_RETRIEVAL_SUCCESS:
        nextState = Object.assign({}, state, {
                       devices: action.data
                     });
        break;
    case types.DEVICE_RETRIEVAL_FAILED:
        break;

  }

//  console.log('login reducer: nextState ' + JSON.stringify(nextState));

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}