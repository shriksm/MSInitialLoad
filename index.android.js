import {
  AppRegistry
} from 'react-native';
/*
// For normal React Native uncomment this block
import React from 'react';
import {BrownieAppNavigator} from './ui/common/navigation';

AppRegistry.registerComponent('MSInitialLoad', () => BrownieAppNavigator);
*/

// For redux-thunk uncomment this block
import {App} from './src/thunk/App'

AppRegistry.registerComponent('MSInitialLoad', () => App);