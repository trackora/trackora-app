import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

// Redux Store
import { store } from './redux/store';

// Navigation
import * as RootNavigation from './navigation/RootNavigation';

// Screens & Components
import Splash from './screens/Splash';
import AlertModal from './components/AltertBox';
import * as Icons from './helpers/Icons';

// Helpers
import {
  requestBackgroundPermission,
  requestStoragePermission,
  setDefaultLan,
} from './helpers/utils';

import '../i18n.config';

type AlertConfig = {
  title?: string;
  message?: string;
  confirm?: () => void;
  cancel?: () => void;
} | null;

const App = () => {
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>(null);

  // Handle device-related setup (permissions, defaults, etc.)
  const initializeAppSettings = async () => {
    if (Platform.OS === 'android') {
      // Example: Check location enabled (future use)
      // console.log("Location enabled:", await isLocationEnabled());
    }
    setDefaultLan();
    requestBackgroundPermission();
    requestStoragePermission();
    SplashScreen.hide();
  };

  // Handle push notifications (foreground, background, quit state)
  const initializePushNotifications = () => {
    messaging().getInitialNotification(); // For quit state
    messaging().onNotificationOpenedApp(() => {
      // Handle background notifications
    });

    messaging().onMessage(async remoteMessage => {
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

  // Run on first app mount
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
              confirm={alertConfig?.confirm}
              cancel={alertConfig?.cancel}
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
