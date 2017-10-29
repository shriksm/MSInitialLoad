import { NavigationActions } from 'react-navigation';
import {AppNavigator} from "../navigators/AppNavigator"
import * as types from "../actions/types"

//Force a Init of the main router
let initialNavState = AppNavigator.router.getStateForAction(NavigationActions.init());

/*const firstAction = AppNavigator.router.getActionForPathAndParams('CardNavigator');

//Then calculate the state with a navigate action to the first route, sending the previous initialized state as argument
initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
  initialNavState
);*/

export const navReducer = (state = initialNavState, action) => {

  let nextState;
  switch (action.type) {
    case types.GO_TO_LOGIN:
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login' })
        ]
      });

      nextState = AppNavigator.router.getStateForAction(
                    resetAction,
                    state
                  );
      break;
    case types.GO_TO_SETTINGS:
      nextState = AppNavigator.router.getStateForAction(
                      NavigationActions.navigate({ routeName: 'Settings' }),
                      state
                    );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }


  console.log('nextState: ' + JSON.stringify(nextState));

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;

};