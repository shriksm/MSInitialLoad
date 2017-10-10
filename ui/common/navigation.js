import { StackNavigator } from 'react-navigation';
import SplashScreen from '../SplashScreen';
import LoginScreen from '../LoginScreen';
import SettingsScreen from '../SettingsScreen';
import DeviceListingScreen from '../DeviceListingScreen';


export const BrownieAppNavigator = StackNavigator({
    Splash: { 
        screen: SplashScreen,
        //navigationOptions is set in the SplashScreen component
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            title: 'Login',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            title: 'Settings',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    },
    Devices: {
        screen: DeviceListingScreen,
        navigationOptions: {
            title: 'Devices',
            headerTintColor: 'white', //Text color
            headerStyle: {
                backgroundColor: 'black', //Title bar color
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }
    }
    
});