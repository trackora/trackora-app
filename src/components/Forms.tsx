import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import * as Constants from '../helpers/Constants';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService } from '../helpers/services';
import { isApiSuccess, validateNotEmpty } from '../helpers/Validation';
import {
  CustomButton,
  CustomInputBox,
  CustomLinearButton,
  CustomDropDownComponent,
} from './CustomElements';
import CustomModal from './CustomModal';
import { Calendar } from 'react-native-calendars';
import { formatToYMDHMS, toLocaleDateString } from '../helpers/utils';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { SvgXml } from 'react-native-svg';
import { NotFound_result, SvgCalender } from '../helpers/Svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Icons from '../helpers/Icons';

const currentData = new Date();
export const RequestLeaveForm = () => {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [borderColor, setBorderColor] = React.useState('');
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isOkClicked, setIsOkClicked] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(currentData);
  const [selectEndDate, setSelectEndDate] = React.useState(currentData);
  const [selectLeaveType, setSelectLeaveType] = React.useState(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
  const [leaveTypes, setLeaveTypes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [inputValues, setInputValues] = React.useState({
    subject: '',
    description: '',
  });

  // For selecting leave type: Full day,half day
  const handleLeaveTypeDaySelect = item => {
    setSelectedItem(item);
    setSelectLeaveType(item);
  };

  // For selecting leave type
  const leaveTypeSelect = () => {
    setIsOkClicked(selectedItem);
    setModalVisible(false);
    if (selectedItem === 'Half Day') {
      setShowEndDatePicker(false);
    }
  };

  const onRequestClose = () => {
    setModalVisible(false);
  };

  const getLeaveType = async () => {
    const apiData = await apiPostService(Constants.leave_type, {});
    if (isApiSuccess(apiData)) {
      const data = apiData?.data?.result?.data?.map(item => ({
        value: item.name,
        label: item.name,
      }));
      setLeaveTypes(data);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectEndDate(selectedDate);
    }
  };
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setSelectEndDate(selectedDate);
    }
  };

  const handleChange = text => {
    setInputValues(prv => ({ ...prv, ...text }));
    setErrorMessage(null);
    setBorderColor('');
  };
  const handleAddLeave = async () => {
    if (
      inputValues.subject == '' &&
      inputValues.description == '' &&
      selectLeaveType == null
    ) {
      setErrorMessage(prv => ({ ...prv, subject: 'Required' }));
      setErrorMessage(prv => ({ ...prv, description: 'Required' }));
      setErrorMessage(prv => ({ ...prv, leaveType: 'Required' }));
    } else if (inputValues.subject === '') {
      setErrorMessage({ subject: true });
    } else if (inputValues.description == '') {
      setErrorMessage({ description: true });
    } else if (selectLeaveType == null) {
      setErrorMessage(prv => ({ ...prv, leaveType: 'Required' }));
      setBorderColor('red');
    } else {
      setLoading(true);
      try {
        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = selectedDate.getTime();
        const endDate = selectEndDate.getTime();
        const totalDays =
          Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
        let bodyData = {
          start_date: formatToYMDHMS(selectedDate.toISOString()),
          sub_type: 'Sub Type',
          end_date: formatToYMDHMS(selectEndDate.toISOString()),
          type: selectLeaveType,
          subject: inputValues.subject,
          description: inputValues.description,
          total_days: totalDays,
        };
        let apiData = await apiPostService(Constants?.leave_add_api, bodyData);

        if (isApiSuccess(apiData)) {
          Toast.show({
            type: 'success',
            text1: `${apiData?.data?.status}`,
            text2: `${apiData?.data?.message} 👋`,
            swipeable: true,
          });
          setInputValues({
            subject: '',
            description: '',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to Submit leave request. Please try again.',
            swipeable: true,
          });
        }
      } catch (error) {
        // console.error('Error Submitting leave request:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An unexpected error occurred. Please try again.',
          swipeable: true,
        });
      } finally {
        setLoading(false);
        setSelectedDate(new Date());
        setSelectEndDate(new Date());
        setIsOkClicked('Select an option');
        setSelectLeaveType(null);
        setErrorMessage(null);
      }
    }
  };

  React.useEffect(() => {
    getLeaveType();
  }, []);
  return (
    <GestureHandlerRootView>
      {/* leave type field  */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {loading && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={Config.Colors.themeColor}
          />
        )}
        <View style={{ gap: widthToDp(4), marginTop: 10 }}>
          <View
            style={{
              marginTop: heightToDp(1),
              marginLeft: widthToDp(5),
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <Text
              style={{
                fontSize: widthToDp(4.5),
                color: Config.Colors.themeColor,
              }}
            >
              Select Type
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <CustomDropDownComponent
              commonWidth={widthToDp(88)}
              commonHeight={54}
              // errorMessage={errorMessage?.type ? errorMessage?.type : ''}
              borderColor={
                errorMessage?.leaveType
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.borderColor
              }
              data={leaveTypes || []}
              onChangeDropDown={text => handleLeaveTypeDaySelect(text)}
              backgroundColor={Config.Colors.defaultColor}
              initialValue={selectLeaveType}
            />
          </View>
          {/* start day field  */}
          <View
            style={{
              marginLeft: widthToDp(5),
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <Text
              style={{
                fontSize: widthToDp(4),
                color: Config.Colors.themeColor,
              }}
            >
              Start Date
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.dropDown}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{
                  color: Config.Colors.black,
                  fontSize: widthToDp(3.5),
                  paddingLeft: widthToDp(2),
                }}
              >
                {selectedDate.toDateString()}
              </Text>
              <TouchableOpacity
                style={styles.btnLeave}
                onPress={() => setShowDatePicker(true)}
              >
                {/* <Text style={{ color:Config.Colors.black,fontSize: widthToDp(3.5), paddingRight: widthToDp(2), color: Config.Colors.black }}>{selectedDate.toDateString()}</Text> */}
                <SvgCalender width={24} height={24} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* end date field */}
          {selectLeaveType !== 'Half Day' ? (
            <View
              style={{
                marginLeft: widthToDp(5),
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <Text
                style={{
                  color: Config.Colors.themeColor,
                  fontSize: widthToDp(4),
                }}
              >
                End Date
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={{ flexDirection: 'row', justifyContent: 'center' }}
          >
            {selectLeaveType !== 'Half Day' ? (
              <View style={styles.dropDown}>
                <Text
                  style={{
                    color: Config.Colors.black,
                    fontSize: widthToDp(3.5),
                    paddingLeft: widthToDp(2),
                  }}
                >
                  {selectEndDate.toDateString()}
                </Text>
                <TouchableOpacity
                  style={styles.btnLeave}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  {/* <Text style={{ fontSize: widthToDp(3.5), paddingRight: widthToDp(2), color: Config.Colors.black }}>{SvgCalender}</Text> */}
                  <SvgCalender width={24} height={24} />
                </TouchableOpacity>
              </View>
            ) : null}
          </TouchableOpacity>
          <View
            style={{
              marginLeft: widthToDp(5),
              marginBottom: heightToDp(2),
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
<Text
            style={{
              color: Config.Colors.themeColor,
              fontSize: widthToDp(4),
            }}
          >
            Subject
          </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              bottom: heightToDp(2.5),
            }}
          >
            <CustomInputBox
              commonWidth={widthToDp(90)}
              // placeholder={'Subject *'}
              style={styles.subjectField}
              keyboardType={'default'}
              autoComplete={'cc-csc'}
              // errorMessage={errorMessage?.subject ? errorMessage?.subject : ''}
              borderColor={
                errorMessage?.subject
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.themeColor
              }
              onChangeText={text => handleChange({ subject: text })}
              inputValue={inputValues.subject}
              commmonBorderRadius={1}
              commonBackgroundColor={Config.Colors.defaultColor}
              // CommonBorderWidth={0.5}
              // elevation={}
            />
          </View>
          <View
            style={{
              marginLeft: widthToDp(5),
              marginBottom: heightToDp(2),
              marginTop: widthToDp(-5),
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <Text
              style={{
                fontSize: widthToDp(4),
                color: Config.Colors.themeColor,
              }}
            >
              Description
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              bottom: heightToDp(2.5),
            }}
          >
            <CustomInputBox
              commonWidth={widthToDp(90)}
              commonHeight={widthToDp(20)}
              // placeholder={'Your Description *'}
              keyboardType={'default'}
              autoComplete={'cc-csc'}
              // errorMessage={errorMessage?.description ? errorMessage?.description : ''}
              borderColor={
                errorMessage?.description
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.grey
              }
              numberOfLines={5}
              onChangeText={text => handleChange({ description: text })}
              inputValue={inputValues.description}
              commmonBorderRadius={1}
              commonBackgroundColor={Config.Colors.defaultColor}
              // CommonBorderWidth={0.5}
            />
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              paddingRight: widthToDp(5),
              marginBottom: 10,
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <CustomLinearButton
                commonWidth={widthToDp(40)}
                text={'Submit'}
                disabled={!loading ? false : true}
                onPress={() => handleAddLeave()}
                color={Config.Colors.defaultColor}
                // Icons={Icons.edit_picture}
              />
            </View>
          </View>
        </View>
        <View>
          <CustomModal
            transparent={true}
            modalVisible={isModalVisible}
            onRequestClose={onRequestClose}
            alignItems="center"
            justifyContent="center"
          >
            <View style={styles.centerView}>
              <View style={styles.ModalView}>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: Config.Colors.themeColor,
                    padding: widthToDp(3),
                  }}
                >
                  <Text
                    style={{
                      color: Config.Colors.black,
                      fontSize: widthToDp(5),
                    }}
                  >
                    Select Type *
                  </Text>
                </View>
                <FlatList
                  contentContainerStyle={styles.flatListContainer}
                  data={Config.LeaveTypes}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      onPress={() => handleLeaveTypeDaySelect(item)}
                      activeOpacity={1}
                    >
                      <View style={styles.radioButton}>
                        {selectedItem === item && (
                          <View style={styles.selectedRadio} />
                        )}
                      </View>
                      <Text
                        style={{
                          color: Config.Colors.black,
                          fontSize: widthToDp(4),
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => onRequestClose()}
                  >
                    <Text
                      style={{
                        color: Config.Colors.black,
                        fontSize: widthToDp(5),
                        left: selectedItem ? null : widthToDp(1),
                      }}
                    >
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={leaveTypeSelect}>
                    {selectedItem && (
                      <Text
                        style={{
                          color: Config.Colors.black,
                          fontSize: widthToDp(5),
                          paddingRight: widthToDp(2),
                        }}
                      >
                        OK
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CustomModal>

          {/* calender Modal */}
          {showDatePicker && (
            <DateTimePicker
              // style={{width:widthToDp(100)}}
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date()}
              negativeButton={{
                label: 'cancel',
                textColor: Config.Colors.errorText,
              }}
              positiveButton={{
                label: 'confirm',
                textColor: Config.Colors.successText,
              }}
              style={{ backgroundColor: '#fff' }}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={selectEndDate}
              minimumDate={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleEndDateChange}
              negativeButton={{
                label: 'cancel',
                textColor: Config.Colors.errorText,
              }}
              positiveButton={{
                label: 'confirm',
                textColor: Config.Colors.successText,
              }}
              style={{ backgroundColor: '#fff' }}
            />
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  history_text_1: {
    fontSize: widthToDp(2.5),
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    fontWeight: Config.WEIGHTS.extraBold,
    color: Config.Colors.themeColor,
  },
  history_text_2: {
    fontSize: widthToDp(2.3),
    fontFamily: Config.fontFamilys.Poppins_Light,
    fontWeight: Config.WEIGHTS.semibold,
  },
  history_text_container: {
    borderRightColor: Config.Colors.themeColor,
    borderRightWidth: 1,
    paddingRight: 10,
  },
  history_header_text: {
    borderRadius: 10,
    borderRightColor: Config.Colors.themeColor,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  dropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 3,
    height: heightToDp(6),
    width: '90%',
    // borderWidth: ,
    borderColor: Config.Colors.defaultColor,
    backgroundColor: Config.Colors.defaultColor,
    // elevation:1
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: widthToDp(3.5),
    borderTopWidth: 0.5,
    borderTopColor: Config.Colors.themeColor,
    padding: widthToDp(3),
  },
  btnLeave: {
    backgroundColor: Config.Colors.inputField_1,
    padding: widthToDp(1.5),
    marginRight: widthToDp(3),
    borderRadius: 5,
  },

  input: {
    height: 100,
    borderWidth: 0.5,
    borderColor: Config.Colors.themeColor,
    width: widthToDp(90),
    marginLeft: heightToDp(2.5),
    paddingLeft: widthToDp(3),
    borderRadius: 5,
  },
  ModalView: {
    backgroundColor: '#fff',
    height: heightToDp(33),
    width: widthToDp(66),
    borderRadius: 5,
    elevation: 30,
  },
  calenderView: {
    backgroundColor: '#fff',
    height: heightToDp(40),
    width: widthToDp(85),
    elevation: 30,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: widthToDp(3),
    paddingLeft: widthToDp(3),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: widthToDp(5),
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Config.Colors.themeColor,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Config.Colors.themeColor,
    marginRight: widthToDp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainerIner: {
    marginBottom: widthToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: heightToDp(70),
  },
  loader: {
    position: 'absolute',
    width: widthToDp(100),
    height: '50%',
    zIndex: 2,
  },
  subjectField: {
    borderWidth: 0.5,
    alignItems: 'center',
  },
});
