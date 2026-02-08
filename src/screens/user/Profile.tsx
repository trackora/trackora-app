import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React from 'react';
import { Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { SvgCalender } from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import CustomMenu from '../../components/CustomMenu';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService, getProfileData } from '../../helpers/services';
import { login } from '../../redux/slices/login.slice';
import { toLocaleDateString } from '../../helpers/utils';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const Profile = ({ navigation }) => {
  const getTokenData = useAppSelector(state => state.login);
  const ref = React.useRef(null);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onPressTab = React.useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);

  const profileData = async () => {
    let bodyData = {
      month: `${toLocaleDateString().year}-0${
        toLocaleDateString().month_number + 1
      }`,
    };
    console.log('body data is', bodyData);
    const apiData = await getProfileData();
    let userData = await apiPostService(
      Constants?.user_salary_details,
      bodyData,
    );
    if (isApiSuccess(apiData) && isApiSuccess(userData)) {
      let userDetails = {
        ...getTokenData?.data,
        profileData: apiData?.data?.result?.data,
        userSalaryData: userData?.data?.data?.basicDetail,
      };
      dispatch(login(userDetails));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      profileData();
    }, []),
  );

  const onPressBtn = text => {
    switch (text) {
      case 'leave_attendance':
        navigation.navigate('attendanceLeaveDetails');
        break;
      case 'Make Your Poster':
        navigation.navigate('posters');
        break;
      case 'chatUs':
        navigation.navigate('chat');
        break;
      case 'documents':
        navigation.navigate('documents');
        break;
      default:
        break;
    }
  };
  const onPressProfile = () => navigation.navigate('my_profile');
  const renderOtherArray = ({ item }) => {
    return (
      // item.status ?
      <View style={{}}>
        <CustomMenu
          tintColor2={Config.Colors.themeColor}
          item={item}
          onPress={text => onPressBtn(text)}
          style={{
            ...styles,
            box: {
              width: widthToDp(42.5),
              height: widthToDp(52),
              borderRadius: 10,
            },
          }}
          disBottomImg={Icons.arrow_forward}
        />
      </View>
      // : null
    );
  };

  const renderItem = ({ item }) => {
    return item.status ? (
      <View>
        <CustomMenu
          tintColor2={Config.Colors.themeColor}
          item={item}
          onPress={text => onPressBtn(text)}
          style={{ ...styles, box: { width: widthToDp(88), borderRadius: 10 } }}
          disBottomImg={Icons.arrow_forward}
        />
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={item?.otherArray}
            extraData={item?.otherArray}
            renderItem={renderOtherArray}
            keyExtractor={(key, index) => String(index)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            style={{
              gap: 15,
            }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </View>
      </View>
    ) : null;
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabLongPress', e => {
      // Do something
      Toast.show({
        type: 'info',
        text1: t(Config.bottomTabsText?.home),
        position: 'bottom',
        swipeable: true,
      });
    });

    return unsubscribe;
  }, [navigation]);
  const ListHeaderComponent = () => {
    return (
      <View>
        <Text
          style={[
            styles.text,
            { fontSize: 14, marginTop: 10, marginBottom: 10 },
          ]}
        >
          {t(Config.profileText?.your_activity)}
        </Text>
      </View>
    );
  };
  console.log('getTokenData', (getTokenData as any)?.userSalaryData);
  const renderLayout = ({ item }) => {
    return (
      <View style={styles?.boxContainer}>
        <View style={styles?.boxContainerIner}>
          <View
            style={{
              backgroundColor: Config?.Colors?.defaultColor,
              flexDirection: 'row',
              gap: widthToDp(10),
              marginBottom: widthToDp(2),
              padding: widthToDp(4),
              borderRadius: widthToDp(2),
              width: widthToDp(88),
            }}
          >
            <View>
              <Text
                style={{
                  color: Config.Colors.textColor.textColor_2,
                  fontFamily: Config.fontFamilys.Poppins_SemiBold,
                }}
              >
                Total Hours Worked
              </Text>
              <Text
                style={{
                  color: Config.Colors.black,
                  fontFamily: Config.fontFamilys.Poppins_Light,
                }}
              >
                {getTokenData?.data?.userSalaryData?.total_hours_worked ?? 0}
              </Text>
              <Text
                style={{
                  color: Config.Colors.textColor.textColor_2,
                  fontFamily: Config.fontFamilys.Poppins_SemiBold,
                }}
              >
                Emi Cycle
              </Text>
              <Text
                style={{
                  color: Config.Colors.black,
                  fontFamily: Config.fontFamilys.Poppins_Light,
                }}
              >
                {getTokenData?.data?.userSalaryData?.emi_cycle ?? 0}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: Config.Colors.textColor.textColor_2,
                  fontFamily: Config.fontFamilys.Poppins_SemiBold,
                }}
              >
                Loan Amount
              </Text>
              <Text
                style={{
                  color: Config.Colors.black,
                  fontFamily: Config.fontFamilys.Poppins_Light,
                }}
              >
                {getTokenData?.data?.userSalaryData?.Loan_amount ?? 0}
              </Text>

              <Text
                style={{
                  color: Config.Colors.textColor.textColor_2,
                  fontFamily: Config.fontFamilys.Poppins_SemiBold,
                }}
              >
                Increment Period
              </Text>
              <Text
                style={{
                  color: Config.Colors.black,
                  fontFamily: Config.fontFamilys.Poppins_Light,
                }}
              >
                {getTokenData?.data?.userSalaryData?.increment_period ?? 0}
              </Text>
            </View>
          </View>
          <FlatList
            data={Config?.yourActivityArray}
            extraData={Config?.yourActivityArray}
            renderItem={renderItem}
            keyExtractor={(key, index) => String(index)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text>hello</Text>
    </View>
    // <View style={styles.container}>
    //   <Header_3
    //     uriImage={getTokenData?.data?.profileData?.basicData?.profile_image}
    //     image={Icons?.profile}
    //     nameText={getTokenData?.data?.profileData?.basicData?.name}
    //     onPress={() => onPressProfile()}
    //     userData={getTokenData?.data?.userSalaryData}
    //   />
    //   <View style={styles.title}>
    //     <SvgCalender />
    //     <Text
    //       style={[styles.text, { fontSize: 14, color: Config.Colors.primary }]}
    //     >
    //       {t(Config.notification_text?.today)},{' '}
    //       {toLocaleDateString().month_name.slice(0, 3)}{' '}
    //       {toLocaleDateString().day}
    //     </Text>
    //   </View>
    //   <View style={{ justifyContent: 'flex-start', marginLeft: widthToDp(5) }}>
    //     <Text
    //       style={[
    //         styles.text,
    //         { fontSize: 14, marginTop: 10, marginBottom: 10 },
    //       ]}
    //     >
    //       {t(Config.profileText?.your_activity)}
    //     </Text>
    //   </View>
    //   <FlatList data={[1]} renderItem={renderLayout} removeClippedSubviews />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: widthToDp(4),
    flexDirection: 'row',
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    color: Config.Colors.textColor.textColor_2,
  },
  boxContainer: { alignSelf: 'center', marginBottom: heightToDp(2) },
  box: { backgroundColor: '#fff', borderRadius: 10, width: widthToDp(40) },
  boxContainerIner: { width: '100%', height: '71.5%' },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(8),
    height: heightToDp(4),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2),
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: Config.Colors.black,
    opacity: 0.6,
  },
});

export default React.memo(Profile);
