import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import React, { useRef } from 'react';
import { Header_2 } from '../../components/Header';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import BackgroundService from 'react-native-background-actions';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { Button, CustomButton } from '../../components/CustomElements';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import {
  customDateFormet,
  fomatTrackCapturedDate,
  requestBackgroundPermission,
  toLocaleDateString,
  toLocaleDateTime,
} from '../../helpers/utils';
import {
  apiPostService,
  getAppDetails,
  getProfileData,
} from '../../helpers/services';
import { SvgRefreshBtn } from '../../helpers/Svg';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/login.slice';
import { useFocusEffect } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import CustomModal from '../../components/CustomModal';
import AltertBox from '../../components/AltertBox';
import DeviceInfo from 'react-native-device-info';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import LoadingSpinner from '../../animated/LoadingSpinner';
import { usersLocation } from '../../redux/slices/user.slice';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';
import { getData } from '../../helpers/localStorage';
import AttendanceDetails from '../../components/AttendanceDetails';

const PunchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.login);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [punchAlertdata, setPunchAlertdata] = React.useState(null);
  const [mapLoading, setMapLoading] = React.useState(false);
  const [attendanceLoader, setAttendanceLoader] = React.useState(false);
  const [attendDetails, setAttendDetails] = React.useState(null);
  const mapRef = useRef(null);
  const [liveLocation, setLiveLocation] = React.useState(null);
  const [toggleMap, setToggleMap] = React.useState('standard');
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const { t } = useTranslation();

  const [openModal, setOpenModal] = React.useState(false);

  /** Background task options (used in BackgroundService) */
  const backgroundTaskOptions = {
    taskName: t(Config.alarmScreenText?.location_tracking),
    taskTitle: t(Config.alarmScreenText?.location_tracking_start),
    taskDesc: t(Config.alarmScreenText?.location_tracking_5mins),
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 300000,
    },
  };

  /* Get current user location & update Redux + Map*/
  const getCurrentLocation = event => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.INTERNET,
            {
              title: t(Config.branchesText?.location_permission),
              message: t(Config.branchesText?.permission_message),
              buttonPositive: t(Config.branchesText?.ok),
              buttonNegative: t(Config.branchesText?.cancel),
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return false;
        }
      } else {
        try {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          if (auth === 'granted') {
            return auth;
          }
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return false;
        }
      }
    };

    // Usage example
    requestLocationPermission().then(hasLocationPermission => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          async position => {
            // console.log("position----1", position);
            mapRef?.current?.animateToRegion({
              latitude: position?.coords.latitude,
              longitude: position?.coords.longitude,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
            });
            dispatch(usersLocation(position));
            setTimeout(() => {
              setLiveLocation(position?.coords);
              setMapLoading(false);
            }, 5000);
          },
          error => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        // }
      } else {
        // Location permission is denied
        // Handle accordingly
      }
    });
  };

  /*Fetch latest app details (attendance, home data, etc.)*/
  const updateAppDetailsData = async () => {
    setAttendanceLoader(true);
    let appDetailsData = await getAppDetails();
    let attendanceDetails = await apiPostService(
      Constants?.getAttendanceDetails,
      {},
    );
    let loginDetails = {
      ...userData.data,
      homeData: appDetailsData?.data,
      attendanceDetailsData: attendanceDetails?.data,
    };
    // console.log("stopBackgroundService-5444", appDetailsData);
    if (isApiSuccess(appDetailsData) && isApiSuccess(attendanceDetails)) {
      setAttendanceLoader(false);
      console.log('login details in depth', loginDetails);
      dispatch(login(loginDetails));
      setAttendDetails(attendanceDetails?.data?.data?.attendData?.attendance);
    }
  };

  /* Background Task → Track location every X interval */
  const backgroundTrackingTask = async taskDataArguments => {
    // Example of an infinite loop task

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          PermissionsAndroid.PERMISSIONS.INTERNET,
          {
            title: t(Config.branchesText?.location_permission),
            message: t(Config.branchesText?.permission_message),
            buttonPositive: t(Config.branchesText?.ok),
            buttonNegative: t(Config.branchesText?.cancel),
          },
        );
        if (
          granted === PermissionsAndroid.RESULTS.GRANTED &&
          liveLocation != null
        ) {
          const { delay } = taskDataArguments;
          await new Promise(async resolve => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
              DeviceInfo.isLocationEnabled().then(enabled => {
                // console.log("isLocationEnabled", enabled)
              });
              DeviceInfo.isAirplaneMode().then(enabled => {
                console.log('isAirplaneMode', enabled);
              });
              NetInfo.fetch().then(state => {
                // console.log("Connection type", state.type);
                if (state.isConnected === false) {
                  console.log(
                    'We are setting the token value to Punchscreen page',
                  );
                  // console.log("Is connected?", state.isConnected);
                  dispatch(login('disonnected'));
                }
              });
              Geolocation.getCurrentPosition(
                async position => {
                  // console.log("position", position)
                  let bodyData = {
                    latitude: position?.coords?.latitude,
                    longitude: position?.coords?.longitude,
                    track_type: 'Internet ON',
                    track_captured_on: fomatTrackCapturedDate(),
                    accuracy: position?.coords?.accuracy,
                    altitude: position?.coords?.altitude,
                    altitudeAccuracy: position?.coords?.altitudeAccuracy,
                    simulated: false,
                    speed: position?.coords?.speed,
                    bearing: 116.09572,
                    time: position?.timestamp,
                    remark: 'start Attandance',
                  };
                  if (bodyData) {
                    let apiData = await apiPostService(
                      Constants?.user_track_api,
                      bodyData,
                    );
                    // console.log("user_track_api", apiData)
                    if (isApiSuccess(apiData)) {
                      setAttendanceLoader(false);
                      setModalVisible(false);
                      Toast.show({
                        type: 'info',
                        text1: t(Config.punchScreenText?.attendance_marked),
                        position: 'top',
                        swipeable: true,
                      });
                      await updateAppDetailsData();
                      getCurrentLocation();
                    }
                    // console.log("apiData-trch", apiData);
                  }
                  await BackgroundService.updateNotification({
                    taskTitle: `${
                      Config.alarmScreenText?.location_tracking_start
                    } ${new Date().toLocaleTimeString('en-US')}`,
                    taskDesc: `${Config.alarmScreenText?.location_tracking} ${i} ${Config.punchScreenText?.start_every10min} `,
                  });
                },
                error => {},
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
              );
              // console.log(i)
              // await handleButtonPress(liveLocation);
              await sleep(delay);
            }
          });
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
      }
    }
  };

  /* Handle Punch In (show confirmation modal) */
  const handleStartAttendance = () => {
    setModalVisible(true);
    setPunchAlertdata({
      statusText: t(Config.punchScreenText?.punching_in_at),
      time: `${toLocaleDateString()?.customTime}`,
      confirm: () => startAttendance(),
      cancel: () => setModalVisible(false),
    });
  };

  /*  Punch In logic (API + start background tracking) */
  const startAttendance = async () => {
    setAttendanceLoader(true);
    Geolocation.getCurrentPosition(
      async position => {
        // console.log("position", position)
        let bodyData = {
          start_lat: position?.coords?.latitude,
          start_lng: position?.coords?.longitude,
        };
        if (position?.mocked === false) {
          let apiData = await apiPostService(
            Constants?.attendance_start,
            bodyData,
          );
          if (isApiSuccess(apiData)) {
            await BackgroundService.start(
              backgroundTrackingTask,
              backgroundTaskOptions,
            );
            await BackgroundService.updateNotification({
              taskDesc: t(Config.alarmScreenText?.location_tracking),
            });
            await updateAppDetailsData();
            setModalVisible(false);
          } else {
            setModalVisible(true);
            setAttendanceLoader(false);
            setPunchAlertdata({
              statusText: `${t(Config?.punchScreenText?.error)}`,
              time: `${apiData?.data.message}`,
              confirm: async () => setModalVisible(false),
              cancel: () => setModalVisible(false),
            });
          }
        } else {
          setModalVisible(true);
          setAttendanceLoader(false);
          setPunchAlertdata({
            statusText: t(Config.punchScreenText?.uninstall_mock_location_app),
            time: t(Config.punchScreenText?.mock_location_message),
            confirm: async () =>
              await Linking.sendIntent(
                'android.settings.APPLICATION_DEVELOPMENT_SETTINGS',
              ),
            cancel: () => setModalVisible(false),
          });
        }
      },
      error => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  /* * Handle Punch Out (show confirmation modal) */
  const handleStopAttendance = () => {
    if (attendDetails?.start_time && attendDetails?.stop_time) {
      setModalVisible(true);
      setPunchAlertdata({
        statusText: t(Config.punchScreenText?.are_you_already_punched_in_out),
        time: `${toLocaleDateString()?.customTime}`,
        confirm: () => setModalVisible(false),
        cancel: () => setModalVisible(false),
      });
    } else {
      // console.log("first---1")
      setModalVisible(true);
      setPunchAlertdata({
        statusText: t(Config.punchScreenText?.punch_out_at),
        time: `${toLocaleDateString()?.customTime}`,
        confirm: () => stopAttendance(),
        cancel: () => setModalVisible(false),
      });
    }
  };

  /* Punch Out logic (API + stop background tracking) */
  const stopAttendance = async () => {
    // console.log("stopBackgroundService---11");
    Geolocation.getCurrentPosition(
      async position => {
        // console.log("apiData-stop-bodyData")
        // console.log("position", position, attendDetails)
        if (liveLocation?.latitude && attendDetails?.attend_id) {
          setAttendanceLoader(true);
          let bodyData = {
            stop_lat: position?.coords?.latitude,
            stop_lng: position?.coords?.longitude,
            attend_id: attendDetails?.attend_id,
          };
          let apiData = await apiPostService(
            Constants?.attendance_stop,
            bodyData,
          );
          // console.log("apiData-stop", apiData, bodyData)
          if (isApiSuccess(apiData)) {
            Toast.show({
              type: 'info',
              text1: `${apiData?.data?.message}`,
              position: 'top',
              swipeable: true,
            });
            await updateAppDetailsData();
            setAttendanceLoader(false);
            setModalVisible(false);
          }
          await BackgroundService.stop();
        } else {
          setModalVisible(true);
          setPunchAlertdata({
            statusText: t(Config.punchScreenText?.something_wrong),
            time: t(Config.punchScreenText?.please_refresh),
            confirm: () => {
              setAttendanceLoader(false);
              setModalVisible(false);
              updateAppDetailsData();
            },
            cancel: () => {
              setModalVisible(false);
              updateAppDetailsData();
            },
          });
        }
      },
      error => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  /* Refresh map (manual reload) */
  const refreshMap = () => {
    setMapLoading(true);
    getCurrentLocation();
  };

  /*  Update FCM Token in backend */
  const checkFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('fcmToken--1', fcmToken);
      const bodyData = {
        fcm_token: fcmToken,
      };
      const apiData = await apiPostService(Constants?.update_fcm_api, bodyData);
      if (apiData?.data?.data) {
        // console.log("apiData_fcm--1", apiData?.message)
      }
    }
  };

  const profileData = async () => {
    // this api is causing 401 error
    // const apiData = await getProfileData();
    // if(isApiSuccess(apiData)){
    // let userDetails = { ...userData.data, profileData: apiData?.data?.result?.data };
    // dispatch(login(userDetails));
    // }
  };

  const renderAttendanceStatusButton = () => {
    const { start_time, stop_time, attend_id } = attendDetails || {};

    // Case 1: No attendance details yet
    if (!attendDetails) {
      return (
        <Button
          styles={styles}
          text={t(Config.punchScreenText?.wait)}
          image={Icons?.finger_print}
          onPress={() => console.log('Waiting for data...')}
        />
      );
    }

    // Case 2: Attendance exists and both start & stop times are present
    if (start_time && stop_time) {
      return (
        <Button
          styles={styles}
          text={t(Config.punchScreenText?.attendance_marked)}
          image={Icons?.finger_print}
          // onPress={attend_id ? handleStopAttendance : handleStartAttendance}
          onPress={onAddAttendanceDetails}
        />
      );
    }

    // Case 3: Attendance started but not stopped → Punch Out
    if (start_time && !stop_time) {
      return (
        <Button
          styles={styles}
          text={t(Config.punchScreenText?.punch_out_caps)}
          image={Icons?.finger_print}
          // onPress={handleStopAttendance}
          onPress={onAddAttendanceDetails}
          tintColor={Config.Colors.errorText}
        />
      );
    }

    // Case 4: Default → Allow Punch In
    return (
      <Button
        styles={styles}
        text={t(Config.punchScreenText?.punch_in_now_caps)}
        image={Icons?.finger_print}
        // onPress={handleStartAttendance}
        onPress={onAddAttendanceDetails}
        tintColor={Config.Colors.successText}
      />
    );
  };

  const onAddAttendanceDetails = () => {
    setOpenModal(true);
  };

  React.useEffect(() => {
    updateAppDetailsData();
    getCurrentLocation();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabLongPress', e => {
      // Do something
      Toast.show({
        type: 'info',
        text1: t(Config.punchScreenText?.mark_attendance),
        position: 'bottom',
        swipeable: true,
      });
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      profileData();
      checkFCMToken();
      updateAppDetailsData();
      getCurrentLocation();
    }, []),
  );

  React.useEffect(() => {
    // (async function handleCheckPressed() {
    //   if (Platform.OS === 'android') {
    //     const checkEnabled = await isLocationEnabled();
    //     console.log('checkEnabled', checkEnabled)
    //   }
    // })();
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // console.log('App has come to the foreground!');
          let checkEnabled = await isLocationEnabled();
          // console.log('checkEnabled-1', checkEnabled)
        } else if (nextAppState == 'background') {
          let checkEnabled = await isLocationEnabled();
          if (!checkEnabled) {
            // console.log('liveLocation', liveLocation);
            let bodyData = {
              latitude: liveLocation?.latitude,
              longitude: liveLocation?.longitude,
              track_type: 'Internet OFF',
              track_captured_on: fomatTrackCapturedDate(),
            };
            let apiDataLocation = await apiPostService(
              Constants?.user_track_api,
              bodyData,
            );
            // console.log("apiDataLocation-1", apiDataLocation)
          } else {
            let bodyData = {
              latitude: liveLocation?.latitude,
              longitude: liveLocation?.longitude,
              track_type: 'Internet ON',
              track_captured_on: fomatTrackCapturedDate(),
            };
            let apiDataLocation = await apiPostService(
              Constants?.user_track_api,
              bodyData,
            );
            // console.log("apiDataLocation-2", apiDataLocation)
          }
          // console.log('checkEnabled-2', checkEnabled)
        }
        appState.current = nextAppState;
        // setAppStateVisible(appState.current);
        // console.log('AppState', appState.current);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const performAction = () => {
    const { start_time, stop_time, attend_id } = attendDetails || {};
    if (start_time && stop_time && attend_id) {
      handleStopAttendance();
    } else if (start_time && stop_time && !attend_id) {
      handleStartAttendance();
    } else if (start_time && !stop_time) {
      handleStopAttendance();
    } else {
      handleStartAttendance();
    }
  };

  // Track app state changes (foreground/background)
  const appState = useRef(AppState.currentState);

  return (
    <View style={styles.container}>
      {/* <View style={{alignItems:'center'}}> */}
      <Header_2
        commonHeight={heightToDp(3)}
        // onPressRight={refreshMap}
        onPressRight={refreshMap}
        leftImage={Icons.logo}
        svg={true}
        rightImage={
          <LoadingSpinner
            commonWidth={widthToDp(15)}
            commonHeigth={widthToDp(7)}
            isLoading={mapLoading}
          />
        }
      />
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Text
          style={{
            fontSize: widthToDp(5),
            fontFamily: Config.fontFamilys.Poppins_Bold,
            alignItems: 'flex-start',
            width: widthToDp(90),
            color: Config.Colors.textColor.textColor_2,
          }}
        >
          {t(Config.punchScreenText?.mark_your_attendance)}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          borderColor: Config.Colors.borderColor,
          borderWidth: 1,
        }}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={[styles.map]}
          region={
            liveLocation
              ? {
                  ...liveLocation,
                  latitudeDelta: 0.0,
                  longitudeDelta: 0.0,
                }
              : null
          }
          mapType={toggleMap}
          loadingEnabled
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={true}
          showsCompass={true}
          pitchEnabled={true}
          scrollDuringRotateOrZoomEnabled={true}
          zoomControlEnabled={false}
          showsIndoors={true}
        >
          {liveLocation ? (
            <Marker
              coordinate={liveLocation}
              description={`${t(Config.punchScreenText?.latitude)}: ${
                liveLocation?.latitude
              }, ${t(Config.punchScreenText?.longitude)}: ${
                liveLocation.longitude
              }`}
              pinColor={'orange'}
            />
          ) : null}
        </MapView>
      </View>
      <View style={styles.punchContainer}>
        {renderAttendanceStatusButton()}
      </View>

      <AttendanceDetails
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSubmit={performAction}
      />

      {isModalVisible ? (
        <AltertBox
          isModalVisible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          confirm={() => punchAlertdata?.confirm()}
          cancel={() => punchAlertdata?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: t(punchAlertdata?.statusText),
            text2: t(punchAlertdata?.time),
          }}
          loader={attendanceLoader}
        />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:'center',
    alignItems: 'center',
    backgroundColor: Config.Colors.defaultColor,
  },
  map: {
    // flex:1,
    height: heightToDp(65),
    width: widthToDp(90),
    zIndex: 0,
    borderRadius: 100,
  },
  punchContainer: {
    width: widthToDp(50),
    position: 'absolute',
    bottom: widthToDp(1),
  },
  linearGradient: {
    width: widthToDp(50),
    backgroundColor: '#000',
    height: heightToDp(25),
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: widthToDp(4),
    fontFamily: 'Poppins',
    margin: widthToDp(1),
    color: '#ffffff',
    textAlign: 'center',
  },
  btnImage: {
    resizeMode: 'contain',
    width: widthToDp(20),
    marginBottom: 10,
  },
});
export default React.memo(PunchScreen);
