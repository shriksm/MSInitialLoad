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

  displayImage() {
    setTimeout(
      () => {
        this.setState({ redirect: true });
      },
      2000
    );

    return <Image source={require('../assets/images/logo.png')} style={{ width: 112, height: 70 }} resizeMode='contain' />
  }

  render() {
    let redirect = this.state.redirect;
    return (
      <View style={styles.container}>
        {
          redirect ? this.onEnd() : this.displayImage()
        }
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
