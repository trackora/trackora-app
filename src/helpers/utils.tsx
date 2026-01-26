import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
  check,
} from 'react-native-permissions';
import { getData } from './localStorage';
import i18next from 'i18next';
import { store } from '../redux/store';
import { setLanguage } from '../redux/slices/user.slice';
import * as Config from './Config';
import ImagePicker from 'react-native-image-crop-picker';
 
type AlertCallback = (() => void) | undefined;
 
export const AlertBox = (
  title: string,
  textMessage: string,
  okText?: string,
  OkOnPress?: AlertCallback,
  cancelText?: string,
  cancelOnPress?: AlertCallback,
  askMeLaterText?: string,
  askMeLaterOnPress?: AlertCallback,
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
 
export const toLocaleDateString = (val?: string | number | Date) => {
  const date = val ? new Date(val) : new Date();
  const timestamp = Date.now();
  const toLocaleDateString = date.toLocaleDateString('en-us');
  const customValTimeString = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
 
  const day = date.getDate();
  const month_number = date.getMonth();
  const year = date.getFullYear();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const customDate = `${year}-${month_number < 10 ? 0 : ''}${month_number + 1}-${
    day < 10 ? 0 : ''
  }${day}`;
  const customMonth = `${year}-${month_number < 10 ? 0 : ''}${
    month_number + 1
  }`;
  const Days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day_name = Days[date.getDay()];
  const month_name = date.toLocaleString('default', { month: 'long' });
  const customDateTime =
    date.toLocaleDateString('en-us') + ' ' + h + ':' + m + ':' + s + ' ';
  const customTime = date.toLocaleString('en-US', {
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
 
export const toLocaleDateTime = (date: string | number | Date) => {
  let dateTime: string | Date = new Date(date);
  dateTime = dateTime.toLocaleString('en-GB', {
    timeZone: 'UTC',
    hour12: true,
  });
  return dateTime;
};
 
export const customDateFormet = (val?: string | number | Date) => {
  const date = val ? new Date(val) : new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const customDate = `${year}-${month}-${day}`;
  return customDate;
};
 
export const formatToYMDHMS = (dateString?: string) => {
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
 
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};
 
export const handleCamera = async (
  type: 'photo' | 'video',
  openType: 'openPicker' | 'openCamera' = 'openPicker',
  multiple = false,
) => {
  const pickerOptions = {
    width: 300,
    height: 400,
    includeBase64: true,
    multiple: multiple,
    includeExif: true,
    mediaType: type,
    compressImageQuality: 0.1,
  };
  let data: any;
 
  if (openType === 'openPicker') {
    data = await ImagePicker.openPicker(pickerOptions);
  } else {
    data = await ImagePicker.openCamera(pickerOptions);
  }
  await ImagePicker.clean().catch(e => console.log('Clean error', e));
  return data;
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
      ]);
 
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
  tile: string,
  message: string,
  okayText?: string,
  okayFunction?: AlertCallback,
  cancelText?: string,
  cancelFunction?: AlertCallback,
  askLaterText?: string,
  askLaterFunction?: AlertCallback,
) => {
  return Platform.OS === 'android'
    ? Alert.alert(tile, message, [
        askLaterText !== undefined && {
          text: askLaterText,
          onPress: () =>
            askLaterFunction
              ? askLaterFunction()
              : console.log('click on Ask me later button'),
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
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    PermissionsAndroid.PERMISSIONS.INTERNET,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ]);
  return granted;
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
      );
      if (result === false) {
        const status = await requestBackground();
        const allGranted = Object.values(status).every(
          s => s === PermissionsAndroid.RESULTS.GRANTED,
        );
        if (!allGranted) {
          AlertDialog(
            'Location Permission Blocked',
            'To enable location services `Allow All the time`, please go to your device settings and enable location access for this app.',
            'Okay',
            () => Linking.openSettings(),
          );
        }
        return status;
      } else if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return result;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  } else {
    try {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(() => {
        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
          .then(result => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                console.log('This feature is not available');
                break;
              case RESULTS.DENIED:
                console.log('Permission denied but requestable');
                break;
              case RESULTS.LIMITED:
                console.log('Permission is limited');
                break;
              case RESULTS.GRANTED:
                console.log('Permission granted');
                break;
              case RESULTS.BLOCKED:
                console.log('Permission denied and not requestable');
                break;
            }
          })
          .catch(error => {
            console.log('error', error);
          });
      });
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }
};
 
export const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
 
    const allGranted = Object.values(granted).every(
      s => s === PermissionsAndroid.RESULTS.GRANTED,
    );
 
    if (allGranted) {
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
  const timeout = new Promise((_, reject) => {
    setTimeout(reject, 5000, 'Request timed out');
  });
  const request = fetch(Config.baseUrl);
  try {
    await Promise.race([timeout, request]);
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
 
export const formatTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};
 
export const fomatTrackCapturedDate = (val?: string | number | Date) => {
  const date = val ? new Date(val) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${h}:${m}:${s}`;
};
 
export const logCurl = (
  url: string,
  method = 'POST',
  headers: Record<string, string> = {},
  body: Record<string, unknown> = {},
) => {
  try {
    let curl = `curl -X ${method.toUpperCase()} "${url}"`;
 
    Object.keys(headers).forEach(key => {
      curl += ` -H "${key}: ${headers[key]}"`;
    });
 
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      curl += ` -d '${JSON.stringify(body)}'`;
    }
 
    console.log('💻 CURL Command:\n', curl);
    return curl;
  } catch (error) {
    console.log('❌ logCurl error:', error);
  }
};