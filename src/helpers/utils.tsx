import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
} from 'react-native-permissions';
import { getData } from './localStorage';
import i18next from 'i18next';
import { store } from '../redux/store';
import { setLanguage } from '../redux/slices/user.slice';
import * as Config from './Config';
import ImagePicker from 'react-native-image-crop-picker';


export const AlertBox = (
  title,
  textMessage,
  okText,
  OkOnPress,
  cancelText,
  cancelOnPress,
  askMeLaterText,
  askMeLaterOnPress,
) => {
  return Alert.alert(title, textMessage, [
    askMeLaterText && {
      text: askMeLaterText,
      onPress: () =>
        askMeLaterOnPress
          ? askMeLaterOnPress()
          : console.log('Ask me later pressed'),
    },
    cancelText && {
      text: cancelText,
      onPress: () =>
        cancelOnPress ? cancelOnPress() : console.log('Cancel Pressed'),
      style: 'cancel',
    },
    okText && {
      text: okText,
      onPress: () => (OkOnPress ? OkOnPress() : console.log('OK Pressed')),
    },
  ]);
};

export const toLocaleDateString = val => {
  let customDateTimeString = new Date(val);
  let date = val ? new Date(val) : new Date();
  let timestamp = Date.now();
  let toLocaleDateString = date.toLocaleDateString('en-us');
  let customValTimeString = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  let day = date.getDate();
  let month_number = date.getMonth();
  let year = date.getFullYear();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let customDate = `${year}-${month_number < 10 ? 0 : ''}${month_number + 1}-${
    day < 10 ? 0 : ''
  }${day}`;
  let customMonth = `${year}-${month_number < 10 ? 0 : ''}${month_number + 1}`;
  var Days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  let day_name = Days[date.getDay()];
  let month_name = date.toLocaleString('default', { month: 'long' });
  let customDateTime =
    date.toLocaleDateString('en-us') + ' ' + h + ':' + m + ':' + s + ' ';
  let customTime = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return {
    customDateTime,
    customTime,
    day,
    day_name,
    month_number,
    month_name,
    year,
    toLocaleDateString,
    customValTimeString,
    timestamp,
    customDate,
    h,
    customMonth,
  };
};
export const toLocaleDateTime = date => {
  let dateTime = new Date(date);
  dateTime = dateTime.toLocaleString('en-GB', {
    timeZone: 'UTC',
    hour12: true,
  });
  return dateTime;
};
export const customDateFormet = val => {
  let date = val ? new Date(val) : new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let customDate = `${year}-${month}-${day}`;
  return customDate;
};
// For converting whole date to yyyy-mm-dd hh:mm:ss

export const formatToYMDHMS = dateString => {
  if (!dateString) return '';

  const dateObj = toLocaleDateString(dateString);

  const yyyy = dateObj.year;
  const mm = (dateObj.month_number + 1).toString().padStart(2, '0');
  const dd = dateObj.day.toString().padStart(2, '0');

  const hh = dateObj.h.toString().padStart(2, '0');
  const min = dateObj.customTime.split(':')[1].split(' ')[0].padStart(2, '0');
  const ss = dateObj.customDateTime
    .split(':')[2]
    .split(' ')[0]
    .padStart(2, '0');
  console.log('reached', `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`);

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export const handleCamera = async (
  type,
  openType = 'openPicker',
  multiple = false,
) => {
  const pickerOptions = {
    width: 300, // resize width
    height: 400, // resize height
    includeBase64: true,
    multiple: multiple,
    includeExif: true,
    mediaType: type,
    compressImageQuality: 0.1, // compress to 60%
  };
  let data;
  if (openType === 'openPicker') {
    try {
      data = await ImagePicker.openPicker(pickerOptions);
      await ImagePicker.clean()
        .then(() => {
          console.log('removed all tmp images from tmp directory');
        })
        .catch(e => {
          console.log(e);
        });
      console.log('data-1', data);
      return data;
    } catch (error) {
      console.log('error', error);
      if (error) {
        throw error;
      }
    }
  } else {
    try {
     data = await ImagePicker.openCamera(pickerOptions);
     // Clean temporary images
    ImagePicker.clean()
      .then(() => console.log('Removed all tmp images'))
      .catch(e => console.log('Clean error', e));

      console.log('data-2', data);
      return data;
    } catch (error) {
      console.log('error', error);
      if (error) {
        throw error;
      }
    }
  }
};
export const requestPermissionsAndroid = async () => {
  if (Platform.OS === 'android') {
    try {
      const grants = await requestMultiple([
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.FACE_ID,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.CALL_PHONE,
      ]).then(statuses => {
        return statuses;
        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        console.log('FaceID', statuses[PERMISSIONS.IOS.FACE_ID]);
      });
      // const grants = await PermissionsAndroid.requestMultiple([
      //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      //     PermissionsAndroid.PERMISSIONS.INTERNET,
      //     {
      //       title: 'Location Permission',
      //       message: 'This app requires access to your location.',
      //       buttonPositive: 'OK',
      //       buttonNegative: 'Cancel',
      //     },
      // ]);

      // console.log('write external stroage', grants);

      if (
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
      } else {
        console.log('All required permissions not granted');
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }
};

export const AlertDialog = (
  tile,
  message,
  okayText,
  okayFunction,
  cancelText,
  cancelFunction,
  askLaterText,
  askLaterFunction,
) => {
  console.log('askLaterText', cancelText, askLaterText);
  return Platform.OS === 'android'
    ? Alert.alert(tile, message, [
        askLaterText !== undefined && {
          text: askLaterText,
          onPress: () =>
            askLaterFunction
              ? askLaterFunction()
              : console.log('click on Ask me letter button'),
        },
        cancelText !== undefined && {
          text: cancelText,
          onPress: () =>
            cancelFunction
              ? cancelFunction()
              : console.log('click on cancel button'),
          style: 'cancel',
        },
        okayText !== undefined && {
          text: okayText,
          onPress: () =>
            okayFunction ? okayFunction() : console.log('click on okay button'),
        },
      ])
    : Alert.alert(tile, message, [
        okayText !== undefined && {
          text: okayText,
          onPress: () =>
            okayFunction ? okayFunction() : console.log('click on okay button'),
        },
      ]);
};

const requestBackground = async () => {
  let status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    PermissionsAndroid.PERMISSIONS.INTERNET,
    PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'Location Permission',
      message: 'This app requires access to your location.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return status;
};
export const requestBackgroundPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (error) {
      console.log('callError', error);
    }
    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        PermissionsAndroid.PERMISSIONS.INTERNET,
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      console.log('checkResult', result);
      if (result === false) {
        let status = await requestBackground();
        console.log('status', status);
        if (status === 'never_ask_again') {
          AlertDialog(
            'Location Permission Blocked',
            'To enable location services `Allow All the time`, please go to your device settings and enable location access for this app.',
            'Okay',
            () => Linking.openSettings(),
          );
        } else if (status === 'denied') {
          AlertDialog(
            'Location Permission Blocked',
            'To enable location services `Allow All the time`, please go to your device settings and enable location access for this app.',
            'Okay',
            () => Linking.openSettings(),
          );
        } else if (status === 'granted') {
          AlertDialog(
            'Location Permission Blocked',
            'To enable location services `Allow All the time`, please go to your device settings and enable location access for this app.',
            'Okay',
            () => Linking.openSettings(),
          );
        } else {
          return status;
        }
      } else if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return result;
      }
      // return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  } else {
    try {
      // const auth = await Geolocation.requestAuthorization('whenInUse');
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
          .then(result => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                console.log(
                  'This feature is not available (on this device / in this context)',
                );
                break;
              case RESULTS.DENIED:
                console.log(
                  'The permission has not been requested / is denied but requestable',
                );
                break;
              case RESULTS.LIMITED:
                console.log(
                  'The permission is limited: some actions are possible',
                );
                break;
              case RESULTS.GRANTED:
                console.log('The permission is granted');
                break;
              case RESULTS.BLOCKED:
                console.log(
                  'The permission is denied and not requestable anymore',
                );
                break;
            }
          })
          .catch(error => {
            console.log('error', error);
          });
      });
      // console.log("auth",auth)
      // if (auth === 'granted') {
      //   return auth;
      // }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }
};

export const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return granted;
    } else {
      console.log('Camera permission denied');
      return granted;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
export const isReachable = async () => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 5000, 'Request timed out');
  });
  const request = fetch(Config.baseUrl);
  try {
    const response = await Promise.race([timeout, request]);
    console.log('response', response);
    return true;
  } catch (error) {
    return 'Error';
  }
};
export const setDefaultLan = async () => {
  const getLanguage = await getData('current_language');
  if (getLanguage) {
    store?.dispatch(setLanguage(getLanguage));
    i18next.changeLanguage(getLanguage);
  } else {
    store?.dispatch(setLanguage('en'));
    i18next.changeLanguage('en');
  }
};

// Format to HH:mm:ss
export const formatTime = date => {
  let h = date.getHours().toString().padStart(2, '0');
  let m = date.getMinutes().toString().padStart(2, '0');
  let s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const fomatTrackCapturedDate = val => {
  const date = val ? new Date(val) : new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${h}:${m}:${s}`;
};

export const logCurl = (url, method = 'POST', headers = {}, body = {}) => {
  try {
    let curl = `curl -X ${method.toUpperCase()} "${url}"`;

    // Add headers
    Object.keys(headers).forEach(key => {
      curl += ` -H "${key}: ${headers[key]}"`;
    });

    // Add body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      curl += ` -d '${JSON.stringify(body)}'`;
    }

    console.log('💻 CURL Command:\n', curl);
    return curl;
  } catch (error) {
    console.log('❌ logCurl error:', error);
  }
};
