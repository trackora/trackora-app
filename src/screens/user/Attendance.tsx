import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Button,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NotFound_result, SvgCalender } from '../../helpers/Svg';
import { toLocaleDateString } from '../../helpers/utils';
import { CalendarUtils } from 'react-native-calendars';
import moment from 'moment';
import * as Constants from '../../helpers/Constants';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import MonthPicker from 'react-native-month-year-picker';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../animated/LoadingSpinner';
import { isApiSuccess } from '../../helpers/Validation';

const today = new Date();
const INITIAL_DATE = moment().format('YYYY-MM-DD');

const Attendance = ({ navigation }) => {
  const [month, setMonth] = useState(new Date());
  const [showMonth, setShowmonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [filter, setFilter] = useState('');
  const showPicker = useCallback(value => setShowmonth(value), []);
  const { t } = useTranslation();
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);

  const [attendMonth] = useState(
    `${toLocaleDateString().year}-0${toLocaleDateString().month_number + 1}`,
  );
  const goBackScreen = () => navigation.goBack();

  // To view all the Previous days attendance
  const handleAttendanceList = async payload => {
    setLoader(true);
    let tempData = [];
    let bodyData = {
      filter: {},
    };
    let apiData = await apiPostService(Constants?.attendance_list, bodyData);
 if (isApiSuccess(apiData)) {
      setLoader(false);
      Object.keys(apiData?.data?.detail).map(key => {
        if (key == 'Present') {
          tempData.push({
            name: key,
            value: apiData?.data?.detail[key],
            backgroundColor: '#f5faf6',
            borderColor: '#05f545',
          });
        } else if (key == 'Absent') {
          tempData.push({
            name: key,
            value: apiData?.data?.detail[key],
            backgroundColor: '#f9f5f4',
            borderColor: '#da2f35',
          });
        } else if (key == 'Half day') {
          tempData.push({
            name: key,
            value: apiData?.data?.detail[key],
            backgroundColor: '#faf8f1',
            borderColor: '#f0d37d',
          });
        } else if (key == 'Paid Leave') {
          tempData.push({
            name: key,
            value: apiData?.data?.detail[key],
            backgroundColor: '#faf5fa',
            borderColor: '#d279d2',
          });
        }
      });
      apiData = {
        ...apiData.data.data,
        detail: tempData,
      };
      setAttendanceData(apiData);
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const handleDatePicker = (event, date) => {
    console.log('date', event, date);
    showPicker(false);
    setMonth(date);
    setSelectedMonth(date);
    setFilter('');
    handleAttendanceList({ date: date });
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setModalVisible(false);
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      const onPress = () => {
        if (filter === item?.name) {
          setFilter('');
          handleAttendanceList();
        } else {
          setFilter(item?.name);
          handleAttendanceList({ date: month, search: item?.name });
        }
      };
      return (
        <TouchableOpacity
          style={{
            borderLeftWidth: 2,
            borderColor: item?.borderColor,
            width: widthToDp(22),
            padding: widthToDp(2),
            backgroundColor:
              filter === item?.name && filter != ''
                ? Config.Colors.textColor.textColor_1
                : item?.backgroundColor,
          }}
          onPress={onPress}
        >
          <Text
            style={{
              fontFamily: Config.fontFamilys.Poppins_Bold,
              fontSize: widthToDp(3),
              color: Config.Colors.black,
            }}
          >
            {item?.name}
            {'\n'}
            {item?.value}
          </Text>
        </TouchableOpacity>
      );
    },
    [filter],
  );

  const viewAttRenderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.calendarContainer}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 10,
              gap: 10,
            }}
          >
            <View
              style={{
                width: widthToDp(12),
                height: heightToDp(5),
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Config.Colors.black,
                  fontWeight: Config.WEIGHTS.extraBold,
                  fontSize: 20,
                }}
              >
                {toLocaleDateString(item?.attend_date).day}
              </Text>
              <Text
                style={{
                  color: Config.Colors.black,
                  fontFamily: Config.fontFamilys.Poppins_Light,
                }}
              >
                {toLocaleDateString(item?.attend_date).day_name}
              </Text>
            </View>
            <View
              style={{
                width: widthToDp(20),
                height: heightToDp(5),
                backgroundColor: Config.Colors.defaultColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...styles.cellText, fontSize: widthToDp(2.5) }}>
                {t(Config.manage_attendance?.punch_in)}
              </Text>
              {item?.start_time ? (
                <Text style={{ ...styles.cellText, fontSize: widthToDp(2.5) }}>
                  {item?.start_time}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                width: widthToDp(20),
                height: heightToDp(5),
                backgroundColor: Config.Colors.defaultColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...styles.cellText, fontSize: widthToDp(2.5) }}>
                {t(Config.manage_attendance?.punch_out)}
              </Text>
              {item?.stop_time ? (
                <Text style={{ ...styles.cellText, fontSize: widthToDp(2.5) }}>
                  {item?.stop_time}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                width: widthToDp(28),
                height: heightToDp(5),
                backgroundColor: Config.Colors.defaultColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
                borderColor: Config.Colors.themeColor,
                borderWidth: 1,
              }}
            >
              {/* <Text style={[styles.cellText, { color: Config.Colors.successText }]}>Full Day</Text> */}
              <Text
                style={{ ...styles.cellText, color: Config.Colors.successText }}
              >
                {item?.attendance_type}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const normalizeAttendanceData = React.useCallback(rawData => {
    if (!rawData) return { list: [], detail: [] };

    // Extract detail if present
    const detail = rawData.detail || [];

    // Extract all numeric keys as attendance list
    const list = Object.keys(rawData)
      .filter(key => !isNaN(Number(key))) // only numeric keys
      .map(key => rawData[key]);

    return { list, detail };
  },[attendanceData]);

  const normalizedData = normalizeAttendanceData(attendanceData);

  useFocusEffect(
    useCallback(() => {
      setLoader(true);
      handleAttendanceList({ date: attendMonth });
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={Config?.LeaveAttendanceArray[0]?.title}
        animated={true}
        svg={true}
        rightImage={
          loader ? (
            <LoadingSpinner
              commonWidth={widthToDp(15)}
              commonHeigth={widthToDp(7)}
              isLoading={loader}
            />
          ) : undefined
        }
        onPressLeft={goBackScreen}
        onPressRight={undefined}
      />
      <View style={styles.body}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: widthToDp(2),
            marginBottom: widthToDp(3),
          }}
        >
          <TouchableOpacity onPress={() => setShowmonth(true)}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SvgCalender
                source={Icons.calendar_icon}
                style={{
                  width: widthToDp(6),
                  height: heightToDp(2.5),
                  tintColor: Config.Colors.themeColor,
                }}
              />
              <Text
                style={{ fontSize: widthToDp(3.5), color: Config.Colors.black }}
              >
                {toLocaleDateString(selectedMonth).year}{' '}
                {toLocaleDateString(selectedMonth).month_name}
              </Text>
            </View>
          </TouchableOpacity>
          {showMonth ? (
            <MonthPicker
              onChange={handleDatePicker}
              value={month}
              // minimumDate={new Date()}
              maximumDate={new Date()}
              locale="short"
            />
          ) : null}
        </View>

        {normalizedData.detail.length > 0 ? (
          <View style={styles.attendance_details}>
            <FlatList
              data={normalizedData?.detail}
              renderItem={renderItem}
              extraData={normalizedData?.data?.attendanceV2List?.detail}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}
        {normalizedData.list.length > 0? (
          <>
            <View style={{ height: '79%' }}>
              <FlatList
                data={normalizedData.list}
                refreshing={loader}
                onRefresh={() => handleAttendanceList({ date: attendMonth })}
                renderItem={viewAttRenderItem}
                keyExtractor={(item, index) => String(index)}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
              />
            </View>
          </>
        ) : loader ? (
          <View style={{ height: '90%', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Config.Colors.themeColor} />
          </View>
        ) : (
          <View style={{ height: '90%', justifyContent: 'center' }}>
            <SvgXml xml={NotFound_result} />
          </View>
        )}
      </View>
      {isModalVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          dateFormat="dayofweek day month"
          themeVariant="light"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
          negativeButton={{
            label: t(Config.branchesText?.cancel),
            textColor: Config.Colors.errorText,
          }}
          positiveButton={{
            label: t(Config.manage_attendance?.confirm),
            textColor: Config.Colors.themeColor,
          }}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  body: {
    margin: 15,
    width: widthToDp(90),
  },
  attendance_details: {
    // backgroundColor:'#000',
    height: heightToDp(7),
    marginBottom: heightToDp(2),
    flexDirection: 'row',
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //   backgroundColor:'#000',
  },
  button: {
    height: heightToDp(6),
    width: widthToDp(42),
    borderColor: Config.Colors.themeColor,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  calendarContainer: {
    borderTopWidth: 0.3,
    // borderBottomWidth: .3,
    gap: 15,
    borderColor: Config.Colors.lineColor,
  },
  cell: {
    width: widthToDp(10),
    height: heightToDp(5),
  },
  cellText: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: Config.Colors.black,
  },
});
export default memo(Attendance);
