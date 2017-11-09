import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PanResponder,
    Animated,
    Platform
} from 'react-native';

const CIRCLE_SIZE = 80;
const MARGIN_LEFT = 10;
const MARGIN_TOP = 5;

export class DraggableDevice extends Component {
    constructor( props ) {
        super( props );
        this.circle = null;
        this.startX = ( CIRCLE_SIZE + MARGIN_LEFT ) * this.props.index + MARGIN_LEFT;
        this.startY = MARGIN_TOP;
        this.animatedValue = new Animated.ValueXY();
        
        this.animatedValue.setOffset({x: this.startX, y: this.startY});
        this.animatedValue.setValue({x: 0, y: 0});
    }

    componentWillMount() {
        this._panResponder = PanResponder.create( {
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onMoveShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderGrant: this._handlePanResponderGrant.bind( this ),
            onPanResponderMove: Animated.event([null, {dx: this.animatedValue.x, dy: this.animatedValue.y}]),
            onPanResponderRelease: this._handlePanResponderEnd.bind( this ),
            onPanResponderTerminate: this._handlePanResponderEnd.bind( this ),
        } );
    }
    
    render() {
        return (
            <Animated.View
                ref={( circle ) => {
                    this.circle = circle;
                }}
                style={[ styles.circle, {transform: [{ translateX: this.animatedValue.x }, { translateY: this.animatedValue.y }]} ]}
                {...this._panResponder.panHandlers}>
                <Text style={styles.text}>{this.props.value}</Text>
            </Animated.View>
        );
    }

    _updateNativeStyles(bgColor) {
        this.circle && this.circle.setNativeProps( {style: {backgroundColor: bgColor}} );
    }

    _handlePanResponderGrant( e, gestureState ) {
        //console.log( 'Inside _handlePanResponderGrant gestureState: ' + JSON.stringify( gestureState ));
        this._updateNativeStyles('yellow');
    }

    _handlePanResponderEnd( e, gestureState ) {
        //console.log( 'Inside _handlePanResponderEnd gestureState: ' + JSON.stringify( gestureState ) );
        this._updateNativeStyles('green');
        this.props.onDropDevice( gestureState.moveX, gestureState.moveY, this.onDroppedOutside.bind( this ) )
    }

    /**
     * This is a callback that will be invoked from Octopus screen
     */
    onDroppedOutside( touchX, touchY ) {
        Animated.spring(
            this.animatedValue, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: (Platform.OS === 'ios') ? false : true
            }
        ).start();
    }
}

var styles = StyleSheet.create( {
    text: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        color: '#000'
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute',
        backgroundColor: 'green',
        marginLeft: MARGIN_LEFT,
        marginTop: MARGIN_TOP
    },
} );