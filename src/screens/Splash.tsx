import React, { useEffect } from 'react';
import {
  View,
  useColorScheme,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/store';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import Welcome from './Welcome';

import { login, setFolderName } from '../redux/slices/login.slice';
import * as Config from '../helpers/Config';
import * as Constants from '../helpers/Constants';
import { getData, removeKeyData, storeData } from '../helpers/localStorage';
import { apiPostService, getAppDetails } from '../helpers/services';
import {
  AlertBox,
  fomatTrackCapturedDate,
  isReachable,
  requestPermissionsAndroid,
  toLocaleDateString,
} from '../helpers/utils';
import { createFolder } from '../utils/common';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../helpers/Validation';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userState = useAppSelector(state => state.user);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const appFolderPath = `${RNFS.ExternalStorageDirectoryPath}/android/com.trackora_app.tlp`;

  /** Ensure App folder exists */
  const ensureAppFolderExists = async () => {
    try {
      const exists = await RNFS.exists(appFolderPath);
      if (!exists)
        await createFolder(
          `${RNFS.ExternalStorageDirectoryPath}/android`,
          '/com.trackora_app.tlp',
        );
      dispatch(setFolderName(appFolderPath));
      console.log('App folder path set:', appFolderPath);
    } catch (error) {
      console.error('Folder creation error:', error);
    }
  };

  /** Load local data and login if available */
  const loadLocalUserData = async () => {
    try {
       await messaging().getToken();
      let loginDetails = await getData(Constants.store_key_login_details);
      if (loginDetails) {
        const parsed = JSON.parse(loginDetails) as Record<string, unknown>;
        const appData = await getAppDetails();
        const userData = { ...parsed, homeData: appData?.data };
        dispatch(login(userData));
      } else {
        console.log("We are setting the token value to landingpage in splash screen")
        dispatch(login('landingPage'));
      }
    } catch (error) {
      console.error('Error loading local user data:', error);
    }
  };

  /** Track user internet connectivity */
  const setupNetworkTracking = () => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      const trackData = {
        latitude: '27.8797987',
        longitude: '69.989787687',
        track_type: 'route',
        track_captured_on: fomatTrackCapturedDate()
      };

      try {
        if (!state.isConnected) {
          await storeData(Constants.user_track_key, JSON.stringify(trackData));
          Toast.show({
            type: 'info',
            text1: 'No Internet Connection',
            position: 'top',
            swipeable: true,
          });
        } else {
          const storedTrack = await getData(Constants.user_track_key);
          if (storedTrack) {
            const parsedTrack = JSON.parse(storedTrack);
            const apiResponse = await apiPostService(Constants.user_track_api, {
              latitude: '27.8797987',
              longitude: '69.989787687',
              track_type: 'route',
              track_captured_on: fomatTrackCapturedDate(),
            });
            if (isApiSuccess(apiResponse))
              await removeKeyData(Constants.user_track_key);
          }
        }
      } catch (error) {
        console.error('Network tracking error:', error);
      }
    });

    // Initial check
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Toast.show({
          type: 'info',
          text1: 'No Internet Connection',
          position: 'top',
          swipeable: true,
        });
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    ensureAppFolderExists();
    requestPermissionsAndroid();
    loadLocalUserData();
    const unsubscribeNetwork = setupNetworkTracking();

    return () => {
      unsubscribeNetwork();
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Config.Colors.statusBarColor}
      />
      <Welcome />
    </SafeAreaView>
  );
};

export default React.memo(SplashScreen);
