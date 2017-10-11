/**
 * Device listing screen for the app.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ListView
} from 'react-native';

export default class DeviceListingScreen extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            isLoading: true,
            jsonDevicesData: []
        }
    }

    componentDidMount() {
        this.getDevices();
    }

    getDevices() {
        let {params} = this.props.navigation.state;
        var hdrs = new Headers();
        hdrs.set('Content-Type', 'application/json');
        hdrs.set('Accept', 'application/json');
        hdrs.set('Authorization', 'Bearer ' + params.access_token);

        fetch('https://svcs.myharmony.com/UserAccountDirectorPlatform/UserAccountDirector.svc/json2/Account/' + params.accountId + '/SimpleRestGetDeviceList', {
            method: 'GET',
            credentials: 'same-origin', // Will include the cookies in the header. Reqd for iOS
            headers: hdrs
        })
            .then(response => {
                console.log('response from service end point: ' + JSON.stringify(response));
                return response.text();
            })
            .then(response => {
                if (response) {
                    //console.log(response);
                    let jsonResponse = JSON.parse(response);
                    console.log('jsonDevicesData: ' + JSON.stringify(jsonResponse.DevicesWithFeatures));
                    this.setState({ isLoading: false, jsonDevicesData: jsonResponse.DevicesWithFeatures });
                } else {
                    //Propagate some error message from here
                }
            })
            .catch(err => console.log(err));
    }


    renderRow(rowData) {
        <Text>{rowData.Device.Name}</Text>
    }

    render() {
        const rows = this.dataSource.cloneWithRows(this.state.jsonDevicesData)
        if (this.state.isLoading !== true) {
            return (
                <View style={styles.container}>
                    <View style={styles.container}>
                        <ListView
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
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18
    }

});