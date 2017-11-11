/**
 * Login screen for the app.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
    Alert,
    TouchableWithoutFeedback
} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class LoginScreen extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            hidePassword: true,
            userName: '',
            password: '',
            hubIp: ''
        };
    }

    onLoginPressed() {
        //        Alert.alert('User name: ' + this.state.userName + '; Password: ' + this.state.password);
        this.signin()
            .then( tokens => { return this.getCookies( tokens ) } )
            .then( tokensWithCookie => { return this.getProvisionInfo( tokensWithCookie ) } )
            .then( finalResponse => {
                console.log( 'finalResponse: ' + finalResponse );
                const { dispatch } = this.props.navigation;
                const resetAction = NavigationActions.reset( {
                    index: 0,
                    actions: [
                        NavigationActions.navigate( {
                            routeName: 'Settings',
                            params: {
                                id_token: finalResponse.id_token,
                                access_token: finalResponse.access_token,
                                accountId: finalResponse.accountId
                            }
                        } )
                    ]
                } )
                console.log( resetAction );
                dispatch( resetAction );
            } )
            .catch( resultErr => console.log( resultErr ) );
    }

    togglePassword() {
        this.setState(( previousState ) => {
            return { hidePassword: !previousState.hidePassword };
        } );
    }

    signin() {
        const email = this.state.userName;
        const password = this.state.password;

        return new Promise(( resolve, reject ) => {
            fetch( 'https://accounts.logi.com/identity/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: JSON.stringify( {
                    "channel_id": "0a024d3b-1222-4a6f-8ae2-f1c2e2266997",
                    "create": false,
                    "email": email,
                    "password": password,
                    "verify_email": false,
                    "client_id": "aa10d1b6-d851-444c-8c80-7f63522cc3sd"
                } )
            } )
                .then( response => {
                    console.log( response );
                    return response.text();
                } )
                .then( response => {
                    if ( response ) {
                        //console.log(response);
                        let jsonResponse = JSON.parse( response );
                        //console.log('identity/signin: ' + jsonResponse);
                        resolve( {
                            id_token: jsonResponse.id_token,
                            access_token: jsonResponse.access_token
                        } );
                    } else {
                        reject( response );
                    }
                } )
                .catch( err => console.log( err ) );
        } );
    }

    getCookies( tokens ) {
        //console.log(tokens);
        let accessToken = tokens.access_token;

        return new Promise(( resolve, reject ) => {
            fetch( 'https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify( {
                    "reqId": "1",
                    "id_token": tokens.id_token,
                    "access_token": accessToken
                } )
            } )
                .then( response => {
                    //console.log(response);
                    if ( response ) {
                        //console.log(response);
                        let getCookiesResp = {
                            id_token: tokens.id_token,
                            access_token: accessToken,
                            cookie: response.headers.get( 'set-cookie' )
                        };
                        //console.log('getCookiesResp: ' + JSON.stringify(getCookiesResp));
                        resolve( getCookiesResp );
                    } else {
                        reject( response );
                    }
                } )
                .catch( err => console.log( err ) );
        } );
    }

    getProvisionInfo( tokensWithCookie ) {
        //console.log('Inside getProvisionInfo tokensWithCookie: ' + tokensWithCookie);
        const hubIp = this.state.hubIp;
        return new Promise(( resolve, reject ) => {
            fetch( 'http://' + hubIp + ':8088/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://sl.dhg.myharmony.com'
                },
                body: JSON.stringify( {
                    "id": 1,
                    "cmd": "setup.account?getProvisionInfo",
                    "timeout": 90000
                } )
            } )
                .then( response => {
                    //console.log(response);
                    return response.text();
                } )
                .then( response => {
                    if ( response ) {
                        //console.log('provInfo: ' + response);
                        let provInfo = JSON.parse( response );
                        let provInfoResp = {
                            id_token: tokensWithCookie.id_token,
                            access_token: tokensWithCookie.access_token,
                            accountId: provInfo.data.accountId
                        };
                        //console.log('provInfoResp: ' + JSON.stringify(provInfoResp));
                        resolve( provInfoResp );
                    } else {
                        reject( response );
                    }
                } )
                .catch( err => console.log( err ) );
        } );
    }

    render() {
        let hidePwd = this.state.hidePassword;

        return (
            <View style={styles.container}>
                <Text style={[styles.loginText, styles.lineAbove]}>EMAIL</Text>
                <TextInput
                    style={{ color: 'white', fontWeight: 'bold' }}
                    underlineColorAndroid='#00000000'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    value={this.state.userName}
                    onChangeText={userName => this.setState( { userName } )} />
                <View style={[styles.lineAbove, { flexDirection: 'row' }]}>
                    <View style={{ flex: 6, flexDirection: 'column' }}>
                        <Text style={styles.loginText}>PASSWORD</Text>
                        <TextInput
                            secureTextEntry={hidePwd}
                            style={{ color: 'white', fontWeight: 'bold' }}
                            underlineColorAndroid='#00000000'
                            value={this.state.password}
                            onChangeText={password => this.setState( { password } )} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableWithoutFeedback onPress={this.togglePassword.bind( this )}>
                            {
                                hidePwd ? <Image source={require( '../assets/images/lip_show_password_on.png' )}
                                    style={{ width: 22, height: 11 }}
                                    resizeMode='contain' /> :
                                    <Image source={require( '../assets/images/lip_show_password_off.png' )}
                                        style={{ width: 22, height: 11 }}
                                        resizeMode='contain' />
                            }

                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.lineAbove}>
                    <Text style={styles.loginText}>Hub IP</Text>
                    <TextInput
                        style={{ color: 'white', fontWeight: 'bold' }}
                        underlineColorAndroid='#00000000'
                        keyboardType='numeric'
                        value={this.state.hubIp}
                        onChangeText={hubIp => this.setState( { hubIp } )} />
                </View>
                <View style={[styles.lineAbove, { flex: 1 }]} />
                <TouchableHighlight
                    style={{ height: 56, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                    onPress={this.onLoginPressed.bind( this )}
                    underlayColor='gray'>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>LOGIN</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    loginText: {
        color: 'white',
        fontSize: 12
    },
    lineAbove: {
        borderTopColor: 'white',
        borderTopWidth: 1
    }

} );