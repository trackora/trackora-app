import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  Linking,
  AppState,
  Platform,
} from "react-native";
import React, { useRef } from "react";
import { Header_2 } from "../../components/Header";
import MapView, { Marker, PROVIDER_GOOGLE, MapType } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import BackgroundService from "react-native-background-actions";
import { heightToDp, widthToDp } from "../../helpers/Responsive";
import { Button } from "../../components/CustomElements";
import * as Icons from "../../helpers/Icons";
import * as Config from "../../helpers/Config";
import * as Constants from "../../helpers/Constants";
import {
  fomatTrackCapturedDate,
  toLocaleDateString,
} from "../../helpers/utils";
import { apiPostService, getAppDetails } from "../../helpers/services";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/login.slice";
import { useFocusEffect } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";
import AltertBox from "../../components/AltertBox";
import DeviceInfo from "react-native-device-info";
import NetInfo from "@react-native-community/netinfo";
import LoadingSpinner from "../../animated/LoadingSpinner";
import { usersLocation } from "../../redux/slices/user.slice";
import { isLocationEnabled } from "react-native-android-location-enabler";
import { useTranslation } from "react-i18next";
import { isApiSuccess } from "../../helpers/Validation";
import AttendanceDetails from "../../components/AttendanceDetails";

type RootState = {
  login?: any;
};

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  speed?: number | null;
  heading?: number | null;
};

type AttendanceInfo = {
  start_time?: string;
  stop_time?: string;
  attend_id?: number | string;
};

type PunchAlertData = {
  statusText: string;
  time: string;
  confirm: () => void | Promise<void>;
  cancel: () => void;
};

type PunchScreenProps = {
  navigation: {
    addListener: (event: string, cb: (e?: any) => void) => () => void;
  };
};

const ButtonAny = Button as React.ComponentType<any>;

const PunchScreen: React.FC<PunchScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.login);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [punchAlertdata, setPunchAlertdata] =
    React.useState<PunchAlertData | null>(null);
  const [mapLoading, setMapLoading] = React.useState(false);
  const [attendanceLoader, setAttendanceLoader] = React.useState(false);
  const [attendDetails, setAttendDetails] =
    React.useState<AttendanceInfo | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const [liveLocation, setLiveLocation] = React.useState<Coordinates | null>(
    null,
  );
  const [toggleMap] = React.useState<MapType>("standard");
  const sleep = (time: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, time));
  const { t } = useTranslation();
  const appState = useRef(AppState.currentState);

  const [openModal, setOpenModal] = React.useState(false);

  const backgroundTaskOptions = {
    taskName: t(Config.alarmScreenText?.location_tracking),
    taskTitle: t(Config.alarmScreenText?.location_tracking_start),
    taskDesc: t(Config.alarmScreenText?.location_tracking_5mins),
    taskIcon: {
      name: "ic_launcher",
      type: "mipmap",
    },
    color: "#ff00ff",
    linkingURI: "yourSchemeHere://chat/jane",
    parameters: {
      delay: 300000,
    },
  };

  const getCurrentLocation = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.INTERNET,
          ]);
          const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED,
          );
          return allGranted;
        } catch (error) {
          console.error("Error requesting location permission:", error);
          return false;
        }
      } else {
        try {
          const auth = await Geolocation.requestAuthorization("whenInUse");
          if (auth === "granted") {
            return auth;
          }
        } catch (error) {
          console.error("Error requesting location permission:", error);
          return false;
        }
      }
    };

    requestLocationPermission().then((hasLocationPermission) => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          async (position) => {
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
          () => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
  };

  const updateAppDetailsData = async () => {
    setAttendanceLoader(true);
    const appDetailsData = await getAppDetails();
    const attendanceDetails = await apiPostService(
      Constants?.getAttendanceDetails,
      {},
    );
    const loginDetails = {
      ...userData.data,
      homeData: appDetailsData?.data,
      attendanceDetailsData: attendanceDetails?.data,
    };

    if (isApiSuccess(appDetailsData) && isApiSuccess(attendanceDetails)) {
      setAttendanceLoader(false);
      dispatch(login(loginDetails));
      setAttendDetails(attendanceDetails?.data?.data?.attendData?.attendance);
    }
  };

  const backgroundTrackingTask = async (taskDataArguments?: {
    delay: number;
  }): Promise<void> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          PermissionsAndroid.PERMISSIONS.INTERNET,
        ]);
        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED,
        );
        if (allGranted && liveLocation != null) {
          const delay = taskDataArguments?.delay ?? 300000;
          await new Promise<void>(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
              DeviceInfo.isLocationEnabled().then(() => {});
              DeviceInfo.isAirplaneMode().then((enabled) => {
                console.log("isAirplaneMode", enabled);
              });
              NetInfo.fetch().then((state) => {
                if (state.isConnected === false) {
                  dispatch(login("disonnected"));
                }
              });
              Geolocation.getCurrentPosition(
                async (position) => {
                  const bodyData = {
                    latitude: position?.coords?.latitude,
                    longitude: position?.coords?.longitude,
                    track_type: "Internet ON",
                    track_captured_on: fomatTrackCapturedDate(new Date()),
                    accuracy: position?.coords?.accuracy,
                    altitude: position?.coords?.altitude,
                    altitudeAccuracy: position?.coords?.altitudeAccuracy,
                    simulated: false,
                    speed: position?.coords?.speed,
                    bearing: 116.09572,
                    time: position?.timestamp,
                    remark: "start Attandance",
                  };
                  const apiData = await apiPostService(
                    Constants?.user_track_api,
                    bodyData,
                  );
                  if (isApiSuccess(apiData)) {
                    setAttendanceLoader(false);
                    setModalVisible(false);
                    Toast.show({
                      type: "info",
                      text1: t(Config.punchScreenText?.attendance_marked),
                      position: "top",
                      swipeable: true,
                    });
                    await updateAppDetailsData();
                    getCurrentLocation();
                  }
                  await BackgroundService.updateNotification({
                    taskTitle: `${
                      Config.alarmScreenText?.location_tracking_start
                    } ${new Date().toLocaleTimeString("en-US")}`,
                    taskDesc: `${Config.alarmScreenText?.location_tracking} ${i} ${Config.punchScreenText?.start_every10min} `,
                  });
                },
                () => {},
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
              );
              await sleep(delay);
            }
            resolve();
          });
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }
    }
  };

  const handleStartAttendance = () => {
    setModalVisible(true);
    setPunchAlertdata({
      statusText: t(Config.punchScreenText?.punching_in_at),
      time: `${toLocaleDateString(new Date())?.customTime}`,
      confirm: () => startAttendance(),
      cancel: () => setModalVisible(false),
    });
  };

  const startAttendance = async () => {
    setAttendanceLoader(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const bodyData = {
          start_lat: position?.coords?.latitude,
          start_lng: position?.coords?.longitude,
        };
        if (position?.mocked === false) {
          const apiData = await apiPostService(
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
                "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
              ),
            cancel: () => setModalVisible(false),
          });
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleStopAttendance = () => {
    if (attendDetails?.start_time && attendDetails?.stop_time) {
      setModalVisible(true);
      setPunchAlertdata({
        statusText: t(Config.punchScreenText?.are_you_already_punched_in_out),
        time: `${toLocaleDateString(new Date())?.customTime}`,
        confirm: () => setModalVisible(false),
        cancel: () => setModalVisible(false),
      });
    } else {
      setModalVisible(true);
      setPunchAlertdata({
        statusText: t(Config.punchScreenText?.punch_out_at),
        time: `${toLocaleDateString(new Date())?.customTime}`,
        confirm: () => stopAttendance(),
        cancel: () => setModalVisible(false),
      });
    }
  };

  const stopAttendance = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        if (liveLocation?.latitude && attendDetails?.attend_id) {
          setAttendanceLoader(true);
          const bodyData = {
            stop_lat: position?.coords?.latitude,
            stop_lng: position?.coords?.longitude,
            attend_id: attendDetails?.attend_id,
          };
          const apiData = await apiPostService(
            Constants?.attendance_stop,
            bodyData,
          );
          if (isApiSuccess(apiData)) {
            Toast.show({
              type: "info",
              text1: `${apiData?.data?.message}`,
              position: "top",
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
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const refreshMap = () => {
    setMapLoading(true);
    getCurrentLocation();
  };

  const checkFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      const bodyData = { fcm_token: fcmToken };
      await apiPostService(Constants?.update_fcm_api, bodyData);
    }
  };

  const renderAttendanceStatusButton = () => {
    const { start_time, stop_time } = attendDetails || {};

    if (!attendDetails) {
      return (
        <ButtonAny
          styles={styles}
          text={t(Config.punchScreenText?.wait)}
          image={Icons?.finger_print}
          onPress={() => console.log("Waiting for data...")}
        />
      );
    }

    if (start_time && stop_time) {
      return (
        <ButtonAny
          styles={styles}
          text={t(Config.punchScreenText?.attendance_marked)}
          image={Icons?.finger_print}
          onPress={onAddAttendanceDetails}
        />
      );
    }

    if (start_time && !stop_time) {
      return (
        <ButtonAny
          styles={styles}
          text={t(Config.punchScreenText?.punch_out_caps)}
          image={Icons?.finger_print}
          onPress={onAddAttendanceDetails}
          tintColor={Config.Colors.errorText}
        />
      );
    }

    return (
      <ButtonAny
        styles={styles}
        text={t(Config.punchScreenText?.punch_in_now_caps)}
        image={Icons?.finger_print}
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
    const unsubscribe = navigation.addListener("tabLongPress", () => {
      Toast.show({
        type: "info",
        text1: t(Config.punchScreenText?.mark_attendance),
        position: "bottom",
        swipeable: true,
      });
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      checkFCMToken();
      updateAppDetailsData();
      getCurrentLocation();
    }, []),
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await isLocationEnabled();
        } else if (nextAppState === "background") {
          const checkEnabled = await isLocationEnabled();
          const bodyData = {
            latitude: liveLocation?.latitude,
            longitude: liveLocation?.longitude,
            track_type: checkEnabled ? "Internet ON" : "Internet OFF",
            track_captured_on: fomatTrackCapturedDate(new Date()),
          };
          await apiPostService(Constants?.user_track_api, bodyData);
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [liveLocation]);

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

  return (
    <View style={styles.container}>
      <Header_2
        commonHeight={heightToDp(3)}
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
            alignItems: "flex-start",
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
          overflow: "hidden",
          borderColor: Config.Colors.borderColor,
          borderWidth: 1,
        }}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={[styles.map]}
          region={
            liveLocation
              ? {
                  latitude: liveLocation.latitude,
                  longitude: liveLocation.longitude,
                  latitudeDelta: 0.0,
                  longitudeDelta: 0.0,
                }
              : undefined
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
              coordinate={{
                latitude: liveLocation.latitude,
                longitude: liveLocation.longitude,
              }}
              description={`${t(Config.punchScreenText?.latitude)}: ${
                liveLocation?.latitude
              }, ${t(Config.punchScreenText?.longitude)}: ${
                liveLocation.longitude
              }`}
              pinColor={"orange"}
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
            text1: t(punchAlertdata?.statusText ?? ""),
            text2: t(punchAlertdata?.time ?? ""),
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
    alignItems: "center",
    backgroundColor: Config.Colors.defaultColor,
  },
  map: {
    height: heightToDp(65),
    width: widthToDp(90),
    zIndex: 0,
    borderRadius: 100,
  },
  punchContainer: {
    width: widthToDp(50),
    position: "absolute",
    bottom: widthToDp(1),
  },
  linearGradient: {
    width: widthToDp(50),
    backgroundColor: "#000",
    height: heightToDp(25),
    borderRadius: widthToDp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: widthToDp(4),
    fontFamily: "Poppins",
    margin: widthToDp(1),
    color: "#ffffff",
    textAlign: "center",
  },
  btnImage: {
    resizeMode: "contain",
    width: widthToDp(20),
    marginBottom: 10,
  },
});
export default React.memo(PunchScreen);
