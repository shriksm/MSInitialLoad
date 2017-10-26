
export const navigateTo = (screenName, extras) =>
      (dispatch, getState) => {
          console.log({type: screenName, extras});
          dispatch({
            type: screenName,
            extras
          })
      }

