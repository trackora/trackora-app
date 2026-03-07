import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as StackNavigation from '../navigation/ScreenNavigation';
import { widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';
import * as Constants from '../helpers/Constants';
import { CustomButton } from '../components/CustomElements';
import { getAppDetails } from '../helpers/services';
import { getData } from '../helpers/localStorage';
import { introStatusCheck, login } from '../redux/slices/login.slice';
import { useTranslation } from 'react-i18next';
 
type RootState = {
  login?: any;
};
 
const Welcome: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loginState = useSelector((state: RootState) => state.login);
 
  /** Fetch local data and app details safely */
  const fetchLocalData = async () => {
    try {
      const storedLogin = await getData(Constants.store_key_login_details);
      const storedIntro = await getData(Constants.store_key_intro_details);
 
      if (storedLogin) {
        const parsedLogin = JSON.parse(storedLogin);
        const appDetails = await getAppDetails();
        const combinedData = { ...parsedLogin, homeData: appDetails?.data };
        dispatch(login(combinedData));
      } else {
        dispatch(login('landingPage'));
      }
 
      dispatch(introStatusCheck(!storedIntro));
    } catch (error) {
      console.error('Error fetching local data:', error);
    }
  };
 
  /** Render error or disconnected screen */
  const renderErrorScreen = (message: string) => (
    <SafeAreaView style={styles.centeredContainer}>
      <Image source={Icons.server_error} style={styles.errorImage} />
      <Text style={styles.errorText}>{message}</Text>
    </SafeAreaView>
  );
 
  /** Conditional navigation based on login state */
  if (loginState?.data === 'landingPage')
    return <StackNavigation.LandingStack />;
  if (loginState?.data?.loginData?.data?.role === Config.isUserRole)
    return <StackNavigation.HomeStack />;
  if (loginState?.data?.loginData?.data?.role === Config.isAdminRole)
    return <StackNavigation.AdminHomeStack />;
  if (loginState?.data === 'Error')
    return renderErrorScreen('Internal Server Error');
  if (loginState?.data === 'disconnected')
    return renderErrorScreen('No Network Connection');
 
  /** Default welcome screen with loading */
  return (
    <View style={styles.flexCenter}>
      <Text style={styles.welcomeText}>{t('Welcome Back')}</Text>
      <CustomButton
        onPress={fetchLocalData}
        text={t('Continue')}
        commonHeight={widthToDp(20)}
        commonWidth={widthToDp(50)}
        Icons={null}
        tintColor={Config.Colors.themeColor}
        elevation={0}
      />
      <ActivityIndicator size="large" color={Config.Colors.themeColor} />
    </View>
  );
};
 
const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImage: {
    width: widthToDp(100),
    height: widthToDp(100),
    resizeMode: 'contain',
  },
  errorText: {
    color: Config.Colors.themeColor,
    fontSize: widthToDp(5),
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
  },
  welcomeText: {
    fontSize: widthToDp(5),
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    color: Config.Colors.themeColor,
    marginBottom: widthToDp(5),
  },
});
 
export default React.memo(Welcome);