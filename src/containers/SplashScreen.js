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
import { Font } from 'expo'
import * as types from '../actions/types';
import { ActionCreators } from '../actions'

class SplashScreen extends Component {
    constructor( props ) {
        super( props );
    }

    // header: null will hide the title bar from the screen
    static navigationOptions = { title: 'Splash', header: null };

    async componentDidMount() {

        await Font.loadAsync( {
            'brownprott': require( '../../assets/fonts/brownprott_regular.ttf' ),
            'SFUIText-Light': require( '../../assets/fonts/SFText-Light.otf' ),
            'SFUIText-Regular': require( '../../assets/fonts/SFText-Regular.otf' ),
            'SFUIText-Medium': require( '../../assets/fonts/SFText-Medium.otf' ),
            'SFUIText-Semibold': require( '../../assets/fonts/SFText-Semibold.otf' ),
            'SFUIText-Heavy': require( '../../assets/fonts/SFText-Heavy.otf' ),
        } );

        setTimeout(
            () => {
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
