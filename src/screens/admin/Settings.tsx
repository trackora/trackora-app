import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { clearAll } from '../../helpers/localStorage';
import { apiPostService } from '../../helpers/services';
import { login } from '../../redux/slices/login.slice';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AltertBox from '../../components/AltertBox';
import DeviceInfo from 'react-native-device-info';
import { useTranslation } from 'react-i18next';
import { availableLanguages, changeLanguage } from '../../helpers/languages';
import CustomModal from '../../components/CustomModal';
import { isApiSuccess } from '../../helpers/Validation';

const Settings = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selectedLanguage = useAppSelector(
    state => state?.user?.currentAppLanguage,
  );
  const [notificationCount, setNotificationCount] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertdata, setAlertdata] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const keyExtractor = useCallback((item, index) => String(index), []);
  const askFunPress = type => {
    switch (type) {
      case 1:
        setModalVisible(true);
        setAlertdata({
          statusText: t(Config?.manage_attendance?.logout_message),
          time: ``,
          confirm: () => logOut(),
          cancel: () => setModalVisible(false),
        });
        break;
      case 2:
        setModalVisible(true);
        setAlertdata({
          statusText: t(Config?.manage_attendance?.delete_account_message),
          time: ``,
          confirm: () => deleteAccount(),
          cancel: () => setModalVisible(false),
        });
        break;
      default:
        break;
    }
  };
  const handleChangeLanguage = (item: { code?: string }) => {
    changeLanguage(item).then(() => setOpenModal(false));
  };
  const renderLanguage = ({ item }) => {
    return (
      <>
        <TouchableOpacity onPress={() => handleChangeLanguage(item?.code)}>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor:
                item?.code === selectedLanguage
                  ? Config.Colors.primary
                  : 'transparent',
            }}
          >
            <Text
              style={{
                color:
                  item?.code === selectedLanguage
                    ? Config.Colors.bodyBg
                    : Config.Colors.black,
              }}
            >
              {item?.title}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  const logOut = async () => {
    const bodyData = {};
    let apiData = await apiPostService(Constants?.logout_api, bodyData);
    if (isApiSuccess(apiData)) {
      console.log('apiData-out', apiData);
      await clearAll();
      dispatch(login('landingPage'));
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error occured while logging out',
        position: 'top',
        swipeable: true,
      });
    }
  };
  const deleteAccount = async () => {
    const bodyData = {};
    let apiData = apiPostService(Constants?.delete_account_api, bodyData);
    if (isApiSuccess(apiData)) {
      await clearAll();
      dispatch(login('landingPage'));
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error occured while deleting your account',
        position: 'top',
        swipeable: true,
      });
    }
  };
  const onPressBtn = text => {
    switch (text) {
      case 'myProfile':
        navigation.navigate('my_profile');
        break;
      case 'contactUs':
        navigation.navigate('contact');
        break;
      case 'aboutUs':
        navigation.navigate('about');
        break;
      case 'notes':
        navigation.navigate('notes');
        break;
      case 'enquiry':
        navigation.navigate('enquiry');
        break;
      case 'deleteAccount':
        askFunPress(2);
        break;
      case 'logout':
        askFunPress(1);
        break;
      case 'notification':
        navigation.navigate('admin_notification', {
          notificationCount: notificationCount,
        });
        break;
      case 'manageBranch':
        navigation.navigate('branchs');
        break;
      case 'manageEmp':
        navigation.navigate('employesList');
        break;
      case 'leaveReq':
        navigation.navigate('leave-request');
        break;
      case 'reports':
        navigation.navigate('reports');
        break;
      case 'biometric':
        navigation.navigate('biometric');
        break;
      case 'language':
        setOpenModal(true);
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item, index }) => {
    if (item.status) {
      return (
        <TouchableOpacity
          style={{
            padding: 20,
            borderBottomWidth: index === Config?.menuArray.length - 1 ? 0 : 1,
            borderColor: Config.Colors.bodyBg,
          }}
          onPress={text => onPressBtn(item?.title)}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}
            >
              <View>
                <Image
                  source={item?.icon}
                  style={{ width: 38, height: 38 }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text
                  style={{
                    color: Config.Colors.primary,
                    fontFamily: Config.fontFamilys.Poppins_Medium,
                  }}
                >
                  {t(item?.title)}
                </Text>
              </View>
            </View>
            <View>
              <Image
                source={Icons?.ic_chevron_right}
                style={{
                  width: 20,
                  height: 12,
                  tintColor: Config.Colors.borderColor,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  const goBackScreen = () => navigation.goBack();
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabLongPress', e => {
      // Do something
      Toast.show({
        type: 'info',
        text1: 'Menu',
        position: 'bottom',
        swipeable: true,
      });
    });
    return unsubscribe;
  }, [navigation]);

  const getNotificationCount = async () => {
    const bodyData = {
      limit: 20,
      start: 0,
      filter: {},
    };
    const apiData = await apiPostService(
      Constants?.get_unread_notification_count_api,
      bodyData,
    );
    if (isApiSuccess(apiData)) {
      setNotificationCount(apiData?.data?.result?.data);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getNotificationCount();
    }, []),
  );
  const ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          borderBlockColor: Config.Colors.black,
          borderBottomWidth: 0.5,
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={route?.params?.name}
        animated={true}
        onPressLeft={goBackScreen}
        rightImage={Icons.bell_icon}
        onPressRight={() => onPressBtn('notification')}
        tintColorRight={Config.Colors.defaultColor}
        rightImageTopText={notificationCount}
      />
      <View style={styles.body}>
        <View
          style={{
            ...styles?.boxContainerIner,
            height: heightToDp(79),
            elevation: 1,
          }}
        >
          <FlatList
            data={Config?.addminSettings}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: Config.Colors.defaultColor,
              width: widthToDp(90),
              borderRadius: 10,
            }}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text
          style={{
            color: Config.Colors.black,
            fontFamily: Config.fontFamilys.Poppins_Medium,
          }}
        >
          {t(Config.setting_text?.version)} :- {DeviceInfo.getVersion()}
        </Text>
      </View>
      {isModalVisible ? (
        <AltertBox
          isModalVisible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          confirm={() => alertdata?.confirm()}
          cancel={() => alertdata?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: t(alertdata?.statusText),
            text2: alertdata?.time,
          }}
        />
      ) : null}
      {openModal ? (
        <CustomModal
          modalVisible={openModal}
          onRequestClose={() => setOpenModal(!openModal)}
          disableOnPress={true}
          showHeader={false}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              width: widthToDp(90),
              padding: widthToDp(5),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                display: 'flex',
              }}
            >
              <Text
                style={{
                  color: Config.Colors.black,
                  fontFamily: Config.fontFamilys.Poppins_SemiBold,
                  marginBottom: 10,
                  fontSize: widthToDp(5),
                }}
              >
                {t(Config.setting_text?.choose_lang)}
              </Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Image source={Icons.close} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={availableLanguages}
                renderItem={renderLanguage}
                keyExtractor={keyExtractor}
                ItemSeparatorComponent={ItemSeparatorComponent}
              />
            </View>
          </View>
        </CustomModal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  body: { marginTop: 10, backgroundColor: Config.Colors.offWite, elevation: 0 },
  body2: {
    marginTop: 10,
    backgroundColor: Config.Colors.bodyBg,
    elevation: 2,
    flex: 1,
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: Config.Colors.black,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: widthToDp(90),
    margin: 10,
    padding: 10,
  },
  boxContainer: { alignSelf: 'center' },
  boxContainerIner: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2),
  },
  salarySettings: {
    width: widthToDp(45),
    marginTop: widthToDp(3),
    marginBottom: widthToDp(3),
    padding: widthToDp(3),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Config.Colors.themeColor,
    marginLeft: widthToDp(3),
  },
  salary: {
    width: widthToDp(45),
    marginTop: widthToDp(3),
    marginBottom: widthToDp(3),
    padding: widthToDp(3),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Config.Colors.themeColor,
    marginRight: widthToDp(3),
  },
});
export default memo(Settings);
