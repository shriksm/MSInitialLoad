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
                    screen: 'Octopus',
                    name: 'OCTOPUS',
                },
                {
                    id: 2,
                    screen: 'Playground',
                    name: 'DRAG-DROP',
                },
                {
                    id: 3,
                    screen: 'Viewport',
                    name: 'VIEWPORT',
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
        if (item.screen) {
            return this.props.navigation.navigate(item.screen);
        } 
        
        return alert(item.name)
    }

    render() {
        console.log('navigation: ' + this.props.navigation);
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