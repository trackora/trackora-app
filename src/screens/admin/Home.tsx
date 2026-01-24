import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
  DeviceEventEmitter,
} from 'react-native';
import React, { useMemo, useRef } from 'react';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { Header_2 } from '../../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService } from '../../helpers/services';
import {
  CustomButton,
  CustomDropDownComponent,
  CustomInput,
  CustomInputBox,
  CustomLinearButton,
} from '../../components/CustomElements';
import { toLocaleDateString } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  appHomeData,
  attendanceV2List,
  branchesData,
  userStatusListData,
  usersList,
  usersRole,
} from '../../redux/slices/admin.slice';
import CustomModal from '../../components/CustomModal';
import CustomCheckBox from '../../components/CustomCheckBox';
import Toast from 'react-native-toast-message';
import { SvgXml } from 'react-native-svg';
import { NotFound_result } from '../../helpers/Svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import AltertBox from '../../components/AltertBox';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import DeviceInfo from 'react-native-device-info';
import CustomMenu from '../../components/CustomMenu';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const Home = ({ navigation, route, onPress }) => {
  const [scrollY] = React.useState(new Animated.Value(0));
  const HEADER_MAX_HEIGHT = heightToDp(57); // Adjust this according to your header height
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Interpolate scrollY for header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, 0],
    extrapolate: 'clamp',
  });
  const userData = useSelector(state => state.login);
  const adminData = useSelector(state => state.admin);
  const adminHomeData = useSelector(
    state => state?.admin?.data?.appHomeData?.result,
  );
  console.log('adminHomeData', adminHomeData);
  const [notificationCount, setNotificationCount] = React.useState(null);
  const [isDateTimePickerModal, setIsDateTimePickerModal] =
    React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState('');
  const [barnchData, setBarnchData] = React.useState([]);
  const [empName, setEmpName] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const searchRef = useRef(null);
  const [bannerLoader, setBannerLoader] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [addEmpModal, setAddEmpModal] = React.useState(false);
  const [pullRefresh, setPullRefresh] = React.useState(false);
  const [workingTimeType, setWorkingTimeType] = React.useState('');
  const [alertdata, setAlertdata] = React.useState(null);
  const [isAlertModal, setIsAlertModal] = React.useState(false);
  const [usercategoryList, setUsercategoryList] = React.useState(null);
  const { t } = useTranslation();
  const [dateTimePickerType, setDateTimePickerType] = React.useState({
    display: 'clock',
    mode: 'time',
  });
  const initialEmpFromValue = {
    role: '',
    name: '',
    designation: '',
    mobile_no: '',
    emp_code: '',
    branch: '',
    monday_working: false,
    tuesday_working: false,
    wednesday_working: false,
    thursday_working: false,
    friday_working: false,
    saturday_working: false,
    sunday_working: false,
    working_time_from: '',
    working_time_to: '',
    salary_payment_type: '',
    salary_amount: '',
    attendance_within: '',
    employee_category: '',
    date_of_joining: '',
    user_status: '',
    salary_wages: '',
    hourly_wages: '',
    working_hours: '',
    hours_worked: '',
    excess: '',
    less: '',
    actual_salary: '',
    to_be_paid_salary: '',
    diff_salary_amt: '',
    increment_period: '',
    loan_amount: '',
    unsecure_loan: '',
    secure_loan: '',
    emi_cycle: '',
    bonus_yearly: '',
    employee_detail: '',
  };
  const [empformInputs, setEmpformInputs] = React.useState(initialEmpFromValue);

  // const handleEmpChange = React.useCallback((name, text) => {
  //   setEmpformInputs((prv) => ({ ...prv, [name]: text }))
  //   setErrorMessage(null)
  //   if (field === 'role') {
  //     // Assuming role value is linked to designation
  //     setEmpformInputs((prev) => ({
  //       ...prev,
  //       designation: value === 22 ? 'salary user' : value === 23 ? 'attendance within' : ''
  //     }))
  //   }
  //   console.log("empformInputs===>", empformInputs?.employee_category)
  // }, [])
  const handleEmpChange = React.useCallback((name, text) => {
    setEmpformInputs(prv => {
      const updatedInputs = { ...prv, [name]: text };

      if (name === 'role') {
        updatedInputs.designation =
          text === 22 ? 'salary user' : text === 23 ? 'attendance within' : '';
      }

      return updatedInputs;
    });

    setErrorMessage(null);
    console.log('empformInputs===>', empformInputs);
  }, []);

  async function handleDateChange(event, selectedDate, name) {
    const currentDate = selectedDate;
    setIsDateTimePickerModal(false);
    setSelectedDate(currentDate);
    if (name === 'date_of_joining') {
      setEmpformInputs(prv => ({
        ...prv,
        [name]: toLocaleDateString(currentDate).customDate,
      }));
    } else {
      setEmpformInputs(prv => ({
        ...prv,
        [name]: toLocaleDateString(currentDate).customTime,
      }));
    }
  }
  const handleOptionPress = (name, value, index) => {
    // console.log(name, value,)
  };
  const [broadCastInput, setBroadCastInput] = React.useState({
    title: '',
    remark: '',
  });
  // const [title, setTitle] = React.useState('');

  const [broadcastModal, setBroadcastModal] = React.useState(false);
  const dispatch = useDispatch();
  async function getBranchData() {
    const bodyData = {
      limit: 500,
      start: 0,
      filter: {},
    };

    let tempData = [];
    let tempRoleData = [];
    let apiData = await apiPostService(Constants?.branch_list_api, bodyData);
    let apiRoleData = await apiPostService(Constants?.role_list_api, bodyData);
    let apiCategoryData = await apiPostService(
      Constants?.category_list_api,
      bodyData,
    );
    let tempCatData = [];
    if (apiCategoryData?.data?.result) {
      apiCategoryData?.data?.result.data.forEach(item => {
        tempCatData.push({ label: item.name, value: item.name, id: item.id });
      });
      setUsercategoryList(tempCatData);
      console.log('apiCategoryData===>', apiCategoryData?.data);
      console.log('setUsercategoryList====>', usercategoryList);
    }
    if (apiData?.data?.result?.data) {
      apiData?.data?.result?.data.forEach(element => {
        tempData.push({
          label: element?.branch_name,
          value: element?.branch_name,
          id: element?.id,
        });
      });
      apiData = {
        branches: apiData?.data?.result?.data,
        dropDownData: tempData,
      };
      dispatch(branchesData(apiData));
      setBarnchData(tempData);
    }
    if (apiRoleData?.data?.result?.data) {
      apiRoleData?.data?.result?.data.forEach(element => {
        tempRoleData.push({
          label: element?.name,
          value: element?.id,
          id: element?.id,
        });
      });
      apiRoleData = {
        userRole: apiRoleData?.data?.result?.data,
        dropDownData: tempRoleData,
      };
      dispatch(usersRole(apiRoleData));
      setBarnchData(tempRoleData);
    }
  }
  console.log('adminData', adminData);
  async function onPressBtn(text) {
    switch (text) {
      case 'notification':
        navigation.navigate('admin_notification', {
          notificationCount: notificationCount,
        });
        break;
      case 'manage_attendance':
        navigation.navigate('manage_attendance');
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

      default:
        break;
    }
  }
  async function getUnreadNotificationCount() {
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
  }
  async function getAttendanceList() {
    // 2024-03-02
    // `${toLocaleDateString().year}-0${toLocaleDateString().month_number + 1}`
    let tempData = [];
    const bodyData = {
      attend_date: `${toLocaleDateString().customDate}`,
      attend_month: '',
    };
    let apiData = await apiPostService(
      Constants?.attendance_v2_list_api,
      bodyData,
    );
    if (apiData?.data?.result) {
      Object.keys(apiData?.data?.result.detail).map(key => {
        if (key == 'Present') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#f5faf6',
            borderColor: '#05f545',
          });
        } else if (key == 'Absent') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#f9f5f4',
            borderColor: '#da2f35',
          });
        } else if (key == 'Half day') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#faf8f1',
            borderColor: '#f0d37d',
          });
        } else if (key == 'Paid Leave') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#faf5fa',
            borderColor: '#d279d2',
          });
        }
      });
      apiData = {
        ...apiData.data.result,
        detail: tempData,
      };
      dispatch(attendanceV2List(apiData));
    } else {
      console.log('Not Found');
    }
  }
  async function getUsersList(name) {
    // `${toLocaleDateString().year}-0${toLocaleDateString().month_number + 1}`
    setLoader(true);
    // setPullRefresh(true)
    let appInfobodyData = {
      type: 'salary_app_information',
    };
    const bodyDataUserList = {
      limit: 1000000,
      start: 0,
      filter: {
        search: name ? name : '',
      },
    };

    let userStatusBodyData = {
      limit: 0,
      start: 0,
      filter: {},
    };
    let tempUserListIds = [];
    let tempUserStatus = [];
    let apiUserListData = await apiPostService(
      Constants?.user_list_api,
      bodyDataUserList,
    );
    let apiHomeData = await apiPostService(Constants?.sfa_admin_home_api, {});
    let apiUserStatusData = await apiPostService(
      Constants?.user_status_list_api,
      userStatusBodyData,
    );
    let get_content_data = await apiPostService(
      Constants?.get_content_api,
      appInfobodyData,
    );
    if (apiUserListData?.data?.result?.data) {
      apiUserListData?.data?.result?.data.forEach(element => {
        tempUserListIds.push({ user_id: element.id });
      });

      apiUserStatusData?.data?.result?.data.forEach(element => {
        tempUserStatus.push({
          label: element?.name,
          value: element?.name,
          id: element?.id,
        });
      });

      apiUserListData = {
        ...apiUserListData.data.result,
        user_ids: tempUserListIds,
      };
      apiHomeData = {
        ...apiHomeData?.data,
        appInfo: get_content_data.data?.result?.data[0],
      };
      setLoader(false);
      dispatch(usersList(apiUserListData));
      dispatch(appHomeData(apiHomeData));
      dispatch(userStatusListData(tempUserStatus));
      if (searchRef.current) {
        searchRef.current.focus();
      }
    } else {
      console.log('Not Found');
    }
  }
  const handleHomeData = () => {
    getUsersList();
    getUnreadNotificationCount();
    getAttendanceList();
    getBranchData();
  };
  useFocusEffect(
    React.useCallback(() => {
      handleHomeData();
    }, []),
  );
  async function onSubmitEditing(text) {
    getUsersList(text);
    setEmpName(text);
  }
  const onChange = React.useCallback(text => {
    setEmpName(text);
    // getUsersList(text)
  }, []);
  async function onChangeBroadcast(name, text) {
    setBroadCastInput(prv => ({ ...prv, [name]: text }));
    setErrorMessage(null);
  }

  async function handleBrodcastMessage() {
    if (broadCastInput.title === '' && broadCastInput.remark === '') {
      setErrorMessage(prv => ({
        ...prv,
        title: t(Config.otherText?.required),
      }));
      setErrorMessage(prv => ({
        ...prv,
        remark: t(Config.otherText?.required),
      }));
    } else if (broadCastInput.title === '') {
      setErrorMessage(prv => ({
        ...prv,
        title: t(Config.otherText?.required),
      }));
    } else if (broadCastInput.remark === '') {
      setErrorMessage(prv => ({
        ...prv,
        remark: t(Config.otherText?.required),
      }));
    } else {
      const bodyData = {
        title: broadCastInput?.title,
        remark: broadCastInput?.remark,
        userIds: adminData?.data.usersList.user_ids,
      };
      let apiData = await apiPostService(
        Constants?.send_notification_api,
        bodyData,
      );
      if (apiData?.data?.status == 'success') {
        setBroadCastInput({
          title: '',
          remark: '',
        });
        setBroadcastModal(false);
        Toast.show({
          type: 'info',
          text1: t(Config.adminHomeScreenText?.broadcast_message_send_success),
          position: 'top',
          swipeable: true,
        });
      } else {
        console.log('Not Found');
      }
    }
  }
  const renderEmpItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Config.Colors.borderColor,
          paddingBottom: 5,
        }}
        onPress={() =>
          navigation.navigate('salaryDetails', {
            empName: item.name,
            id: item?.id,
          })
        }
      >
        <View
          style={{ flexDirection: 'row', gap: 15, marginTop: widthToDp(5) }}
        >
          {item.name ? (
            <Text
              style={{
                ...styles.firstWord,
                backgroundColor:
                  index % 2 == 0
                    ? Config.Colors.themeColor
                    : Config.Colors.secondary,
              }}
            >
              {item.name.replace(/\s/g, '').slice(0, 1).toUpperCase()}
            </Text>
          ) : null}
          <View>
            <Text
              style={{
                color: Config.Colors.textColor.textColor_2,
                fontSize: widthToDp(4),
                fontFamily: Config.fontFamilys.Poppins_Medium,
              }}
            >
              {item?.name}
            </Text>
            <Text
              style={{
                fontSize: widthToDp(2.5),
                fontFamily: Config.fontFamilys.Poppins_SemiBold,
                color: Config.Colors.textColor.textColor_1,
              }}
            >
              {' '}
              {t(Config.employeelistText?.last_used)} : {item?.last_used}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBanner = React.useCallback(({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          width: widthToDp(90),
          height: 150,
          // backgroundColor: Config.Colors.themeColor,
          borderRadius: 10,
          justifyContent: 'center',
          zIndex: -1,
        }}
      >
        <Image
          source={{ uri: item?.image_path }}
          style={{
            width: '100%',
            height: 150,
            resizeMode: 'cover',
            borderRadius: 10,
          }}
          onLoad={() => setBannerLoader(true)}
          onLoadStart={() => setBannerLoader(true)}
          onLoadEnd={() => setBannerLoader(false)}
        />

        {bannerLoader ? (
          <View
            style={{
              width: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size={35} color={Config.Colors.themeColor} />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }, []);

  const handleDropDown = item => {
    setSelectedBranch(item);
  };
  const onSubmitEmpForm = async () => {
    console.log('form submitted==>', empformInputs);
    if (empformInputs?.name === '') {
      setErrorMessage(prv => ({ ...prv, name: t(Config.otherText?.required) }));
    } else if (empformInputs?.employee_detail === '') {
      setErrorMessage(prv => ({
        ...prv,
        employee_detail: t(Config.otherText?.required),
      }));
    } else if (empformInputs?.mobile_no === '') {
      setErrorMessage(prv => ({
        ...prv,
        mobile_no: t(Config.otherText?.required),
      }));
    } else if (empformInputs?.emp_code === '') {
      setErrorMessage(prv => ({
        ...prv,
        emp_code: t(Config.otherText?.required),
      }));
    } else if (empformInputs?.attendance_within === '') {
      setErrorMessage(prv => ({
        ...prv,
        attendance_within: t(Config.otherText?.required),
      }));
    } else if (empformInputs?.role === '') {
      setErrorMessage(prv => ({ ...prv, role: t(Config.otherText?.required) }));
    } else if (empformInputs?.date_of_joining === '') {
      setErrorMessage(prv => ({
        ...prv,
        date_of_joining: t(Config.otherText?.required),
      }));
    } else if (empformInputs?.working_hours === '') {
      setErrorMessage(prv => ({
        ...prv,
        working_hours: t(Config.otherText?.required),
      }));
    } else {
      setLoader(true);
      let bodyData = empformInputs;
      let apiData = await apiPostService(Constants?.add_user_api, bodyData);
      console.log('apiData====>', apiData);
      if (apiData?.data?.status) {
        setLoader(false);
        setIsAlertModal(true);
        setAlertdata({
          statusText: apiData?.data?.message,
          time: '',
          confirm: () => {
            setIsAlertModal(false);
            setAddEmpModal(false);
            setEmpformInputs(initialEmpFromValue);
          },
          cancel: () => {
            setIsAlertModal(false);
          },
        });
      } else {
        console.log('Not Found');
      }
    }
  };
  // // if (apiData?.data?.status === "200") {
  //   setLoader(false)
  //   setIsAlertModal(true)
  //   setAlertdata({
  //     statusText: apiData?.data?.message,
  //     time: "",
  //     confirm: () => {
  //       setIsAlertModal(false);
  //       setAddEmpModal(false);
  //       setEmpformInputs(initialEmpFromValue)
  //     },
  //     cancel: () => {
  //       setIsAlertModal(false);
  //       // setAddEmpModal(false);
  //       // setEmpformInputs(initialEmpFromValue);
  //     },
  //   });

  // } else {
  //   console.log("Not Found")
  // }
  // }

  const renderWeekDays = ({ item, index }) => {
    return (
      <View
        style={{
          padding: 5,
          margin: 5,
          borderWidth: 0.5,
          backgroundColor: Config.Colors.defaultColor,
          borderRadius: 5,
          borderColor: Config.Colors.themeColor,
        }}
      >
        <CustomCheckBox
          handleOptionPress={(value, newValue) =>
            handleEmpChange(item.key, newValue)
          }
          checkBoxValue={item?.name}
          checkButtonText={item?.name}
        />
      </View>
    );
  };
  React.useEffect(() => {
    // let subscription = DeviceEventEmitter.addListener(
    //   'RNSettings.GPS_PROVIDER_EVENT',
    //   (location) => {
    //     Toast.show({
    //       type: 'info',
    //       text1: 'Opps! Something is went wrong',
    //       position: 'top',
    //     });
    //     // do something with the location
    //   }
    // );
    // return subscription.remove()
    // DeviceInfo.getDeviceLocationStatus().then((status) => {
    // });
  }, []);

  const renderHomeFooterItem = ({ item }) => {
    return item.status ? (
      <View>
        <CustomMenu
          tintColor2={Config.Colors.themeColor}
          item={item}
          onPress={text => onPressBtn(text)}
          style={{ ...styles, box: { width: widthToDp(88), borderRadius: 10 } }}
          disBottomImg={Icons.arrow_forward}
        />
      </View>
    ) : null;
  };
  const onPresshelpIcon = () => {
    Alert.alert(
      'Message',
      `${adminData?.data?.appHomeData?.appInfo?.description}`,
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        <View style={{ zIndex: 9999 }}>
          <Header_2
            commonWidth={widthToDp(12)}
            commonHeight={heightToDp(5)}
            animated={true}
            rightImage={Icons.bell_icon}
            onPressRight={() => onPressBtn('notification')}
            tintColorRight={Config.Colors.defaultColor}
            rightImageTopText={notificationCount}
            filterBranch={true}
            branchData={adminData?.data?.branchesData?.dropDownData}
            handleDropDown={handleDropDown}
            dropDowninitial={selectedBranch}
            helpIcon={Icons.help_icon}
            onPresshelpIcon={onPresshelpIcon}
          />
        </View>

        <View style={styles.body}>
          <View style={styles.bodyContainer}>
            <FlatList
              refreshing={pullRefresh}
              onRefresh={() => handleHomeData()}
              showsVerticalScrollIndicator={false}
              data={[0]}
              contentContainerStyle={{
                // justifyContent: 'center',
                // alignItems: 'center',
                paddingBottom: widthToDp(45),
              }}
              renderItem={() => {
                return (
                  <View
                    style={{ gap: 10, backgroundColor: Config.Colors.bodyBg }}
                  >
                    <View style={{ gap: 10 }}>
                      <TouchableOpacity
                        style={{ ...styles?.attContainer, padding: 15 }}
                        onPress={() => onPressBtn('manage_attendance')}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            paddingBottom: 15,
                          }}
                        >
                          <Image
                            source={Icons.Leave_attendance}
                            style={{ width: 20, height: 20 }}
                          />
                          <Text
                            style={{
                              color: Config?.Colors?.black,
                              fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            }}
                          >
                            {t(Config.adminHomeScreenText?.manage_attendance)}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flexDirection: 'row', gap: 20 }}>
                            <View
                              style={{
                                backgroundColor: Config.Colors.bodyBg,
                                padding: 10,
                                width: 100,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily:
                                    Config.fontFamilys.Poppins_SemiBold,
                                  color: Config.Colors.textColor.textColor_2,
                                }}
                              >
                                {adminHomeData?.countData?.totalSalaryUser}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: Config.fontFamilys.Poppins_Medium,
                                  color: Config.Colors.textColor.textColor_1,
                                }}
                              >
                                {t(Config.adminHomeScreenText?.all_emp)}
                              </Text>
                            </View>
                            <View
                              style={{
                                backgroundColor: Config.Colors.bodyBg,
                                padding: 10,
                                width: 100,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily:
                                    Config.fontFamilys.Poppins_SemiBold,
                                  color: Config.Colors.textColor.textColor_2,
                                }}
                              >
                                {
                                  adminHomeData?.countData
                                    ?.totalTodayPresentUser
                                }
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: Config.fontFamilys.Poppins_Medium,
                                  color: Config.Colors.textColor.textColor_1,
                                }}
                              >
                                {t(Config.adminHomeScreenText?.present)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              alignItems: 'flex-start',
                            }}
                          >
                            <Image
                              source={Icons?.arrow_right}
                              tintColor={Config.Colors.secondary}
                              style={{ width: 20, height: 20 }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View>
                        {adminData?.data?.appHomeData?.result?.bannerData ? (
                          <FlatList
                            data={
                              adminData?.data?.appHomeData?.result?.bannerData
                            }
                            renderItem={renderBanner}
                            // extraData={adminData?.data?.appHomeData?.result?.bannerData}
                            keyExtractor={(item, index) => String(index)}
                            horizontal={true}
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                          />
                        ) : loader ? (
                          <View style={{ justifyContent: 'center' }}>
                            <ActivityIndicator
                              size="large"
                              color={Config.Colors.themeColor}
                            />
                          </View>
                        ) : (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <SvgXml xml={NotFound_result} />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          // bottom: widthToDp(25),
                          // alignItems: 'flex-end',
                          width: widthToDp(90),
                          flexDirection: 'row',
                          gap: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: Config.Colors.themeColor,
                            padding: 10,
                            borderRadius: 6,
                            width: widthToDp(43),
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 10,
                          }}
                          onPress={() => setBroadcastModal(true)}
                        >
                          <View>
                            <Image
                              source={Icons.send_broadcast_icon}
                              style={{
                                width: widthToDp(5),
                                height: widthToDp(5),
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              color: Config.Colors.defaultColor,
                              fontSize: widthToDp(3.5),
                              flexWrap: 'wrap',
                            }}
                          >
                            {t(Config.adminHomeScreenText?.send_notification)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: Config.Colors.themeColor,
                            padding: 10,
                            borderRadius: 6,
                            width: widthToDp(43),
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 10,
                          }}
                          onPress={() => setAddEmpModal(true)}
                        >
                          <View>
                            <Image
                              source={Icons.add_user_icon}
                              style={{
                                width: widthToDp(5),
                                height: widthToDp(5),
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              color: Config.Colors.defaultColor,
                              fontSize: widthToDp(3.5),
                              flexWrap: 'wrap',
                            }}
                          >
                            {t(Config.adminHomeScreenText?.add_emp)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <FlatList
                      data={Config?.adminHomeData}
                      extraData={Config?.adminHomeData}
                      renderItem={(item, index) =>
                        renderHomeFooterItem(item, index)
                      }
                      keyExtractor={(key, index) => String(index)}
                      // numColumns={2}
                      ItemSeparatorComponent={() => {
                        return (
                          <View
                            style={{
                              paddingTop: 5,
                            }}
                          />
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={
                        {
                          // justifyContent: 'center',
                          // alignItems: 'center',
                          // paddingBottom: 50,
                        }
                      }
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
        {broadcastModal ? (
          <CustomModal
            modalVisible={broadcastModal}
            onRequestClose={() => setBroadcastModal(!broadcastModal)}
            showHeader={true}
            headerText={t(Config.adminHomeScreenText?.new_broadcast)}
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
                  {t(Config.adminHomeScreenText?.new_broadcast)}
                </Text>
                <TouchableOpacity onPress={() => setBroadcastModal(false)}>
                  <Image
                    source={Icons.close}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: Config.Colors.themeColor,
                  fontFamily: Config.fontFamilys.Poppins_SemiBold,
                  marginBottom: 10,
                }}
              >
                {t(Config.adminHomeScreenText?.send_broadcast_to_all_emp)}
              </Text>
              <View style={{ gap: 2 }}>
                <CustomInputBox
                  commonWidth={widthToDp(80)}
                  commonHeight={widthToDp(15)}
                  onChangeText={text => onChangeBroadcast('title', text)}
                  inputValue={broadCastInput?.title}
                  placeholder={t(Config.adminHomeScreenText?.enter_title)}
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  autoComplete={'given-name'}
                  errorMessage={errorMessage?.title ? errorMessage?.email : ''}
                  borderColor={
                    errorMessage?.title
                      ? Config.Colors.errorFieldBorder
                      : Config.Colors.borderColor
                  }
                />
                <CustomInputBox
                  commonWidth={widthToDp(80)}
                  commonHeight={widthToDp(30)}
                  onChangeText={text => onChangeBroadcast('remark', text)}
                  inputValue={broadCastInput?.remark}
                  placeholder={t(Config.adminHomeScreenText?.enter_message)}
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  autoComplete={'given-name'}
                  numberOfLines={10}
                  errorMessage={errorMessage?.remark ? errorMessage?.email : ''}
                  borderColor={
                    errorMessage?.remark
                      ? Config.Colors.errorFieldBorder
                      : Config.Colors.borderColor
                  }
                />
              </View>
              <TouchableOpacity
                style={{
                  width: widthToDp(80),
                  minHeight: widthToDp(15),
                  backgroundColor: Config.Colors.themeColor,
                  borderRadius: 10,
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                // disabled={broadCastInput ? false : true}
                onPress={() => handleBrodcastMessage()}
              >
                <View>
                  <Text
                    style={{
                      color: Config?.Colors?.defaultColor,
                      fontFamily: Config.fontFamilys.Poppins_SemiBold,
                    }}
                  >
                    {t(Config.adminHomeScreenText?.send_broadcast)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </CustomModal>
        ) : null}

        {addEmpModal ? (
          <CustomModal
            modalVisible={addEmpModal}
            onRequestClose={() => {
              setAddEmpModal(!addEmpModal);
              // setErrorMessage(null)
            }}
            alignItems="center"
            justifyContent="center"
            disableOnPress={false}
            showHeader={true}
            animationType="slide"
          >
            {/* <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}> */}

            <ScrollView
              style={{
                borderRadius: widthToDp(2),
                width: widthToDp(100),
                height: heightToDp(100),
                backgroundColor: Config.Colors.bodyBg,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  borderRadius: widthToDp(2),
                  paddingBottom: widthToDp(50),
                }}
              >
                <Header_2
                  leftImage={Icons.arrow_back}
                  commonWidth={widthToDp(12)}
                  commonHeight={heightToDp(5)}
                  leftText={t(Config.adminHomeScreenText?.add_emp)}
                  animated={true}
                  onPressLeft={() => {
                    setAddEmpModal(!addEmpModal);
                    setErrorMessage(null);
                    setEmpformInputs(initialEmpFromValue);
                  }}
                />
                {/* <View style={{ padding: 10 }}>
                    <Text
                      style={{
                        color: Config.Colors.black,
                        fontSize: widthToDp(4.5)
                      }}>Under Development</Text>
                  </View> */}
                <View
                  style={{
                    width: widthToDp(90),
                    // height: widthToDp(75),
                    marginTop: 10,
                    backgroundColor: Config.Colors.bodyBg,
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingBottom: 60,
                    paddingTop: 10,
                  }}
                >
                  {loader === true ? (
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        zIndex: 9999,
                      }}
                    >
                      <ActivityIndicator
                        size={35}
                        color={Config.Colors.themeColor}
                      />
                    </View>
                  ) : null}
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.emp_name)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="default"
                          bgColor={Config.Colors.inputField}
                          autoComplete="name"
                          autoCapitalize={'none'}
                          onChangeText={text => handleEmpChange('name', text)}
                          value={empformInputs?.name}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          leftImage={Icons.user_icon}
                          errorMessage={
                            errorMessage?.name ? errorMessage?.name : ''
                          }
                          borderColor={
                            errorMessage?.name
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          // fontSize={  widthToDp(3.5) }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.emp_detail)}*
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="default"
                          bgColor={Config.Colors.inputField}
                          autoComplete="off"
                          autoCapitalize={'none'}
                          onChangeText={text =>
                            handleEmpChange('employee_detail', text)
                          }
                          value={empformInputs?.employee_detail}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          // leftImage={Icons.user_icon}
                          errorMessage={
                            errorMessage?.employee_detail
                              ? errorMessage?.employee_detail
                              : ''
                          }
                          borderColor={
                            errorMessage?.employee_detail
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          // fontSize={  widthToDp(3.5) }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.mob_number)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType={'number-pad'}
                          autoCapitalize={'none'}
                          autoComplete={'cc-number'}
                          maxLength={10}
                          bgColor={Config.Colors.inputField}
                          leftImage={Icons.telephone_icon}
                          countryCodeStatus={true}
                          onChangeText={text =>
                            handleEmpChange('mobile_no', text)
                          }
                          value={empformInputs?.mobile_no}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.mobile_no
                              ? errorMessage?.mobile_no
                              : ''
                          }
                          borderColor={
                            errorMessage?.mobile_no
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.emp_code)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType={'number-pad'}
                          autoCapitalize={'none'}
                          autoComplete={'cc-number'}
                          maxLength={10}
                          bgColor={Config.Colors.inputField}
                          // leftImage={Icons.telephone_icon}
                          countryCodeStatus={true}
                          onChangeText={text =>
                            handleEmpChange('emp_code', text)
                          }
                          value={empformInputs?.emp_code}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.emp_code ? errorMessage?.emp_code : ''
                          }
                          borderColor={
                            errorMessage?.emp_code
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.ref_name)}
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType={'default'}
                          autoCapitalize={'none'}
                          autoComplete={'off'}
                          maxLength={10}
                          bgColor={Config.Colors.inputField}
                          // leftImage={Icons.telephone_icon}
                          countryCodeStatus={true}
                          onChangeText={text =>
                            handleEmpChange('ref_name', text)
                          }
                          value={empformInputs?.ref_name}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.ref_name ? errorMessage?.ref_name : ''
                          }
                          borderColor={
                            errorMessage?.ref_name
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.emp_cat)}
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomDropDownComponent
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          // errorMessage={errorMessage?.salary_payment_type ? errorMessage?.salary_payment_type : ''}
                          borderColor={
                            errorMessage?.employee_category
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={usercategoryList}
                          onChangeDropDown={text =>
                            handleEmpChange('employee_category', text)
                          }
                          backgroundColor={Config.Colors.defaultColor}
                          // initialValue={empformInputs.employee_category}
                          value={empformInputs.employee_category}
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.designation)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomDropDownComponent
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          errorMessage={
                            errorMessage?.role ? errorMessage?.role : ''
                          }
                          borderColor={
                            errorMessage?.role
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={adminData?.data?.usersRole?.dropDownData}
                          onChangeDropDown={text =>
                            handleEmpChange('role', text)
                          }
                          backgroundColor={Config.Colors.defaultColor}
                          value={empformInputs.role}
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.attendance_within)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomDropDownComponent
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          errorMessage={
                            errorMessage?.attendance_within
                              ? errorMessage?.attendance_within
                              : ''
                          }
                          borderColor={
                            errorMessage?.attendance_within
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={[
                            {
                              label: t(Config.adminHomeScreenText?.branch),
                              value: 'branch',
                              id: 1,
                            },
                            {
                              label: t(Config.adminHomeScreenText?.anywhere),
                              value: 'anywhere',
                              id: 2,
                            },
                          ]}
                          onChangeDropDown={text =>
                            handleEmpChange('attendance_within', text)
                          }
                          backgroundColor={Config.Colors.defaultColor}
                          value={empformInputs.attendance_within}
                        />
                      </View>
                    </View>
                    {empformInputs?.attendance_within === 'branch' ? (
                      <View>
                        <View style={styles.messageBoxContainer}>
                          <Text style={{ ...styles.messageBox }}>
                            {t(Config.adminHomeScreenText?.branch)}
                          </Text>
                        </View>
                        <View style={styles.inputField}>
                          <CustomDropDownComponent
                            commonWidth={widthToDp(90)}
                            commonHeight={widthToDp(15)}
                            errorMessage={
                              errorMessage?.branch ? errorMessage?.branch : ''
                            }
                            borderColor={
                              errorMessage?.branch
                                ? Config.Colors.errorFieldBorder
                                : Config.Colors.borderColor
                            }
                            data={adminData?.data?.branchesData?.dropDownData}
                            onChangeDropDown={text =>
                              handleEmpChange('branch', text)
                            }
                            backgroundColor={Config.Colors.defaultColor}
                            Value={empformInputs.branch}
                          />
                        </View>
                      </View>
                    ) : null}

                    <View style={{ width: widthToDp(90) }}>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.date_of_joining)} *
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.inputField}
                        onPress={() => {
                          setIsDateTimePickerModal(true);
                          setWorkingTimeType('date_of_joining');
                          setDateTimePickerType({
                            display: 'calendar',
                            mode: 'date',
                          });
                        }}
                      >
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          // onFocusFunction={() => setIsDateTimePickerModal(true)}
                          editable={false}
                          keyboardType={'default'}
                          autoCapitalize={'none'}
                          autoComplete={'given-name'}
                          bgColor={Config.Colors.inputField}
                          countryCodeStatus={true}
                          onChangeText={text =>
                            handleEmpChange('date_of_joining', text)
                          }
                          value={empformInputs?.date_of_joining}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.date_of_joining
                              ? errorMessage?.date_of_joining
                              : ''
                          }
                          borderColor={
                            errorMessage?.date_of_joining
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.salary_wage)}
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType={'number-pad'}
                          autoCapitalize={'none'}
                          autoComplete={'cc-number'}
                          bgColor={Config.Colors.inputField}
                          countryCodeStatus={true}
                          onChangeText={text =>
                            handleEmpChange('salary_wages', text)
                          }
                          value={empformInputs?.salary_wages}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.salary_wages
                              ? errorMessage?.salary_wages
                              : ''
                          }
                          borderColor={
                            errorMessage?.salary_wages
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.working_hours)}
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType={'number-pad'}
                          autoCapitalize={'none'}
                          autoComplete={'cc-number'}
                          bgColor={Config.Colors.inputField}
                          countryCodeStatus={true}
                          onChangeText={text =>
                            handleEmpChange('working_hours', text)
                          }
                          value={empformInputs?.working_hours}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.working_hours
                              ? errorMessage?.working_hours
                              : ''
                          }
                          borderColor={
                            errorMessage?.working_hours
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>

                    {empformInputs?.employee_category !== 'Contract' && (
                      <View>
                        <View style={styles.messageBoxContainer}>
                          <Text style={{ ...styles.messageBox }}>
                            {t(Config.adminHomeScreenText?.inc_periods)}
                          </Text>
                        </View>
                        <View style={styles.inputField}>
                          <CustomInput
                            backgroundColor={Config.Colors.defaultColor}
                            keyboardType={'number-pad'}
                            autoCapitalize={'none'}
                            autoComplete={'cc-number'}
                            bgColor={Config.Colors.inputField}
                            countryCodeStatus={true}
                            onChangeText={text =>
                              handleEmpChange('increment_period', text)
                            }
                            value={empformInputs?.increment_period}
                            commonWidth={widthToDp(90)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            errorMessage={
                              errorMessage?.increment_period
                                ? errorMessage?.increment_period
                                : ''
                            }
                            borderColor={
                              errorMessage?.increment_period
                                ? Config.Colors.errorFieldBorder
                                : Config.Colors.borderColor
                            }
                          />
                        </View>
                      </View>
                    )}

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.report_text?.user_status)}
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomDropDownComponent
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          // errorMessage={errorMessage?.user_status ? errorMessage?.user_status : ''}
                          borderColor={
                            errorMessage?.user_status
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={[
                            {
                              label: t(Config.adminHomeScreenText?.pending),
                              value: 'Pending',
                            },
                            {
                              label: t(Config.adminHomeScreenText?.approved),
                              value: 'Approved',
                            },
                            {
                              label: t(Config.adminHomeScreenText?.approved),
                              value: 'Rejected',
                            },
                          ]}
                          onChangeDropDown={text =>
                            handleEmpChange('user_status', text)
                          }
                          backgroundColor={Config.Colors.defaultColor}
                          initialValue={empformInputs.user_status}
                        />
                      </View>
                    </View>
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <CustomLinearButton
                        commonWidth={widthToDp(40)}
                        text={t(Config.otherText?.submit)}
                        onPress={onSubmitEmpForm}
                        color={Config.Colors.defaultColor}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
          </CustomModal>
        ) : null}
        {isDateTimePickerModal ? (
          <DateTimePicker
            value={selectedDate}
            mode={dateTimePickerType.mode}
            themeVariant="light"
            display={dateTimePickerType?.display}
            onChange={(event, time) =>
              handleDateChange(event, time, workingTimeType)
            }
            negativeButton={{
              label: t(Config.branchesText?.cancel),
              textColor: Config.Colors.errorText,
            }}
            positiveButton={{
              label: t(Config.manage_attendance?.confirm),
              textColor: Config.Colors.themeColor,
            }}
          />
        ) : null}
        {isAlertModal ? (
          <AltertBox
            isModalVisible={isAlertModal}
            onRequestClose={() => setIsAlertModal(false)}
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
    </SafeAreaView>
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
    // width: widthToDp(90),
    backgroundColor: Config.Colors.defaultColor,
    borderRadius: 10,
    // justifyContent: 'space-between',
    // alignContent: 'center',
    // borderWidth: .1,
    padding: 10,
  },
  body: {
    // position:'absolute',
    width: widthToDp(100),
    alignItems: 'center',
    marginTop: 10,
    // justifyContent: 'center',
    // height: '94%'
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
  messageBoxContainer: {
    alignSelf: 'flex-start',
    // marginTop: 5,
  },
  messageBox: {
    fontSize: widthToDp(3.5),
    fontWeight: Config.WEIGHTS.light,
    fontFamily: Config.fontFamilys.Poppins_Medium,
    // color: Config.Colors.primary,
    // marginBottom: 5,
    color: Config.Colors.black,
  },
  inputField: {
    marginTop: 5,
    // marginBottom: 15
  },
  block: {
    height: 100,
    width: 100,
    backgroundColor: 'black',
    marginBottom: 30,
  },
});
export default React.memo(Home);
