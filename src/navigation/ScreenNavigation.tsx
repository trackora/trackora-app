// depandance
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/user/Login.js';
import * as Icons from '../helpers/Icons.js';
import * as Config from '../helpers/Config.js';
import { useTranslation } from 'react-i18next';
import * as navigationNames from './NavigationNames.js';

const Stack = createNativeStackNavigator();

const LandingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};
const HomeStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      {navigationNames.stackNames.map((item, index) => {
        return (
          <Stack.Screen
            key={index}
            name={item?.name}
            component={item?.component}
            initialParams={{ name: t(item?.initialParams?.name) }}
          />
        );
      })}
    </Stack.Navigator>
  );
};

const AdminHomeStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      {navigationNames.adminStackNames.map((item, index) => {
        return (
          <Stack.Screen
            key={index}
            name={item?.name}
            component={item?.component}
            initialParams={{ name: t(item?.initialParams?.name) }}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export { HomeStack, AdminHomeStack, LandingStack };
