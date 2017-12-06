/**
 * Splash screen for the app.
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Image,
    Dimensions
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import * as types from '../actions/types';
import { ActionCreators } from '../actions'

class SplashScreen extends Component {
    constructor( props ) {
        super( props );
    }

    // header: null will hide the title bar from the screen
    static navigationOptions = { title: 'Splash', header: null };

    componentDidMount() {
        console.log('Inside componentDidMount');
        setTimeout(
            () => {
                console.log('Inside setTimeout');
                this.props.navigateTo( types.GO_TO_LOGIN, { from: 'SplashScreen' } );
            }, 2000 );
    }

    render() {
        console.log( 'Splashscreen props: ' + JSON.stringify( this.props ) );
        return (
            <View style={styles.container}>
                <Image source={require( '../../assets/images/logo.png' )} style={{ width: 112, height: 70 }} resizeMode='contain' />
            </View>
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00EAD0',
    }
} );

const mapStateToProps = ( state ) => {
    return {
        nav: state.nav
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators( ActionCreators, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( SplashScreen );
