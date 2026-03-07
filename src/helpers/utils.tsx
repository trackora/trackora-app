import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  AlertButton,
} from "react-native";
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
  check,
} from "react-native-permissions";
import { getData } from "./localStorage";
import i18next from "i18next";
import { store } from "../redux/store";
import { setLanguage } from "../redux/slices/user.slice";
import * as Config from "./Config";
import ImagePicker from "react-native-image-crop-picker";

type AlertCallback = (() => void) | undefined;

const buildButtons = (
  buttons: (AlertButton | false | undefined)[],
): AlertButton[] => buttons.filter(Boolean) as AlertButton[];

/* ===================== ALERTS ===================== */

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
  return Alert.alert(
    title,
    textMessage,
    buildButtons([
      askMeLaterText !== undefined
        ? {
            text: askMeLaterText,
            onPress: askMeLaterOnPress,
          }
        : undefined,
      cancelText !== undefined
        ? {
            text: cancelText,
            onPress: cancelOnPress,
            style: "cancel",
          }
        : undefined,
      okText !== undefined
        ? {
            text: okText,
            onPress: OkOnPress,
          }
        : undefined,
    ]),
  );
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
  return Platform.OS === "android"
    ? Alert.alert(
        tile,
        message,
        buildButtons([
          askLaterText != undefined
            ? {
                text: askLaterText,
                onPress: askLaterFunction,
              }
            : undefined,
          cancelText != undefined
            ? {
                text: cancelText,
                onPress: cancelFunction,
                style: "cancel",
              }
            : undefined,
          okayText != undefined
            ? {
                text: okayText,
                onPress: okayFunction,
              }
            : undefined,
        ]),
      )
    : Alert.alert(
        tile,
        message,
        buildButtons([
          okayText != undefined
            ? {
                text: okayText,
                onPress: okayFunction,
              }
            : undefined,
        ]),
      );
};

/* ===================== DATE HELPERS ===================== */

export const toLocaleDateString = (val?: string | number | Date) => {
  const date = val ? new Date(val) : new Date();

  return {
    customDateTime:
      date.toLocaleDateString("en-us") +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds(),
    customTime: date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    day: date.getDate(),
    day_name: ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
    month_number: date.getMonth(),
    month_name: date.toLocaleString("default", { month: "long" }),
    year: date.getFullYear(),
    toLocaleDateString: date.toLocaleDateString("en-us"),
    customValTimeString: date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    timestamp: Date.now(),
    customDate: `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`,
    customMonth: `${date.getFullYear()}-${date.getMonth() + 1}`,
    h: date.getHours(),
  };
};

export const toLocaleDateTime = (date: string | number | Date): string => {
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "UTC",
    hour12: true,
  });
};

export const customDateFormet = (val?: string | number | Date): string => {
  const date = val ? new Date(val) : new Date();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const formatToYMDHMS = (dateString?: string): string => {
  if (!dateString) return "";

  const dateObj = toLocaleDateString(dateString);

  const yyyy = dateObj.year;
  const mm = String(dateObj.month_number + 1).padStart(2, "0");
  const dd = String(dateObj.day).padStart(2, "0");
  const hh = String(dateObj.h).padStart(2, "0");
  const min = dateObj.customTime.split(":")[1].split(" ")[0];
  const ss = dateObj.customDateTime.split(":")[2].split(" ")[0];

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
};

export const fomatTrackCapturedDate = (
  val?: string | number | Date,
): string => {
  const date = val ? new Date(val) : new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours(),
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds(),
  ).padStart(2, "0")}`;
};

/* ===================== CAMERA ===================== */

export const handleCamera = async (
  type: "photo" | "video",
  openType: "openPicker" | "openCamera" = "openPicker",
  multiple = false,
): Promise<any> => {
  const pickerOptions = {
    width: 300,
    height: 400,
    includeBase64: true,
    multiple,
    includeExif: true,
    mediaType: type,
    compressImageQuality: 0.1,
  };

  const data =
    openType === "openPicker"
      ? await ImagePicker.openPicker(pickerOptions)
      : await ImagePicker.openCamera(pickerOptions);

  await ImagePicker.clean().catch(() => {});
  return data;
};

/* ===================== PERMISSIONS ===================== */

export const requestPermissionsAndroid = async (): Promise<void> => {
  if (Platform.OS !== "android") return;

  try {
    await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]);
  } catch (err) {
    console.warn(err);
  }
};

const requestBackground = async () => {
  return PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    PermissionsAndroid.PERMISSIONS.INTERNET,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ]);
};

export const requestBackgroundPermission = async () => {
  if (Platform.OS === "android") {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      if (!granted) {
        const status = await requestBackground();
        const allGranted = Object.values(status).every(
          (s) => s === PermissionsAndroid.RESULTS.GRANTED,
        );

        if (!allGranted) {
          AlertDialog(
            "Location Permission Blocked",
            "To enable location services, please enable permissions from settings.",
            "Okay",
            () => Linking.openSettings(),
          );
        }

        return status;
      }

      return granted;
    } catch {
      return false;
    }
  } else {
    try {
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    } catch {
      return false;
    }
  }
};

export const requestStoragePermission = async () => {
  try {
    return PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
  } catch {
    return false;
  }
};

/* ===================== NETWORK ===================== */

export const isReachable = async (): Promise<boolean> => {
  try {
    await Promise.race([
      fetch(Config.baseUrl),
      new Promise((_, reject) => setTimeout(reject, 5000)),
    ]);
    return true;
  } catch {
    return false;
  }
};

/* ===================== LANGUAGE ===================== */

export const setDefaultLan = async (): Promise<void> => {
  const lang = (await getData("current_language")) || "en";
  store.dispatch(setLanguage(lang));
  i18next.changeLanguage(lang);
};

/* ===================== DEBUG ===================== */

export const logCurl = (
  url: string,
  method = "POST",
  headers: Record<string, string> = {},
  body: Record<string, unknown> = {},
): string | undefined => {
  try {
    let curl = `curl -X ${method.toUpperCase()} "${url}"`;

    Object.entries(headers).forEach(([k, v]) => {
      curl += ` -H "${k}: ${v}"`;
    });

    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      curl += ` -d '${JSON.stringify(body)}'`;
    }

    console.log("💻 CURL:", curl);
    return curl;
  } catch {
    return undefined;
  }
};
