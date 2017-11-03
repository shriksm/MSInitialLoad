/**
 * Login screen for the app.
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions'
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

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePassword: true,
            userName: '',
            password: '',
            hubIp: ''
        };
    }

    onLoginPressed() {
        this.props.login(this.state.userName, this.state.password, this.state.hubIp);
    }

    togglePassword() {
        this.setState((previousState) => {
            return { hidePassword: !previousState.hidePassword };
        });
    }

    render() {
        let hidePwd = this.state.hidePassword;
        console.log('props: ' + JSON.stringify(this.props));

        return (
            <View style={styles.container}>
                <Text style={[styles.loginText, styles.lineAbove]}>EMAIL</Text>
                <TextInput
                    style={{ color: 'white', fontWeight: 'bold' }}
                    underlineColorAndroid='#00000000'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    value={this.state.userName}
                    onChangeText={userName => this.setState({ userName })} />
                <View style={[styles.lineAbove, { flexDirection: 'row' }]}>
                    <View style={{ flex: 6, flexDirection: 'column' }}>
                        <Text style={styles.loginText}>PASSWORD</Text>
                        <TextInput
                            secureTextEntry={hidePwd}
                            style={{ color: 'white', fontWeight: 'bold' }}
                            underlineColorAndroid='#00000000'
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableWithoutFeedback onPress={this.togglePassword.bind(this)}>
                            {
                                hidePwd ? <Image source={require('../../../assets/images/lip_show_password_on.png')}
                                    style={{ width: 22, height: 11 }}
                                    resizeMode='contain' /> :
                                    <Image source={require('../../../assets/images/lip_show_password_off.png')}
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
                        onChangeText={hubIp => this.setState({ hubIp })} />
                </View>
                <View style={[styles.lineAbove, { flex: 1 }]} />
                <TouchableHighlight
                    style={{ height: 56, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                    onPress={this.onLoginPressed.bind(this)}
                    underlayColor='gray'>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>LOGIN</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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

});

const mapStateToProps = (state) => {
  return {
    error: state.error
  }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (email, password, hubIp) => {
            dispatch(ActionCreators.login(email, password, hubIp))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);