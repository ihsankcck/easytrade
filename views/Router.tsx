import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginPage from './Login';
import RegisterPage from './Register';
import HomePage from './Home';
import ProfilePage from './Profile';
import AccountDetail from './AccountDetail';
import TransferSend from './TransferSend';
import TransferReceive from './TransferReceive';
import NewAccount from './NewAccount';
import BuyCoin from './BuyCoin';

import {useAuthContext} from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type RootStackParamList<T> = {
  Login: T;
  Home: T;
};

export type NavigationProps<T> = NativeStackScreenProps<RootStackParamList<T>>;

const HomeRouter = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={HomePage} />
    <Stack.Screen name="AccountDetail" component={AccountDetail} />
    <Stack.Screen name="TransferReceive" component={TransferReceive} />
    <Stack.Screen name="TransferSend" component={TransferSend} />
    <Stack.Screen name="NewAccount" component={NewAccount} />
    <Stack.Screen name="BuyCoin" component={BuyCoin} />
  </Stack.Navigator>
);

function Router() {
  const {isSignout} = useAuthContext();

  return (
    <NavigationContainer>
      {isSignout ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
              let iconName = 'info';

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Profile') {
                iconName = 'person-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen
            name="Home"
            options={{headerShown: false}}
            component={HomeRouter}
          />
          <Tab.Screen name="Profile" component={ProfilePage} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Router;
