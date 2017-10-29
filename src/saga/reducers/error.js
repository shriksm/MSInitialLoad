import * as types from '../actions/types'

// Updates error message to notify about the failed fetches.
export const errorReducer = (state = null, action) => {
  const { type, error } = action

  console.log('error reducer: action ' + JSON.stringify(action));
  console.log('error reducer: state ' + JSON.stringify(state));

  if (type === types.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}