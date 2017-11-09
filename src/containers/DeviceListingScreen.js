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
    TouchableOpacity,
    ListView,
    ScrollView
} from 'react-native';

class DeviceListingScreen extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        this.props.getDevices();
    }

    renderRow(rowData) {
        <Text>{rowData.Device.Name}</Text>
    }

    render() {
        if (this.props.devices) {
            const rows = this.dataSource.cloneWithRows(this.props.devices)
            return (
                <View style={styles.container}>
                        <ListView
                            style={styles.listContainer}
                            dataSource={rows}
                            renderRow={(rowData) => {
                                return(<TouchableOpacity
                                    key={rowData.Device.Id}
                                    style={styles.container}
                                    onPress={()=>{alert(rowData.Device.Name)}}>
                                    <Text style={styles.text}>
                                        {rowData.Device.Name}
                                    </Text>
                                </TouchableOpacity>);
                            }
                            }
                        />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.container}>
                        <Text>Loading...</Text>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: Header.HEIGHT
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 18
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(DeviceListingScreen);