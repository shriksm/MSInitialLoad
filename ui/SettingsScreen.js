/**
 * Settings screen for the app.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            names: [
                {
                    id: 0,
                    screen: 'Devices',
                    name: 'DEVICES',
                },
                {
                    id: 1,
                    name: 'ACTIVITIES',
                },
                {
                    id: 2,
                    name: 'FAVORITES',
                },
                {
                    id: 3,
                    name: 'HUB',
                },
                {
                    id: 4,
                    name: 'ACCOUNT INFO',
                }
            ]
        }
    }

    alertItemName = (item) => {
      alert(item.name)
   }

    openSettingsItem(item) {
        let {params} = this.props.navigation.state;
        if (item.screen) {
            return this.props.navigation.navigate('Devices',
                {
                    id_token: params.id_token,
                    access_token: params.access_token,
                    cookie: params.cookie,
                    accountId: params.accountId
                });
        } 
        
        return alert(item.name)
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.names.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.container}
                            onPress={() => this.openSettingsItem(item)}>

                            <Text style={styles.text}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        );
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