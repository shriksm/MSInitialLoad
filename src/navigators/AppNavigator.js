import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import {addNavigationHelpers} from 'react-navigation'
import SplashScreen from '../containers/SplashScreen';
import LoginScreen from '../containers/LoginScreen';
import SettingsScreen from '../containers/SettingsScreen';
import DeviceListingScreen from '../containers/DeviceListingScreen';
import OctopusScreen from '../containers/OctopusScreen';
import Playground from '../containers/Playground';
import Viewport from '../containers/Viewport';

const CardNavigator = StackNavigator(
{
    Splash: {
        screen: SplashScreen,
        //navigationOptions is set in the SplashScreen component
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            title: 'Login',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            title: 'Settings',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'blue', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    }
});

export const AppNavigator = StackNavigator({
    CardNavigator: {
        screen: CardNavigator
    },
    Devices: {
        screen: DeviceListingScreen,
        navigationOptions: {
            title: 'Devices',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    },
    Octopus: {
        screen: OctopusScreen,
        navigationOptions: {
            title: 'Octopus',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    },
    Playground: {
        screen: Playground,
        navigationOptions: {
            title: 'Playground',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    },
    Viewport: {
        screen: Viewport,
        navigationOptions: {
            title: 'Viewport',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    }
},
{
    mode: 'modal',
});

class App extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});

export const AppWithNavigationState = connect(mapStateToProps)(App);
