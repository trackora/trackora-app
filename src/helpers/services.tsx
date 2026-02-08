import axios, { AxiosResponse, AxiosError } from 'axios';
import * as Config from './Config';
import * as Constants from './Constants';
import { clearAll, getData } from './localStorage';
import { store } from '../redux/store';
import { login } from '../redux/slices/login.slice';

/* ===================== TYPES ===================== */

type AnyObject = Record<string, unknown>;

interface LoginStorage {
  loginData?: {
    data?: {
      session_token?: string;
    };
  };
}

/* ===================== HELPERS ===================== */

const handleUnauthorized = async (
  url?: string,
  message?: string,
): Promise<void> => {
  await clearAll();
  console.log(
    'Session Expired',
    `Server Error at ${url ?? 'unknown'}\n${message ?? ''}`,
  );
  store.dispatch(login('landingPage'));
};

/* ===================== API SERVICE ===================== */

export const apiPostService = async (
  url: string,
  postData: AnyObject = {},
): Promise<AxiosResponse | undefined> => {
  try {
    let localDataObj: LoginStorage | null = null;

    const storedData = await getData(Constants.store_key_login_details);

    if (storedData) {
      try {
        localDataObj = JSON.parse(storedData) as LoginStorage;
        console.log('Parsed localDataObj:', localDataObj);
      } catch (parseError) {
        console.log(
          'Failed to parse localDataObj:',
          (parseError as Error).message,
        );

        if (
          url !== Constants.login_get_otp &&
          url !== Constants.login_with_otp
        ) {
          console.warn('⚠️ No session token found, aborting API call:', url);
          return;
        }
      }
    } else {
      if (
        url !== Constants.login_get_otp &&
        url !== Constants.login_with_otp
      ) {
        await handleUnauthorized(url, 'No local session found');
        console.warn('⚠️ No session token found, aborting API call:', url);
        return;
      }
    }

    /* ===== Extract token ===== */

    const sessionToken =
      localDataObj?.loginData?.data?.session_token;

    if (!sessionToken) {
      if (
        url !== Constants.login_get_otp &&
        url !== Constants.login_with_otp
      ) {
        console.warn(
          'The session token is undefined when calling the API',
          url,
        );
        return;
      }
    }

    /* ===== Headers ===== */

    const headers: Record<string, string> = {
      'package-name': 'com.hrms',
      'device-id': '3f49a638-1d42-48e0-a534-e0e36f19e6f7',
      platform: 'android',
      'device-name': 'Xiaomi 2201116PI',
      'Content-Type': 'application/json',
      ...(sessionToken ? { token: sessionToken } : {}),
    };

    console.log('📤 Final Headers for API:', headers);

    const response = await axios.post(
      `${Config.baseUrl}${url}`,
      postData,
      { headers },
    );

    /* ===== Unauthorized ===== */

    if (response.status === 401 && url !== Constants.logout_api) {
      console.log('🚨 401 Unauthorized detected for:', url);
      await handleUnauthorized(url, 'Unauthorized request');
    }

    return response;
  } catch (err: unknown) {
    const error = err as AxiosError<any>;

    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message;

    console.log('❌ API Error on:', url);
    console.log('   ↳ Status:', status);
    console.log('   ↳ Message:', message);
    console.log(
      '   ↳ Error Object:',
      JSON.stringify(error.response?.data ?? error),
      postData,
    );

    if (status === 401 && url !== Constants.logout_api) {
      console.log(
        '🚨 401 Unauthorized caught in error handler for:',
        url,
      );
      await handleUnauthorized(url, message);
    }

    return;
  }
};

/* ===================== API WRAPPERS ===================== */

export const getAppDetails = async (): Promise<AxiosResponse | undefined> => {
  return apiPostService(Constants.home, {});
};

export const getProfileData = async (): Promise<AxiosResponse | undefined> => {
  return apiPostService(Constants.profile_api, { filter: {} });
};

export const testTranslate = async (): Promise<AxiosResponse | undefined> => {
  return apiPostService(Constants.profile_api, {});
};
