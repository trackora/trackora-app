<<<<<<< HEAD
// depandance
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/user/Login';
import * as Icons from '../helpers/Icons';
import * as Config from '../helpers/Config';
import { useTranslation } from 'react-i18next';
import * as navigationNames from './NavigationNames';
=======
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icons from "../helpers/Icons";
import * as Config from "../helpers/Config";
import { useTranslation } from "react-i18next";
import * as navigationNames from "./NavigationNames";
import Login from "../screens/user/Login";
>>>>>>> 985a99218f4d9e24ee8f80ea61b59b6a7010d97b

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
            initialParams={{
              name: item?.initialParams?.name
                ? t(item?.initialParams?.name)
                : "",
            }}
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
            initialParams={{
              name: item?.initialParams?.name
                ? t(item?.initialParams?.name)
                : "",
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export { HomeStack, AdminHomeStack, LandingStack };
