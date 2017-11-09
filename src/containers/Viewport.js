import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
} from 'react-native';

export default class Viewport extends Component {
    componentWillMount() {
        this._animatedValue = new Animated.ValueXY( );
    }

    componentDidMount() {
        Animated.spring( this._animatedValue, {
            toValue: {x:300, y:0},
            duration: 1500
        } ).start();
    }

    render() {
        return (
                <Animated.View
                    style={[styles.box, this._animatedValue.getLayout()]}
                />
        );
    }


}

var styles = StyleSheet.create( {
    container: {
        flex: 1
    },
    box: {
        backgroundColor: 'red',
        position: 'absolute',
        top: 100,
        left: 100,
        width: 100,
        height: 100
    }
} );