/**
 * Splash screen for the app.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };

  }


  onEnd = () => {
    const { dispatch } = this.props.navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    });
    dispatch(resetAction);
  };

  // header: null will hide the title bar from the screen
  static navigationOptions = { title: 'Splash', header: null };

  componentDidMount() {
    console.log('Splashscreen: componentDidMount');
    setTimeout(
          () => {
            this.setState((previousState) => {
                          return { redirect: !previousState.redirect };
                      });
          },
          2000
        );
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Splashscreen: componentDidUpdate');
    // Have to call onEnd() from within componentDidUpdate otherwise a warning will be displayed saying
    // something like the state modification shouldn't happen during render
    if (this.state.redirect) {
        this.onEnd();
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={{ width: 112, height: 70 }} resizeMode='contain' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00EAD0',
  }
});
