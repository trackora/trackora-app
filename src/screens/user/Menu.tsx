import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import * as Svgs from '../../helpers/Svg';
import { SvgCalender } from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll } from '../../helpers/localStorage';
import RNRestart from 'react-native-restart';
import { toLocaleDateString } from '../../helpers/utils';
import { apiPostService } from '../../helpers/services';
import { login } from '../../redux/slices/login.slice';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AltertBox from '../../components/AltertBox';
import DeviceInfo from 'react-native-device-info';
import { useTranslation } from 'react-i18next';
import CustomModal from '../../components/CustomModal';
import { availableLanguages, changeLanguage } from '../../helpers/languages';
import { isApiSuccess } from '../../helpers/Validation';

const Menus = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    state => state?.user?.currentAppLanguage,
  );
  const [notificationCount, setNotificationCount] = React.useState(null);
  const [alertBoxModal, setAlertBoxModal] = React.useState(false);
  const [aalertBoxData, setAalertBoxData] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [menuData, setMenuData] = React.useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  // Descriptive name
  const askFunPress = type => {
    switch (type) {
      case 1:
        setAlertBoxModal(true);
        setAalertBoxData({
          statusText: t(Config.menuScreenText?.logout_message),
          time: ``,
          confirm: () => logOut(),
          cancel: () => setAlertBoxModal(false),
        });
        break;
      case 2:
        setAlertBoxModal(true);
        setAalertBoxData({
          statusText: t(Config.manage_attendance?.delete_account_message),
          time: ``,
          confirm: () => deleteAccount(),
          cancel: () => setAlertBoxModal(false),
        });
        break;
      default:
        break;
    }
  };
  // For setting image item name in the image Error useState
  const handleImageOnLoadError = id => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // ⬇️ Updated getMenuData with refreshing control
  const getMenuData = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    try {
      const bodyData = { lang: 'en' };
      const getData = await apiPostService(Constants.menu_api, bodyData);
      if (isApiSuccess(getData)) {
        setMenuData(getData?.data?.data);
      }
    } finally {
      if (isRefreshing) setRefreshing(false);
    }
  };

  // Logout function
  const logOut = async () => {
    let apiData = await apiPostService(Constants?.logout_api, {});
    if (isApiSuccess(apiData)) {
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

  // Delete function
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

  // For performing various action on different menu items
  const performAction = route => {
    switch (route) {
      case 'action-delete':
        askFunPress(2);
        break;
      case 'action-logout':
        askFunPress(1);
        break;
      case 'action-change-lang':
        setOpenModal(true);
        break;
      case 'action-notification':
        navigation.navigate('notification', {
          notificationCount: notificationCount,
        });
        break;
      default:
        navigation.navigate(route);
        break;
    }
  };

  // for showing menu items with sub item
  const renderMenuItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          borderBottomWidth: 1,
          borderColor: Config.Colors.borderColor,
        }}
      >
        <Text
          style={{
            padding: 12,
            color: Config.Colors.primary,
            fontFamily: Config.fontFamilys.Poppins_Bold,
            fontSize: 14,
          }}
        >
          {item.heading}
        </Text>
        {item?.items?.map(subItem => {
          return (
            <TouchableOpacity
              key={subItem?.title}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: Config.Colors.white,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              activeOpacity={0.7}
              onPress={() => {
                subItem?.route?.startsWith('/')
                  ? {}
                  : performAction(subItem?.route);
              }}
            >
              {/* Left Section */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={
                    imageErrors[subItem?.title]
                      ? Icons.profile
                      : { uri: subItem?.icon }
                  }
                  style={{ width: 30, height: 30, borderRadius: 8 }}
                  resizeMode="cover"
                  onError={() => handleImageOnLoadError(subItem?.title)} // set error only for this image
                />

                <Text
                  style={{
                    marginLeft: 12,
                    color: Config.Colors.primary,
                    fontFamily: Config.fontFamilys.Poppins_Medium,
                    fontSize: 14,
                  }}
                >
                  {t(subItem?.title)}
                </Text>
              </View>

              {/* Right Section (Chevron) */}
              <Image
                source={Icons?.ic_chevron_right}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: Config.Colors.borderColor,
                  transform: [{ rotate: '0deg' }],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Go back trigger
  const goBackScreen = () => {
    navigation.goBack();
  };

  // Change language
  const handleChangeLanguage = item => {
    setOpenModal(changeLanguage(item));
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabLongPress', e => {
      // Do something
      Toast.show({
        type: 'info',
        text1: t(Config.bottomTabsText?.menu),
        position: 'bottom',
        swipeable: true,
      });
    });

    return unsubscribe;
  }, [navigation]);

  // For getting notificaiton count
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
    React.useCallback(() => {
      getNotificationCount();
    }, []),
  );

  React.useEffect(() => {
    getMenuData();
  }, []);
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={route?.name}
        animated={true}
        onPressLeft={goBackScreen}
        rightImage={Icons.bell_icon}
        onPressRight={() => performAction('action-notification')}
        tintColorRight={Config.Colors.defaultColor}
        rightImageTopText={notificationCount}
      />
      <View style={styles.body}>
        <View style={{ ...styles?.boxContainerIner, height: heightToDp(76) }}>
          <FlatList
            data={menuData ?? []}
            renderItem={index => renderMenuItem(index)}
            keyExtractor={(item, index) => String(index)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: Config.Colors.defaultColor,
              width: widthToDp(90),
              borderRadius: 10,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getMenuData(true)} // 👈 trigger refresh
                colors={[Config.Colors.primary]} // spinner color (android)
                tintColor={Config.Colors.primary} // spinner color (iOS)
              />
            }
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
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
      </View>
      {alertBoxModal ? (
        <AltertBox
          isModalVisible={alertBoxModal}
          onRequestClose={() => setAlertBoxModal(false)}
          confirm={() => aalertBoxData?.confirm()}
          cancel={() => aalertBoxData?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: aalertBoxData?.statusText,
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
                keyExtractor={(item, index) => String(index)}
              />
            </View>
          </View>
        </CustomModal>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // width:widthToDp(90),
    // backgroundColor:'#000'
  },
  body: {
    marginTop: 10,
    width: '100%',
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: '#000',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: widthToDp(90),
    margin: 10,
    padding: 10,
  },
  boxContainer: {
    alignSelf: 'center',
    // bottom: 10
  },
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
});
export default React.memo(Menus);
