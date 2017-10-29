import * as navigationActions from './navigation'
import * as dataActions from './login'

export const ActionCreators = Object.assign({},
  navigationActions,
  dataActions
);

console.log('ActionCreators: ' + JSON.stringify(ActionCreators));