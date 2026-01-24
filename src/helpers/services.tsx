import axios from 'axios';
import * as Config from './Config';
import * as Constants from './Constants';
import { clearAll, getData } from './localStorage';
import { store } from '../redux/store';
import { login } from '../redux/slices/login.slice';

const handleUnauthorized = async (url, message) => {
  await clearAll();
  console.log(`Session Expired`, `Server Error at ${url}\n${message}`);
  store.dispatch(login('landingPage'));
};

export const apiPostService = async (url, postData = {}) => {
  try {
    let localDataObj = await getData(Constants?.store_key_login_details);
    if (localDataObj) {
      try {
        localDataObj = JSON.parse(localDataObj);
        console.log('Parsed localDataObj:', localDataObj);
      } catch (parseError) {
        console.log('Failed to parse localDataObj:', parseError.message);
        if (
          url !== Constants.login_get_otp &&
          url !== Constants.login_with_otp
        ) {
          console.warn('⚠️ No session token found, aborting API call:', url);
          return;
        }
      }
    } else {
      if (url !== Constants.login_get_otp && url !== Constants.login_with_otp) {
        handleUnauthorized()
        console.warn('⚠️ No session token found, aborting API call:', url);
        return;
      }
    }

    // 2. Extract token
    const sessionToken = localDataObj?.loginData?.data?.session_token;

    if (!sessionToken) {
      if (url !== Constants.login_get_otp && url !== Constants.login_with_otp) {
        console.warn(
          'The session token is undefiend when you are calling the api',
          url,
        );
        return;
      }
    }

    // 3. Prepare headers
    const headers = {
      'package-name': 'com.hrms',
      'device-id': '3f49a638-1d42-48e0-a534-e0e36f19e6f7',
      platform: 'android',
      'device-name': 'Xiaomi 2201116PI',
      'Content-Type': 'application/json',
      ...(sessionToken && { token: sessionToken }),
    };

    console.log('📤 Final Headers for API:', headers);

    const response = await axios.post(`${Config?.baseUrl}${url}`, postData, {
      headers,
    });

    // console.log('✅ API Success:', url, 'Status:', response?.status);
    // console.log('📦 API Response Data:', response?.data);

    // 5. Handle unauthorized
    if (response?.status === 401 && url !== Constants?.logout_api) {
      console.log('🚨 401 Unauthorized detected for:', url);
      await handleUnauthorized(url, 'Unauthorized request');
    }

    return response;
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;

    console.log('❌ API Error on:', url);
    console.log('   ↳ Status:', status);
    console.log('   ↳ Message:', message);
    console.log(
      '   ↳ Error Object:',
      JSON.stringify(error?.response?.data) || JSON.stringify(error),
      postData,
    );

    // 6. Handle unauthorized in error
    if (status === 401 && url !== Constants?.logout_api) {
      console.log('🚨 401 Unauthorized caught in error handler for:', url);
      await handleUnauthorized(url, message);
    }
  }
};

export const getAppDetails = async () => {
  let apiData = await apiPostService(Constants?.home, {});
  return apiData;
};

export const getProfileData = async () => {
  let bodyData = {
    filter: {},
  };
  const apiData = await apiPostService(Constants?.profile_api, bodyData);
  return apiData;
};
export const testTranslate = async () => {
  const bodyData = {};
  const apiData = await apiPostService(Constants.profile_api, bodyData);
  return apiData;
};
