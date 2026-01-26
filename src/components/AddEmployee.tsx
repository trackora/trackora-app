import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import CustomModal from "../components/CustomModal";
import { heightToDp, widthToDp } from "../helpers/Responsive";
import * as Config from "../helpers/Config";
import * as Icons from "../helpers/Icons";
import { Header_2 } from "../components/Header";
import { useTranslation } from "react-i18next";
import {
  CustomDropDownComponent,
  CustomInput,
  CustomLinearButton,
} from "../components/CustomElements";
import CustomCheckBox from "../components/CustomCheckBox";

const CustomInputAny = CustomInput as React.ComponentType<any>;
const CustomDropDownAny = CustomDropDownComponent as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;

type EmpFormInputs = {
  role: string;
  name: string;
  employee_detail: string;
  ref_name: string;
  designation: string;
  mobile_no: string;
  branch: string;
  monday_working: boolean;
  tuesday_working: boolean;
  wednesday_working: boolean;
  thursday_working: boolean;
  friday_working: boolean;
  saturday_working: boolean;
  sunday_working: boolean;
  working_time_from: string;
  working_time_to: string;
  salary_payment_type: string;
  salary_amount: string;
  attendance_within: string;
  employee_category: string;
  date_of_joining: string;
  user_status: string;
  salary_wages: string;
  hourly_wages: string;
  working_hours: string;
  hours_worked: string;
  excess: string;
  less: string;
  actual_salary: string;
  to_be_paid_salary: string;
  diff_salary_amt: string;
  increment_period: string;
  loan_amount: string;
  unsecure_loan: string;
  secure_loan: string;
  emi_cycle: string;
  bonus_yearly: string;
};

type ErrorState = Record<string, string> | null;

type WeekDayItem = {
  name: string;
  key: keyof EmpFormInputs;
};

type AddEmployeeProps = {
  addEmpModal: boolean;
  setAddEmpModal: (open: boolean) => void;
  errorMessage: ErrorState;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorState>>;
  adminData: any;
  setDateTimePickerType?: (value: { display: string; mode: string }) => void;
  setIsDateTimePickerModal?: (open: boolean) => void;
  setWorkingTimeType?: (value: string) => void;
  usercategoryList: any[];
  onSubmitEmpForm: () => void;
};

const AddEmployee: React.FC<AddEmployeeProps> = ({
  addEmpModal,
  setAddEmpModal,
  errorMessage,
  setErrorMessage,
  adminData,
  setDateTimePickerType,
  setIsDateTimePickerModal,
  setWorkingTimeType,
  usercategoryList,
  onSubmitEmpForm,
}) => {
  const initialEmpFromValue: EmpFormInputs = {
    role: "",
    name: "",
    employee_detail: "",
    ref_name: "",
    designation: "",
    mobile_no: "",
    branch: "",
    monday_working: false,
    tuesday_working: false,
    wednesday_working: false,
    thursday_working: false,
    friday_working: false,
    saturday_working: false,
    sunday_working: false,
    working_time_from: "",
    working_time_to: "",
    salary_payment_type: "",
    salary_amount: "",
    attendance_within: "",
    employee_category: "",
    date_of_joining: "",
    user_status: "",
    salary_wages: "",
    hourly_wages: "",
    working_hours: "",
    hours_worked: "",
    excess: "",
    less: "",
    actual_salary: "",
    to_be_paid_salary: "",
    diff_salary_amt: "",
    increment_period: "",
    loan_amount: "",
    unsecure_loan: "",
    secure_loan: "",
    emi_cycle: "",
    bonus_yearly: "",
  };

  const [empformInputs, setEmpformInputs] = React.useState(initialEmpFromValue);
  const { t } = useTranslation();

  const handleEmpChange = React.useCallback(
    (name: keyof EmpFormInputs, text: any) => {
      setEmpformInputs((prv) => ({ ...prv, [name]: text }));
      setErrorMessage(null);
    },
    [setErrorMessage],
  );

  const renderWeekDays = ({ item }: { item: WeekDayItem }) => {
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
          index={item.key}
          handleOptionPress={(value: any, newValue: any) =>
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
        }}
        alignItems="center"
        justifyContent="center"
        disableOnPress={false}
        animationType="slide"
      >
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
                  alignItems: "center",
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
                <View
                  style={{
                    width: widthToDp(90),
                    marginTop: 10,
                    backgroundColor: Config.Colors.bodyBg,
                    borderRadius: 10,
                    alignItems: "center",
                    paddingBottom: 60,
                    paddingTop: 10,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "column",
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
                        <CustomInputAny
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="default"
                          bgColor={Config.Colors.inputField}
                          autoComplete="name"
                          autoCapitalize="none"
                          onChangeText={(text: string) =>
                            handleEmpChange("name", text)
                          }
                          value={empformInputs?.name}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          leftImage={Icons.user_icon}
                          errorMessage={errorMessage?.name ?? ""}
                          borderColor={
                            errorMessage?.name
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
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
                        <CustomInputAny
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="default"
                          bgColor={Config.Colors.inputField}
                          autoComplete="off"
                          autoCapitalize="none"
                          onChangeText={(text: string) =>
                            handleEmpChange("employee_detail", text)
                          }
                          value={empformInputs?.employee_detail}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={errorMessage?.employee_detail ?? ""}
                          borderColor={
                            errorMessage?.employee_detail
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
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
                        <CustomInputAny
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="number-pad"
                          autoCapitalize="none"
                          autoComplete="cc-number"
                          maxLength={10}
                          bgColor={Config.Colors.inputField}
                          leftImage={Icons.telephone_icon}
                          countryCodeStatus={true}
                          onChangeText={(text: string) =>
                            handleEmpChange("mobile_no", text)
                          }
                          value={empformInputs?.mobile_no}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={errorMessage?.mobile_no ?? ""}
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
                        <CustomInputAny
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="default"
                          autoCapitalize="none"
                          autoComplete="off"
                          maxLength={10}
                          bgColor={Config.Colors.inputField}
                          countryCodeStatus={true}
                          onChangeText={(text: string) =>
                            handleEmpChange("ref_name", text)
                          }
                          value={empformInputs?.ref_name}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={errorMessage?.ref_name ?? ""}
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
                        <CustomDropDownAny
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          borderColor={
                            errorMessage?.employee_category
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={usercategoryList}
                          onChangeDropDown={(text: any) =>
                            handleEmpChange("employee_category", text)
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
                        <CustomInputAny
                          backgroundColor={Config.Colors.defaultColor}
                          keyboardType="default"
                          autoCapitalize="none"
                          autoComplete="name"
                          bgColor={Config.Colors.inputField}
                          onChangeText={(text: string) =>
                            handleEmpChange("designation", text)
                          }
                          value={empformInputs?.designation}
                          leftImage={Icons.job_icon}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={errorMessage?.designation ?? ""}
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
                        <CustomDropDownAny
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          errorMessage={errorMessage?.role ?? ""}
                          borderColor={
                            errorMessage?.role
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={adminData?.data?.usersRole?.dropDownData}
                          onChangeDropDown={(text: any) =>
                            handleEmpChange("role", text)
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
                        <CustomDropDownAny
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          errorMessage={errorMessage?.branch ?? ""}
                          borderColor={
                            errorMessage?.branch
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={adminData?.data?.branchesData?.dropDownData}
                          onChangeDropDown={(text: any) =>
                            handleEmpChange("branch", text)
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
                        <CustomDropDownAny
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          errorMessage={errorMessage?.attendance_within ?? ""}
                          borderColor={
                            errorMessage?.attendance_within
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.borderColor
                          }
                          data={[
                            {
                              label: t(Config.adminHomeScreenText?.branch),
                              value: "branch",
                              id: 1,
                            },
                            {
                              label: t(Config.adminHomeScreenText?.anywhere),
                              value: "anywhere",
                              id: 2,
                            },
                          ]}
                          onChangeDropDown={(text: any) =>
                            handleEmpChange("attendance_within", text)
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
                              key: "monday_working",
                            },
                            {
                              name: t(Config.adminHomeScreenText?.tue),
                              key: "tuesday_working",
                            },
                            {
                              name: t(Config.adminHomeScreenText?.wed),
                              key: "wednesday_working",
                            },
                            {
                              name: t(Config.adminHomeScreenText?.thu),
                              key: "thursday_working",
                            },
                            {
                              name: t(Config.adminHomeScreenText?.fri),
                              key: "friday_working",
                            },
                            {
                              name: t(Config.adminHomeScreenText?.sat),
                              key: "saturday_working",
                            },
                            {
                              name: t(Config.adminHomeScreenText?.sun),
                              key: "sunday_working",
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
                          setIsDateTimePickerModal?.(true);
                          setWorkingTimeType?.("date_of_joining");
                          setDateTimePickerType?.({
                            display: "calendar",
                            mode: "date",
                          });
                        }}
                      >
                        <CustomInputAny
                          backgroundColor={Config.Colors.defaultColor}
                          editable={false}
                          keyboardType="default"
                          autoCapitalize="none"
                          autoComplete="given-name"
                          bgColor={Config.Colors.inputField}
                          countryCodeStatus={true}
                          onChangeText={(text: string) =>
                            handleEmpChange("date_of_joining", text)
                          }
                          value={empformInputs?.date_of_joining}
                          commonWidth={widthToDp(90)}
                          commonHeight={widthToDp(15)}
                          textAlignVertical="center"
                          errorMessage={errorMessage?.date_of_joining ?? ""}
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
                        flexDirection: "row",
                        gap: widthToDp(3),
                        alignItems: "center",
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
                            setIsDateTimePickerModal?.(true);
                            setWorkingTimeType?.("working_time_from");
                            setDateTimePickerType?.({
                              display: "clock",
                              mode: "time",
                            });
                          }}
                        >
                          <CustomInputAny
                            backgroundColor={Config.Colors.defaultColor}
                            editable={false}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoComplete="given-name"
                            bgColor={Config.Colors.inputField}
                            countryCodeStatus={true}
                            onChangeText={(text: string) =>
                              handleEmpChange("working_time_from", text)
                            }
                            value={empformInputs?.working_time_from}
                            commonWidth={widthToDp(43)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            errorMessage={errorMessage?.working_time_from ?? ""}
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
                            setIsDateTimePickerModal?.(true);
                            setWorkingTimeType?.("working_time_to");
                            setDateTimePickerType?.({
                              display: "clock",
                              mode: "time",
                            });
                          }}
                        >
                          <CustomInputAny
                            backgroundColor={Config.Colors.defaultColor}
                            editable={false}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoComplete="given-name"
                            bgColor={Config.Colors.inputField}
                            countryCodeStatus={true}
                            onChangeText={(text: string) =>
                              handleEmpChange("working_time_to", text)
                            }
                            value={empformInputs?.working_time_to}
                            commonWidth={widthToDp(43)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            errorMessage={errorMessage?.working_time_to ?? ""}
                            borderColor={
                              errorMessage?.working_time_to
                                ? Config.Colors.errorFieldBorder
                                : Config.Colors.borderColor
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <CustomLinearButtonAny
                        commonWidth={widthToDp(40)}
                        text={t(Config.otherText?.submit)}
                        onPress={onSubmitEmpForm}
                        color={Config.Colors.defaultColor}
                        Icons={null}
                        tintColor={Config.Colors.defaultColor}
                        IconsRigth={null}
                        padding={0}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  messageBoxContainer: {
    alignSelf: "flex-start",
  },
  messageBox: {
    fontSize: widthToDp(3.5),
    fontWeight: Config.WEIGHTS.light,
    fontFamily: Config.fontFamilys.Poppins_Medium,
    color: Config.Colors.black,
  },
  inputField: {
    marginTop: 5,
  },
});

export default AddEmployee;
