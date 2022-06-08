import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginPage from './Login';
import HomePage from './Home';
import ProfilePage from './Profile';
import AccountDetail from './AccountDetail';

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
  </Stack.Navigator>
);

function Router() {
  const {isSignout} = useAuthContext();

  return (
    <NavigationContainer>
      {isSignout ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
              let iconName = 'info';

              if (route.name === 'Home') {
                iconName = 'ios-information-circle';
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
