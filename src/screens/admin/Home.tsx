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
  Animated,
} from 'react-native';
import React, { useRef } from 'react';
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
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import AltertBox from '../../components/AltertBox';
import CustomMenu from '../../components/CustomMenu';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';
 
const CustomInputAny = CustomInput as React.ComponentType<any>;
const CustomInputBoxAny = CustomInputBox as React.ComponentType<any>;
const CustomDropDownAny = CustomDropDownComponent as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;
const CustomButtonAny = CustomButton as React.ComponentType<any>;
const CustomModalAny = CustomModal as React.ComponentType<any>;
const CustomMenuAny = CustomMenu as React.ComponentType<any>;
 
type HomeProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
  route?: any;
  onPress?: any;
};
 
type AlertData = {
  statusText: string;
  time: string;
  confirm: () => void;
  cancel: () => void;
};
 
type EmpFormInputs = {
  [key: string]: any;
};
 
const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [scrollY] = React.useState(new Animated.Value(0));
  const HEADER_MAX_HEIGHT = heightToDp(57);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
 
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, 0],
    extrapolate: 'clamp',
  });
 
  const userData = useSelector((state: any) => state.login);
  const adminData = useSelector((state: any) => state.admin);
  const adminHomeData = useSelector(
    (state: any) => state?.admin?.data?.appHomeData?.result,
  );
 
  const [notificationCount, setNotificationCount] = React.useState<
    number | string | null
  >(null);
  const [isDateTimePickerModal, setIsDateTimePickerModal] =
    React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<any>('');
  const [barnchData, setBarnchData] = React.useState<any[]>([]);
  const [empName, setEmpName] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const searchRef = useRef<any>(null);
  const [bannerLoader, setBannerLoader] = React.useState(false);
  const [errorMessage, setErrorMessage] =
    React.useState<Record<string, string> | null>(null);
  const [addEmpModal, setAddEmpModal] = React.useState(false);
  const [pullRefresh, setPullRefresh] = React.useState(false);
  const [workingTimeType, setWorkingTimeType] = React.useState('');
  const [alertdata, setAlertdata] = React.useState<AlertData | null>(null);
  const [isAlertModal, setIsAlertModal] = React.useState(false);
  const [usercategoryList, setUsercategoryList] = React.useState<any[]>([]);
  const { t } = useTranslation();
  const [dateTimePickerType, setDateTimePickerType] = React.useState<{
    display: any;
    mode: 'time' | 'date';
  }>({
    display: 'clock',
    mode: 'time',
  });
 
  const initialEmpFromValue: EmpFormInputs = {
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
 
  const [empformInputs, setEmpformInputs] =
    React.useState<EmpFormInputs>(initialEmpFromValue);
 
  const handleEmpChange = React.useCallback((name: string, text: any) => {
    setEmpformInputs(prv => {
      const updatedInputs = { ...prv, [name]: text };
 
      if (name === 'role') {
        updatedInputs.designation =
          text === 22 ? 'salary user' : text === 23 ? 'attendance within' : '';
      }
 
      return updatedInputs;
    });
 
    setErrorMessage(null);
  }, []);
 
  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date,
    name?: string,
  ) => {
    const currentDate = date ?? new Date();
    setIsDateTimePickerModal(false);
    setSelectedDate(currentDate);
    if (!name) return;
 
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
  };
 
  const [broadCastInput, setBroadCastInput] = React.useState({
    title: '',
    remark: '',
  });
 
  const [broadcastModal, setBroadcastModal] = React.useState(false);
  const dispatch = useDispatch();
 
  async function getBranchData() {
    const bodyData = {
      limit: 500,
      start: 0,
      filter: {},
    };
 
    let tempData: any[] = [];
    let tempRoleData: any[] = [];
    const apiData = await apiPostService(Constants?.branch_list_api, bodyData);
    let apiRoleData = await apiPostService(Constants?.role_list_api, bodyData);
    const apiCategoryData = await apiPostService(
      Constants?.category_list_api,
      bodyData,
    );
    const tempCatData: any[] = [];
 
    if (apiCategoryData?.data?.result) {
      apiCategoryData?.data?.result?.data?.forEach((item: any) => {
        tempCatData.push({ label: item.name, value: item.name, id: item.id });
      });
      setUsercategoryList(tempCatData);
    }
 
    if (apiData?.data?.result?.data) {
      apiData?.data?.result?.data.forEach((element: any) => {
        tempData.push({
          label: element?.branch_name,
          value: element?.branch_name,
          id: element?.id,
        });
      });
      const branchPayload = {
        branches: apiData?.data?.result?.data,
        dropDownData: tempData,
      };
      dispatch(branchesData(branchPayload));
      setBarnchData(tempData);
    }
 
    if (apiRoleData?.data?.result?.data) {
      apiRoleData?.data?.result?.data.forEach((element: any) => {
        tempRoleData.push({
          label: element?.name,
          value: element?.id,
          id: element?.id,
        });
      });
      const rolePayload = {
        userRole: apiRoleData?.data?.result?.data,
        dropDownData: tempRoleData,
      };
      dispatch(usersRole(rolePayload));
      setBarnchData(tempRoleData);
    }
  }
 
  async function onPressBtn(text: string) {
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
    const bodyData = { limit: 20, start: 0, filter: {} };
    const apiData = await apiPostService(
      Constants?.get_unread_notification_count_api,
      bodyData,
    );
    if (isApiSuccess(apiData)) {
      setNotificationCount(apiData?.data?.result?.data);
    }
  }
 
  async function getAttendanceList() {
    const tempData: any[] = [];
    const bodyData = {
      attend_date: `${toLocaleDateString(new Date()).customDate}`,
      attend_month: '',
    };
    let apiData = await apiPostService(
      Constants?.attendance_v2_list_api,
      bodyData,
    );
    if (apiData?.data?.result) {
      Object.keys(apiData?.data?.result.detail).map(key => {
        if (key === 'Present') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#f5faf6',
            borderColor: '#05f545',
          });
        } else if (key === 'Absent') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#f9f5f4',
            borderColor: '#da2f35',
          });
        } else if (key === 'Half day') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#faf8f1',
            borderColor: '#f0d37d',
          });
        } else if (key === 'Paid Leave') {
          tempData.push({
            name: key,
            value: apiData?.data?.result.detail[key],
            backgroundColor: '#faf5fa',
            borderColor: '#d279d2',
          });
        }
      });
      apiData = { ...apiData.data.result, detail: tempData };
      dispatch(attendanceV2List(apiData));
    }
  }
 
  async function getUsersList(name?: string) {
    setLoader(true);
    const appInfobodyData = { type: 'salary_app_information' };
    const bodyDataUserList = {
      limit: 1000000,
      start: 0,
      filter: { search: name ? name : '' },
    };
 
    const userStatusBodyData = { limit: 0, start: 0, filter: {} };
    const tempUserListIds: any[] = [];
    const tempUserStatus: any[] = [];
 
    let apiUserListData = await apiPostService(
      Constants?.user_list_api,
      bodyDataUserList,
    );
    let apiHomeData = await apiPostService(Constants?.sfa_admin_home_api, {});
    let apiUserStatusData = await apiPostService(
      Constants?.user_status_list_api,
      userStatusBodyData,
    );
    const get_content_data = await apiPostService(
      Constants?.get_content_api,
      appInfobodyData,
    );
 
    if (apiUserListData?.data?.result?.data) {
      apiUserListData?.data?.result?.data.forEach((element: any) => {
        tempUserListIds.push({ user_id: element.id });
      });
 
      apiUserStatusData?.data?.result?.data.forEach((element: any) => {
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
        appInfo: get_content_data?.data?.result?.data?.[0],
      };
      setLoader(false);
      dispatch(usersList(apiUserListData));
      dispatch(appHomeData(apiHomeData));
      dispatch(userStatusListData(tempUserStatus));
      if (searchRef.current) {
        searchRef.current.focus();
      }
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
 
  async function onSubmitEditing(text: string) {
    getUsersList(text);
    setEmpName(text);
  }
 
  const onChange = React.useCallback((text: string) => {
    setEmpName(text);
  }, []);
 
  async function onChangeBroadcast(name: string, text: string) {
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
        userIds: adminData?.data?.usersList?.user_ids,
      };
      const apiData = await apiPostService(
        Constants?.send_notification_api,
        bodyData,
      );
      if (apiData?.data?.status === 'success') {
        setBroadCastInput({ title: '', remark: '' });
        setBroadcastModal(false);
        Toast.show({
          type: 'info',
          text1: t(Config.adminHomeScreenText?.broadcast_message_send_success),
          position: 'top',
          swipeable: true,
        });
      }
    }
  }
 
  const renderEmpItem = ({ item, index }: { item: any; index: number }) => {
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
        <View style={{ flexDirection: 'row', gap: 15, marginTop: widthToDp(5) }}>
          {item.name ? (
            <Text
              style={{
                ...styles.firstWord,
                backgroundColor:
                  index % 2 === 0
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
              {t(Config.employeelistText?.last_used)} : {item?.last_used}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
 
  const renderBanner = React.useCallback(
    ({ item }: { item: any }) => {
      return (
        <TouchableOpacity
          style={{
            width: widthToDp(90),
            height: 150,
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
    },
    [bannerLoader],
  );
 
  const handleDropDown = (item: any) => {
    setSelectedBranch(item);
  };
 
  const onSubmitEmpForm = async () => {
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
      const apiData = await apiPostService(Constants?.add_user_api, empformInputs);
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
      }
    }
  };
 
  const renderWeekDays = ({ item }: { item: any }) => {
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
        <CustomCheckBox index={item.key}
          handleOptionPress={(value: any, newValue: any) =>
            handleEmpChange(item.key, newValue)
          }
          checkBoxValue={item?.name}
          checkButtonText={item?.name}
        />
      </View>
    );
  };
 
  const renderHomeFooterItem = ({ item }: { item: any }) => {
    return item?.status ? (
      <View>
        <CustomMenuAny
          tintColor2={Config.Colors.themeColor}
          item={item}
          onPress={(text: string) => onPressBtn(text)}
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
      <View>
        <View style={{ zIndex: 9999 }}>
          <Header_2
            commonWidth={widthToDp(12)}
            commonHeight={heightToDp(5)}
            animated={true}
            rightImage={Icons.bell_icon}
            onPressRight={() => onPressBtn('notification')}
            tintColorRight={Config.Colors.defaultColor}
            rightImageTopText={notificationCount ? String(notificationCount) : ''}
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
              onRefresh={handleHomeData}
              showsVerticalScrollIndicator={false}
              data={[0]}
              contentContainerStyle={{ paddingBottom: widthToDp(45) }}
              renderItem={() => {
                return (
                  <View style={{ gap: 10, backgroundColor: Config.Colors.bodyBg }}>
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
                                {adminHomeData?.countData?.totalTodayPresentUser}
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
                          <View style={{ alignItems: 'flex-start' }}>
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
                            data={adminData?.data?.appHomeData?.result?.bannerData ?? []}
                            renderItem={renderBanner}
                            keyExtractor={(_, index) => String(index)}
                            horizontal
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
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <SvgXml xml={NotFound_result} />
                          </View>
                        )}
                      </View>
 
                      <View
                        style={{
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
                      renderItem={renderHomeFooterItem}
                      keyExtractor={(_, index) => String(index)}
                      ItemSeparatorComponent={() => (
                        <View style={{ paddingTop: 5 }} />
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
 
        {broadcastModal ? (
          <CustomModalAny
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
                  <Image source={Icons.close} style={{ width: 20, height: 20 }} />
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
                <CustomInputBoxAny
                  commonWidth={widthToDp(80)}
                  commonHeight={widthToDp(15)}
                  onChangeText={(text: string) => onChangeBroadcast('title', text)}
                  inputValue={broadCastInput?.title}
                  placeholder={t(Config.adminHomeScreenText?.enter_title)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="given-name"
                  errorMessage={errorMessage?.title ?? ''}
                  borderColor={
                    errorMessage?.title
                      ? Config.Colors.errorFieldBorder
                      : Config.Colors.borderColor
                  }
                />
                <CustomInputBoxAny
                  commonWidth={widthToDp(80)}
                  commonHeight={widthToDp(30)}
                  onChangeText={(text: string) => onChangeBroadcast('remark', text)}
                  inputValue={broadCastInput?.remark}
                  placeholder={t(Config.adminHomeScreenText?.enter_message)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="given-name"
                  numberOfLines={10}
                  errorMessage={errorMessage?.remark ?? ''}
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
                onPress={handleBrodcastMessage}
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
          </CustomModalAny>
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
  container: { flex: 1 },
  bodyContainer: { width: widthToDp(90) },
  attContainer: {
    backgroundColor: Config.Colors.defaultColor,
    borderRadius: 10,
    padding: 10,
  },
  body: {
    width: widthToDp(100),
    alignItems: 'center',
    marginTop: 10,
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
  messageBoxContainer: { alignSelf: 'flex-start' },
  messageBox: {
    fontSize: widthToDp(3.5),
    fontWeight: Config.WEIGHTS.light,
    fontFamily: Config.fontFamilys.Poppins_Medium,
    color: Config.Colors.black,
  },
  inputField: { marginTop: 5 },
});
 
export default React.memo(Home);