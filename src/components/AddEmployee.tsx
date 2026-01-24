import React from 'react';
import CustomModal from '../components/CustomModal';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';
import { Header_2 } from '../components/Header';
import { useTranslation } from 'react-i18next';
import {
  CustomDropDownComponent,
  CustomInput,
  CustomLinearButton,
} from '../components/CustomElements';
import CustomCheckBox from '../components/CustomCheckBox';

const AddEmployee = ({
  addEmpModal,
  setAddEmpModal,
  errorMessage,
  setErrorMessage,
  adminData,
  setDateTimePickerType,
  usercategoryList,
  onSubmitEmpForm,
}) => {
  const initialEmpFromValue = {
    role: '',
    name: '',
    designation: '',
    mobile_no: '',
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
  };
  const [empformInputs, setEmpformInputs] = React.useState(initialEmpFromValue);
  const { t } = useTranslation();
  const handleEmpChange = React.useCallback((name, text) => {
    setEmpformInputs(prv => ({ ...prv, [name]: text }));
    setErrorMessage(null);
  }, []);
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
  return (
    <>
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
        <FlatList
          removeClippedSubviews={true}
          data={[0]}
          style={{
            borderRadius: widthToDp(2),
            width: widthToDp(100),
            height: heightToDp(100),
            backgroundColor: Config.Colors.bodyBg,
          }}
          renderItem={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  borderRadius: widthToDp(2),
                  paddingBottom: widthToDp(10),
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
                  {/* {loader ?
                      <View style={{ width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', height: "100%", zIndex: 9999, }}>
                        <ActivityIndicator size={35} color={Config.Colors.themeColor} />
                      </View>
                      : null} */}
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
                          {t(Config.adminHomeScreenText?.add_emp)} *
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
                          {t(Config.adminHomeScreenText?.ref_name)} *
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
                          {t(Config.adminHomeScreenText?.emp_cat)} *
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
                          initialValue={empformInputs.employee_category}
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.job_title)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomInput
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType={'default'}
                          autoCapitalize={'none'}
                          autoComplete={'name'}
                          bgColor={Config.Colors.inputField}
                          onChangeText={text =>
                            handleEmpChange('designation', text)
                          }
                          value={empformInputs?.designation}
                          leftImage={Icons.job_icon}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.designation
                              ? errorMessage?.designation
                              : ''
                          }
                          borderColor={
                            errorMessage?.designation
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.role)} *
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
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.branch)} *
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
                          initialValue={empformInputs.branch}
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
                        />
                      </View>
                    </View>

                    <View style={{ width: widthToDp(90) }}>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox, fontSize: 16 }}>
                          {t(Config.adminHomeScreenText?.time_slots)} *
                        </Text>
                      </View>
                      <View>
                        <FlatList
                          data={[
                            {
                              name: t(Config.adminHomeScreenText?.mon),
                              key: 'monday_working',
                            },
                            {
                              name: t(Config.adminHomeScreenText?.tue),
                              key: 'tuesday_working',
                            },
                            {
                              name: t(Config.adminHomeScreenText?.wed),
                              key: 'wednesday_working',
                            },
                            {
                              name: t(Config.adminHomeScreenText?.thu),
                              key: 'thursday_working',
                            },
                            {
                              name: t(Config.adminHomeScreenText?.fri),
                              key: 'friday_working',
                            },
                            {
                              name: t(Config.adminHomeScreenText?.sat),
                              key: 'saturday_working',
                            },
                            {
                              name: t(Config.adminHomeScreenText?.sun),
                              key: 'sunday_working',
                            },
                          ]}
                          renderItem={renderWeekDays}
                          keyExtractor={(item, index) => String(index)}
                          showsVerticalScrollIndicator={false}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                    </View>
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
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: widthToDp(3),
                        alignItems: 'center',
                      }}
                    >
                      <View>
                        <View style={styles.messageBoxContainer}>
                          <Text style={{ ...styles.messageBox }}>
                            {t(Config.adminHomeScreenText?.from)} *
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.inputField}
                          onPress={() => {
                            setIsDateTimePickerModal(true);
                            setWorkingTimeType('working_time_from');
                            setDateTimePickerType({
                              display: 'clock',
                              mode: 'time',
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
                              handleEmpChange('working_time_from', text)
                            }
                            value={empformInputs?.working_time_from}
                            commonWidth={widthToDp(43)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            errorMessage={
                              errorMessage?.working_time_from
                                ? errorMessage?.working_time_from
                                : ''
                            }
                            borderColor={
                              errorMessage?.working_time_from
                                ? Config.Colors.errorFieldBorder
                                : Config.Colors.borderColor
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <View>
                        <View style={styles.messageBoxContainer}>
                          <Text style={{ ...styles.messageBox }}>
                            {t(Config.adminHomeScreenText?.to)} *
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.inputField}
                          onPress={() => {
                            setIsDateTimePickerModal(true);
                            setWorkingTimeType('working_time_to');
                            setDateTimePickerType({
                              display: 'clock',
                              mode: 'time',
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
                              handleEmpChange('working_time_to', text)
                            }
                            value={empformInputs?.working_time_to}
                            commonWidth={widthToDp(43)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            errorMessage={
                              errorMessage?.working_time_to
                                ? errorMessage?.working_time_to
                                : ''
                            }
                            borderColor={
                              errorMessage?.working_time_to
                                ? Config.Colors.errorFieldBorder
                                : Config.Colors.borderColor
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.payment_type)} *
                        </Text>
                      </View>
                      <View style={styles.inputField}>
                        <CustomDropDownComponent
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          // errorMessage={errorMessage?.salary_payment_type ? errorMessage?.salary_payment_type : ''}
                          borderColor={
                            errorMessage?.salary_payment_type
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={[
                            {
                              label: t(Config.adminHomeScreenText?.monthly),
                              value: 'Monthly',
                            },
                            {
                              label: t(Config.adminHomeScreenText?.daily),
                              value: 'Daily',
                            },
                            {
                              label: t(Config.adminHomeScreenText?.hourly),
                              value: 'Houry',
                            },
                          ]}
                          onChangeDropDown={text =>
                            handleEmpChange('salary_payment_type', text)
                          }
                          backgroundColor={Config.Colors.defaultColor}
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.salary_amount)} *
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
                            handleEmpChange('salary_amount', text)
                          }
                          value={empformInputs?.salary_amount}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.salary_amount
                              ? errorMessage?.salary_amount
                              : ''
                          }
                          borderColor={
                            errorMessage?.salary_amount
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
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
                          {t(Config.adminHomeScreenText?.hourly_wage)}
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
                            handleEmpChange('hourly_wages', text)
                          }
                          value={empformInputs?.hourly_wages}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.hourly_wages
                              ? errorMessage?.hourly_wages
                              : ''
                          }
                          borderColor={
                            errorMessage?.hourly_wages
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

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.hours_worked)}
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
                            handleEmpChange('hours_worked', text)
                          }
                          value={empformInputs?.hours_worked}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.hours_worked
                              ? errorMessage?.hours_worked
                              : ''
                          }
                          borderColor={
                            errorMessage?.hours_worked
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.excess)}
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
                          onChangeText={text => handleEmpChange('excess', text)}
                          value={empformInputs?.excess}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.excess ? errorMessage?.excess : ''
                          }
                          borderColor={
                            errorMessage?.excess
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.less)}
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
                          onChangeText={text => handleEmpChange('less', text)}
                          value={empformInputs?.less}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.less ? errorMessage?.less : ''
                          }
                          borderColor={
                            errorMessage?.less
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.actual_sal)}
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
                            handleEmpChange('actual_salary', text)
                          }
                          value={empformInputs?.actual_salary}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.actual_salary
                              ? errorMessage?.actual_salary
                              : ''
                          }
                          borderColor={
                            errorMessage?.actual_salary
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.to_be_paid_sal)}
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
                            handleEmpChange('to_be_paid_salary', text)
                          }
                          value={empformInputs?.to_be_paid_salary}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.to_be_paid_salary
                              ? errorMessage?.to_be_paid_salary
                              : ''
                          }
                          borderColor={
                            errorMessage?.to_be_paid_salary
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.diff_sal_amt)}
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
                            handleEmpChange('diff_salary_amt', text)
                          }
                          value={empformInputs?.diff_salary_amt}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.diff_salary_amt
                              ? errorMessage?.diff_salary_amt
                              : ''
                          }
                          borderColor={
                            errorMessage?.diff_salary_amt
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
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
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.loan_amt)}
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
                            handleEmpChange('loan_amount', text)
                          }
                          value={empformInputs?.loan_amount}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.loan_amount
                              ? errorMessage?.loan_amount
                              : ''
                          }
                          borderColor={
                            errorMessage?.loan_amount
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.unsecure_loan)}
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
                            handleEmpChange('unsecure_loan', text)
                          }
                          value={empformInputs?.unsecure_loan}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.unsecure_loan
                              ? errorMessage?.unsecure_loan
                              : ''
                          }
                          borderColor={
                            errorMessage?.unsecure_loan
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.secure_loan)}
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
                            handleEmpChange('secure_loan', text)
                          }
                          value={empformInputs?.secure_loan}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.secure_loan
                              ? errorMessage?.secure_loan
                              : ''
                          }
                          borderColor={
                            errorMessage?.secure_loan
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.emi_cycle)}
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
                            handleEmpChange('emi_cycle', text)
                          }
                          value={empformInputs?.emi_cycle}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.emi_cycle
                              ? errorMessage?.emi_cycle
                              : ''
                          }
                          borderColor={
                            errorMessage?.emi_cycle
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.adminHomeScreenText?.bonus_yearly)}
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
                            handleEmpChange('bonus_yearly', text)
                          }
                          value={empformInputs?.bonus_yearly}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={
                            errorMessage?.bonus_yearly
                              ? errorMessage?.bonus_yearly
                              : ''
                          }
                          borderColor={
                            errorMessage?.bonus_yearly
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                        />
                      </View>
                    </View>

                    <View>
                      <View style={styles.messageBoxContainer}>
                        <Text style={{ ...styles.messageBox }}>
                          {t(Config.report_text?.user_status)}*
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
                              label: t(Config.adminHomeScreenText?.rejected),
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
            );
          }}
        />
        {/* <ScrollView style={{
        borderRadius: widthToDp(2),
        width: widthToDp(100),
        height: heightToDp(100),
        backgroundColor: Config.Colors.bodyBg,
      }}>
       
      </ScrollView> */}
        {/* </KeyboardAvoidingView> */}
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default AddEmployee;
