import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useMemo } from 'react';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { Header_2 } from '../../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService } from '../../helpers/services';
import {
  CustomButton,
  CustomCheckBox,
  CustomDropDownComponent,
  CustomInput,
  CustomInputBox,
  CustomLinearButton,
} from '../../components/CustomElements';
import { toLocaleDateString } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { attendanceV2List, usersList } from '../../redux/slices/admin.slice';
import CustomModal from '../../components/CustomModal';
import Toast from 'react-native-toast-message';
import { SvgXml } from 'react-native-svg';
import { NotFound_result } from '../../helpers/Svg';
import AltertBox from '../../components/AltertBox';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const EmployesList = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.login);
  const adminData = useSelector(state => state.admin);
  const [empName, setEmpName] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState('');
  const [alertdata, setAlertdata] = React.useState(null);
  const [isModalVisible, setiIsModalVisible] = React.useState(false);
  const [userFormModal, setUserFormModal] = React.useState(false);
  const [userFormData, setUserFormData] = React.useState(null);
  const [statusValue, setStatusValue] = React.useState(null);
  const [statusRemark, setStatusRemark] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  // For going back to previous screen
  const goBackScreen = () => {
    navigation.goBack();
  };

  // For fetching employees list
  const getEmployeesList = async name => {
    setLoader(true);
    const bodyDataUserList = {
      limit: 1000000,
      start: 0,
      filter: {
        search: name,
      },
    };

    let tempUserListIds = [];
    let apiUserListData = await apiPostService(
      Constants?.user_list_api,
      bodyDataUserList,
    );
    if (isApiSuccess(apiUserListData) && apiUserListData?.data?.result?.data) {
      apiUserListData?.data?.result?.data.forEach(element => {
        tempUserListIds?.push({ user_id: element?.id });
      });
      apiUserListData = {
        ...apiUserListData.data.result,
        user_ids: tempUserListIds,
      };
      setLoader(false);
      dispatch(usersList(apiUserListData));
    } else {
      console.log('Not Found');
    }
  };

  // Call Employee Api when search user name
  const onChange = text => {
    setEmpName(text);
    getEmployeesList(text);
  };

  const handleUserModal = async item => {
    setUserFormModal(true);
    setStatusValue(item?.user_status);
    setUserFormData(item);
  };

  // Api in Developmemt
  const handleUpdateStatus = async () => {
    // if (statusRemark == null) {
    //   setErrorMessage(prv => ({ ...prv, statusRemark: 'Required' }));
    // } else {
    //   const bodyData = {
    //     user_id: userFormData?.id,
    //     status: statusValue,
    //     status_remark: statusRemark,
    //   };
    //   let apiData = await apiPostService(
    //     Constants?.update_user_status_api,
    //     bodyData,
    //   );
    //   if (apiData?.data?.status === 'success') {
    //     Toast.show({
    //       type: 'success',
    //       text1: `${apiData?.data?.status}`,
    //       text2: `${apiData?.data?.message} 👋`,
    //       swipeable: true,
    //     });
    //     setUserFormData(null);
    //     setStatusValue(null);
    //     setStatusRemark(null);
    //     setUserFormModal(false);
    //     getEmployeesList();
    //   }
    // }
  };
  const handleBranchDropDown = item => {
    setSelectedBranch(item);
  };

  // For showing all employee list
  const showEmployeeList = ({ item, index }) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Config.Colors.textColor.textColor_1,
          paddingBottom: 5,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: widthToDp(5),
            justifyContent: 'space-between',
          }}
          onPress={
            () => {}
            // navigation.navigate('salaryDetails', {
            //   empName: item.name,
            //   id: item?.id,
            // })
          }
        >
          <View style={{ flexDirection: 'row', gap: 15 }}>
            {item?.name ? (
              <Text
                style={{
                  ...styles.firstWord,
                  backgroundColor:
                    index % 2 == 0
                      ? Config.Colors.themeColor
                      : Config.Colors.secondary,
                }}
              >
                {item?.name?.replace(/\s/g, '').slice(0, 1).toUpperCase()}
              </Text>
            ) : null}
            <View>
              <Text
                style={{
                  color: Config.Colors.black,
                  fontSize: widthToDp(4),
                  fontFamily: Config.fontFamilys.Poppins_Medium,
                }}
              >
                {item?.name}
              </Text>
              {item?.last_used ? (
                <Text
                  style={{
                    fontSize: widthToDp(2.5),
                    fontFamily: Config.fontFamilys.Poppins_SemiBold,
                    color: Config.Colors.textColor.textColor_1,
                  }}
                >
                  Last Used : {item?.last_used}
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: widthToDp(10),
              borderWidth: 1,
              borderColor: Config.Colors.bodyBg,
              padding: 2,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
            onPress={() => handleUserModal(item)}
          >
            <Image
              source={Icons?.more_vert_icon}
              style={{ width: widthToDp(5), height: widthToDp(5) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      getEmployeesList();
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={{ zIndex: 9999, height: heightToDp(100) }}>
        <Header_2
          leftImage={Icons.arrow_back}
          commonWidth={widthToDp(12)}
          commonHeight={heightToDp(5)}
          leftText={route?.params?.name}
          animated={true}
          onPressLeft={goBackScreen}
          tintColorRight={Config.Colors.defaultColor}
        />
        <View style={styles.body}>
          <View style={styles.bodyContainer}>
            <View>
            </View>
            <View>
              <CustomInput
                commonWidth={'100%'}
                onChangeText={onChange}
                value={empName}
                placeholder={t(Config.adminHomeScreenText.search_emp)}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoComplete={'given-name'}
                leftImage={Icons.search_icon}
                backgroundColor={Config.Colors.searchBgInput}
                bgColor={Config.Colors.inputField}
                countryCodeStatus={true}
                commonHeight={widthToDp(12)}
                textAlignVertical="center"
                onSubmitEditing={text => onSubmitEditing(text)}
                borderColor={Config.Colors.searchBriderInput}
              />
            </View>
            <View style={{ height: '90%' }}>
              {adminData?.data?.usersList?.data.length ? (
                <FlatList
                  data={adminData?.data?.usersList?.data}
                  renderItem={showEmployeeList}
                  extraData={adminData?.data?.usersList?.data}
                  keyExtractor={(item, index) => String(index)}
                  // style={{ paddingBottom: widthToDp(100), flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 10,
                  }}
                />
              ) : loader ? (
                <View style={{ height: '90%', justifyContent: 'center' }}>
                  <ActivityIndicator
                    size="large"
                    color={Config.Colors.themeColor}
                  />
                </View>
              ) : (
                <View style={{ height: '90%', justifyContent: 'center' }}>
                  <SvgXml xml={NotFound_result} />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      {userFormModal ? (
        <CustomModal
          modalVisible={userFormModal}
          onRequestClose={() => setUserFormModal(!userFormModal)}
          alignItems="center"
          justifyContent="center"
          disableOnPress={false}
          showHeader={false}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                width: widthToDp(90),
                backgroundColor: '#fff',
                borderRadius: widthToDp(2),
              }}
            >
              <View style={{ width: '100%' }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    borderBottomWidth: 2,
                    borderColor: Config.Colors.borderColor,
                    padding: 10,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: widthToDp(5),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      User Information
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setUserFormModal(!userFormModal)}
                  >
                    <Image
                      source={Icons.close}
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: Config.Colors.textColor.textColor_1,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 20,
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      width: widthToDp(38),
                      backgroundColor: Config.Colors.bodyBg,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      Name
                    </Text>
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_1,
                      }}
                    >
                      {userFormData?.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: widthToDp(40),
                      backgroundColor: Config.Colors.bodyBg,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      Mobile
                    </Text>
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_1,
                      }}
                    >
                      {userFormData?.mobile_no}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: widthToDp(38),
                      backgroundColor: Config.Colors.bodyBg,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      Manager
                    </Text>
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_1,
                      }}
                    >
                      {userFormData?.reporting_manager}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: widthToDp(40),
                      backgroundColor: Config.Colors.bodyBg,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      Role
                    </Text>
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_1,
                      }}
                    >
                      {userFormData?.role}
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      Status
                    </Text>
                    <CustomDropDownComponent
                      commonWidth={widthToDp(82)}
                      commonHeight={widthToDp(15)}
                      borderColor={Config.Colors.borderColor}
                      data={adminData?.data?.userStatusListData}
                      // placeholder={statusValue}
                      onChangeDropDown={item => setStatusValue(item)}
                      backgroundColor={Config.Colors.defaultColor}
                      initialValue={statusValue}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      bottom: heightToDp(2.5),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        color: Config.Colors.textColor.textColor_2,
                      }}
                    >
                      Remark *
                    </Text>
                    <CustomInputBox
                      commonWidth={widthToDp(82)}
                      commonHeight={widthToDp(20)}
                      keyboardType={'default'}
                      autoComplete={'cc-csc'}
                      // errorMessage={errorMessage?.description ? errorMessage?.description : ''}
                      borderColor={
                        errorMessage?.statusRemark
                          ? Config.Colors.errorFieldBorder
                          : Config.Colors.grey
                      }
                      numberOfLines={5}
                      onChangeText={text => {
                        setStatusRemark(text);
                        setErrorMessage(null);
                      }}
                      inputValue={statusRemark}
                      commmonBorderRadius={3}
                      commonBackgroundColor={Config.Colors.defaultColor}
                    />
                  </View>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CustomLinearButton
                      commonWidth={widthToDp(80)}
                      text={'APPLY'}
                      onPress={() => handleUpdateStatus()}
                      color={Config.Colors.defaultColor}
                      borderRadius={10}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </CustomModal>
      ) : null}
      {isModalVisible ? (
        <AltertBox
          isModalVisible={isModalVisible}
          onRequestClose={() => setiIsModalVisible(false)}
          confirm={() => alertdata?.confirm()}
          cancel={() => alertdata?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: alertdata?.statusText,
            text2: alertdata?.time,
          }}
        />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    width: widthToDp(90),
    // justifyContent: 'space-between',
    // alignContent: 'center',
  },
  attContainer: {
    width: widthToDp(90),
    minHeight: widthToDp(15),
    backgroundColor: Config.Colors.themeColor,
    borderRadius: 10,
    // justifyContent: 'space-between',
    // alignContent: 'center',
    // borderWidth: .1,
    padding: 20,
  },
  body: {
    width: widthToDp(100),
    alignItems: 'center',
    justifyContent: 'center',
    height: '94%',
  },
  boxContant: {
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    gap: widthToDp(5),
    // minHeight: heightToDp(10),
    paddingLeft: widthToDp(6),
    paddingRight: widthToDp(10),
    paddingTop: widthToDp(3.5),
    paddingBottom: widthToDp(3.5),
    alignItems: 'center',
  },
  text1: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    fontSize: widthToDp(3),
    color: Config.Colors.black,
  },
  text2: {
    fontFamily: Config.fontFamilys.Poppins_Light,
    fontSize: widthToDp(2.5),
    color: Config.Colors.black,
  },
  firstWord: {
    color: Config.Colors.bodyBg,
    width: 40,
    height: 40,
    marginLeft: widthToDp(2),
    textAlign: 'center',
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: widthToDp(6),
    paddingTop: widthToDp(1),
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
  },
});
export default React.memo(EmployesList);
