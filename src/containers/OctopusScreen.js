/**
 * Device listing screen for the app.
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions'
import { Header } from 'react-navigation';

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native';
import Slider from "react-native-slider";

import { DraggableDevice } from '../components/DraggableDevice'

const { height, width } = Dimensions.get('window');
let devicesContainerWidth = 0;
class OctopusScreen extends Component {
    
    constructor(props) {
        super(props);
        this.dropZoneValues = {};
        this.devicesContainerStyle = {
            style: {
                height: 100,
                flexDirection: 'row',
                marginLeft: 0,
            }  
        }
    }
    
    componentDidMount() {
        if (!this.props.devices) {
            this.props.getDevices();
        }
    }
    
    setDropZoneValues(event) {
        this.dropZoneValues = event.nativeEvent.layout;
        console.log('dropZoneValues: ' + JSON.stringify(this.dropZoneValues));
    }
    
    onDropDevice(touchX, touchY, onDroppedOutside) {
        console.log('dropzone: ' + JSON.stringify(this.dropZoneValues));
        console.log(`touchX: ${touchX}; touchY: ${touchY}`);
        if(touchX > this.dropZoneValues.x && touchX < this.dropZoneValues.x + this.dropZoneValues.width) {
            if(touchY > this.dropZoneValues.y + Header.HEIGHT && touchY < this.dropZoneValues.y + Header.HEIGHT + this.dropZoneValues.height) {
                console.log('!!!!!!!!!!Inside dropzone');
                return;
            }
        }
        
        onDroppedOutside(touchX, touchY);
    }
    
    onSliderValueChanged(val) {
        console.log('Slider val: ' + val);
        if (this.devicesContainer) {
            this.devicesContainerStyle.style.marginLeft = -val;
            console.log('this.devicesContainerStyle: ' + JSON.stringify(this.devicesContainerStyle));
            this.devicesContainer.setNativeProps(this.devicesContainerStyle);
        }
    }
    
    render() {
        //console.log('dropZoneValues: ' + this.state.dropZoneValues);
        if (this.props.devices) {
            console.log('Inside OctopusScreen.render');
            console.log('Window width: ' + width);
            const NO_OF_DEVICES = this.props.devices.length;
            const DEVICE_CIRCLE_WIDTH = 80;
            const DEVICE_CIRCLE_LEFT_MARGIN = 10;
            
            devicesContainerWidth = (DEVICE_CIRCLE_WIDTH + DEVICE_CIRCLE_LEFT_MARGIN) * NO_OF_DEVICES;
            
            let sliderWidth = 0;
            if (devicesContainerWidth > width) {
                sliderWidth = (width * width)/devicesContainerWidth
            }
            
            return (
                <View style={styles.mainContainer}>
                    <View style={{flex:6, backgroundColor:'blue'}}>
                        <View style={styles.dropZone} 
                            onLayout={this.setDropZoneValues.bind(this)}>
                            <Text style={styles.text}>Drop here</Text>
                        </View>
                    </View>
                    {
                        devicesContainerWidth > width ? 
                                <Slider
                                  style={{ width: width, height:8 }}
                                  step={1}
                                  minimumValue={0}
                                  maximumValue={devicesContainerWidth - width + 20}
                                  value={0}
                                  thumbStyle={{ width: sliderWidth, height: 8, borderRadius: 4, marginTop: 10, marginBottom: 10 }}
                                  minimumTrackTintColor='transparent'
                                  maximumTrackTintColor='transparent'
                                  thumbTintColor='#00e7ca'
                                  trackStyle={{ height: 1 }}
                                  onValueChange={this.onSliderValueChanged.bind(this)}
                                /> : null
                            
                    }
                    
                    <View
                        ref={(devicesContainer) => {this.devicesContainer = devicesContainer;}}
                        style={styles.devicesContainer}>
                        {
                            this.props.devices.map((item, index) => {
                                console.log('Inside DraggableDevice create');
                                return (
                                        <DraggableDevice key={index} index={index} onDropDevice={this.onDropDevice.bind(this)} value={item.Device.Manufacturer}/>
                                        )
                            })
                        }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.mainContainer}>
                        <Text>Loading...</Text>
                    </View>
                </View>
            );
        }
    }
}

let CIRCLE_RADIUS = 36;
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    devicesContainer: {
        height: 100,
        flexDirection: 'row'
    },
    dropZone    : {
        backgroundColor     : '#2c3e50',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS,
        alignSelf           : 'center',
        marginTop           : 100
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#000'
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
    },
    draggableContainer: {
        margin      : 5,
        backgroundColor     : 'yellow',
        height         : 100,
    },
});

const mapStateToProps = (state) => {
  return {
    error: state.error,
    devices: state.data.devices
  }
}

const mapDispatchToProps = dispatch => {
    return {
        getDevices: () => {
            dispatch(ActionCreators.getDevices())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OctopusScreen);