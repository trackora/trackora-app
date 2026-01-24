import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  CustomLinearButton,
  CustomInput,
  SelectCountryScreen,
  CustomButton,
} from '../../components/CustomElements';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import * as Config from '../../helpers/Config';
import * as Icons from '../../helpers/Icons';
import * as Constants from '../../helpers/Constants';
import { Header_1 } from '../../components/Header';
import { apiPostService } from '../../helpers/services';
import OtpConfim from '../../components/OtpConfim';
import { login, loginLoading } from '../../redux/slices/login.slice';
import * as localStorage from '../../helpers/localStorage';
import {
  requestBackgroundPermission,
  requestStoragePermission,
  toLocaleDateString,
} from '../../helpers/utils';
import { checkPhoneNumber, isApiSuccess } from '../../helpers/Validation';
import AltertBox from '../../components/AltertBox';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Redux state
  const loginState = useSelector(state => state.login);

  // UI states
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otpError, setOtpError] = useState({ status: false, message: '' });
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpValue, setOtpValue] = useState('');
  const [headerText, setHeaderText] = useState(
    t(Config.loginScreenText?.enter_phone_to_get_started),
  );
  const [showMobileError, setShowMobileError] = useState(false);

  /** Send OTP API */
  const handleSendOtp = async () => {
    await requestBackgroundPermission();
    await requestStoragePermission();

    if (!checkPhoneNumber(mobileNumber)) {
      setShowMobileError(true);
      return;
    }

    dispatch(loginLoading(true));
    const payload = { mobile_no: mobileNumber, isd_code: countryCode };
    const response = await apiPostService(Constants.login_get_otp, payload);
    console.log('response for login is', response);
    if (isApiSuccess(response)) {
      dispatch(loginLoading(false));
      setIsOtpVisible(true);
      setOtpError({ status: false, message: '' });
      setHeaderText(
        `${t(
          Config.loginScreenText?.digit_code_sent_to,
        )} \n ${countryCode} ${mobileNumber}`,
      );
    } else {
      dispatch(loginLoading(false));
      Toast.show({
        type: 'error',
        text1: 'Mobile number not registered',
        text2: 'Please sign up to continue.',
        position: 'top',
        swipeable: true,
      });
    }
  };

  /** Verify OTP API */
  const handleVerifyOtp = async () => {
    if (!otpValue) {
      setOtpError({ status: true, message: t(Config.otherText?.required) });
      return;
    }

    dispatch(loginLoading(true));
    const payload = {
      mobile_no: mobileNumber,
      otp_code: otpValue,
      isd_code: countryCode,
    };
    const response = await apiPostService(Constants.login_with_otp, payload);

    if (response?.data?.data) {
      console.log('store_key_login_details', response?.data);
      await localStorage.storeData(
        Constants?.store_key_login_details,
        JSON.stringify({ loginData: response.data }),
      );
      let loginDetails = await localStorage.getData(
        Constants.store_key_login_details,
      );
      dispatch(login({ loginData: response.data }));
      dispatch(loginLoading(false));
    } else {
      dispatch(loginLoading(false));
      setOtpError({
        status: true,
        message: t(Config.loginScreenText?.incorrect_otp),
      });
    }
  };

  /** Handle mobile and country input changes */
  const handleInputChange = async (text, type) => {
    setShowMobileError(false);
    if (type === 'mobile') setMobileNumber(text);
    if (type === 'country') setCountryCode(text);
    await requestBackgroundPermission();
  };

  /** Handle OTP input change */
  const handleOtpChange = text => setOtpValue(text);

  /** Go back to mobile number input */
  const handleEditNumber = () => {
    setIsOtpVisible(false);
    setHeaderText(t(Config.loginScreenText?.enter_phone_to_get_started));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Header_1 text={headerText} />

        {loginState.loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={55} color={Config.Colors.themeColor} />
          </View>
        )}

        {isOtpVisible ? (
          <View style={styles.otpContainer}>
            {otpError.status ? (
              <Text style={styles.errorText}>
                <Image source={Icons.close} style={styles.errorIcon} />
                {otpError.message}
              </Text>
            ) : (
              <Text style={styles.messageBox}>
                {t(Config.loginScreenText?.enter_4_digit_otp)}
              </Text>
            )}

            <OtpConfim
              onChange={handleOtpChange}
              backgroundColor={
                otpError.status ? Config.Colors.errorField : '#eee'
              }
              textColor={otpError.status ? Config.Colors.errorText : '#000'}
            />

            <View style={styles.resendRow}>
              <Text style={styles.text}>
                {t(Config.loginScreenText?.dont_get_otp)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.resendText}>
                  {t(Config.loginScreenText?.resend_otp)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <CustomButton
                commonWidth={widthToDp(35)}
                text={t(Config.loginScreenText?.back)}
                onPress={handleEditNumber}
              />
              <CustomLinearButton
                commonWidth={widthToDp(35)}
                text={
                  otpError.status
                    ? t(Config.loginScreenText?.retry)
                    : t(Config.loginScreenText?.verify)
                }
                onPress={handleVerifyOtp}
                color={Config.Colors.defaultColor}
              />
            </View>

            <TouchableOpacity onPress={handleEditNumber} style={styles.editRow}>
              <Image source={Icons.edit_picture} style={styles.editIcon} />
              <Text style={styles.resendText}>
                {t(Config.loginScreenText?.edit_number)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.mobileInputContainer}>
              <Text
                style={[
                  styles.messageBox,
                  {
                    color: showMobileError
                      ? Config.Colors.errorText
                      : Config.Colors.textColor.textColor_1,
                  },
                ]}
              >
                {t(Config.loginScreenText?.mobile_num)} *
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <SelectCountryScreen
                  defaultCode={countryCode}
                  commonWidth={widthToDp(25)}
                  commonHeight={54}
                  onChangeText={text => handleInputChange(text, 'country')}
                />
                <CustomInput
                  fontSize={18}
                  keyboardType="decimal-pad"
                  maxLength={10}
                  onChangeText={text => handleInputChange(text, 'mobile')}
                  value={mobileNumber}
                  commonHeight={54}
                  commonWidth={widthToDp(60)}
                  borderColor={
                    !showMobileError
                      ? Config.Colors.inputField_1
                      : Config.Colors.errorField
                  }
                />
              </View>

              {showMobileError && (
                <Text style={styles.errorText}>
                  {t(Config.otherText?.required)} *
                </Text>
              )}
            </View>

            <View style={styles.continueBtn}>
              <CustomLinearButton
                commonWidth={widthToDp(40)}
                text={t(Config.loginScreenText?.lets_go)}
                onPress={handleSendOtp}
                color={Config.Colors.defaultColor}
              />
            </View>
          </View>
        )}

        <View style={styles.bottomImage}>
          <Image
            source={Icons.line_2}
            style={{ width: widthToDp(55) }}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Config.Colors.defaultColor },
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
    bottom: heightToDp(20),
  },
  otpContainer: { marginTop: widthToDp(9), alignItems: 'center' },
  errorText: { fontSize: 12, color: Config.Colors.errorText },
  errorIcon: {
    width: widthToDp(2),
    height: heightToDp(2),
    tintColor: Config.Colors.errorText,
  },
  messageBox: {
    fontSize: widthToDp(4),
    fontFamily: Config.fontFamilys.Poppins_Light,
    fontWeight: Config.WEIGHTS.light,
    color: Config.Colors.black,
  },
  text: { fontFamily: Config.fontFamilys.Poppins_Light },
  resendRow: { flexDirection: 'row', gap: 4, marginTop: widthToDp(5) },
  resendText: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: Config.Colors.black,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: widthToDp(25),
  },
  editRow: { flexDirection: 'row', gap: 5, marginTop: widthToDp(5) },
  editIcon: { resizeMode: 'contain', width: 20, height: 20 },
  mobileInputContainer: {
    alignItems: 'center',
    marginTop: 30,
    width: widthToDp(84),
    alignSelf: 'center',
  },
  continueBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: widthToDp(25),
  },
  bottomImage: { bottom: 0, position: 'absolute', right: 0, zIndex: -1 },
});

export default React.memo(LoginScreen);
