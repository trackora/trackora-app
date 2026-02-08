// @ts-nocheck

import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";

import { store } from "./redux/store";
import * as RootNavigation from "./navigation/RootNavigation";

import Splash from "./screens/Splash";
import AlertModal from "./components/AltertBox";
import * as Icons from "./helpers/Icons";

import {
  requestBackgroundPermission,
  requestStoragePermission,
  setDefaultLan,
} from "./helpers/utils";

import "../i18n.config";

type AlertConfig = {
  title?: string;
  message?: string;
  confirm?: () => void;
  cancel?: () => void;
} | null;

const App: React.FC = () => {
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>(null);

  const initializeAppSettings = async (): Promise<void> => {
    if (Platform.OS === "android") {
      // placeholder for platform-specific setup
    }
    setDefaultLan();
    requestBackgroundPermission();
    requestStoragePermission();
    SplashScreen.hide();
  };

  const initializePushNotifications = (): void => {
    messaging().getInitialNotification();
    messaging().onNotificationOpenedApp(() => {});

    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage?.notification?.body) {
        setAlertVisible(true);
        setAlertConfig({
          title: remoteMessage?.notification?.title,
          message: remoteMessage?.notification?.body,
          confirm: () => setAlertVisible(false),
          cancel: () => setAlertVisible(false),
        });
      }
    });
  };

  useEffect(() => {
    initializeAppSettings();
    initializePushNotifications();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer ref={RootNavigation.navigationRef}>
        <Splash />
        <Toast topOffset={30} />

        {isAlertVisible && (
          <View>
            <AlertModal
              isModalVisible={isAlertVisible}
              onRequestClose={() => setAlertVisible(false)}
              confirm={alertConfig?.confirm ?? (() => setAlertVisible(false))}
              cancel={alertConfig?.cancel ?? (() => setAlertVisible(false))}
              imageIcon={Icons?.check_icon}
              textMessage={{
                text1: alertConfig?.title,
                text2: alertConfig?.message,
              }}
            />
          </View>
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;
