import React, {
  useState,
  Fragment,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Calendar,
  CalendarUtils,
  DateData,
} from 'react-native-calendars';
import testIDs from '../helpers/TestIds';
import moment from 'moment';
import * as Config from '../helpers/Config';

/* ===================== CONSTANT ===================== */

const INITIAL_DATE = moment().format('YYYY-MM-DD');

/* ===================== COMPONENT ===================== */

const CalendarScreen: React.FC = () => {
  const [selected, setSelected] = useState<string>(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState<string>(INITIAL_DATE);

  const getDate = (count: number): string => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [getDate(-1)]: {
        dotColor: 'red',
        marked: true,
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: 'orange',
        selectedTextColor: 'red',
      },
    };
  }, [selected]);

  /* ===================== RENDERS ===================== */

  const renderCalendarWithSelectableDate = () => (
    <Fragment>
      <Text style={styles.text}>Calendar with selectable date</Text>
      <Calendar
        testID={testIDs.calendars.FIRST}
        enableSwipeMonths
        current={INITIAL_DATE}
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={marked}
      />
    </Fragment>
  );

  const renderCalendarWithWeekNumbers = () => (
    <Fragment>
      <Text style={styles.text}>Calendar with week numbers</Text>
      <Calendar style={styles.calendar} hideExtraDays showWeekNumbers />
    </Fragment>
  );

  const renderCalendarWithMinAndMaxDates = () => (
    <Fragment>
      <Text style={styles.text}>Calendar with min and max dates</Text>
      <Calendar
        style={styles.calendar}
        hideExtraDays
        current={INITIAL_DATE}
        minDate={getDate(-6)}
        maxDate={getDate(6)}
        disableAllTouchEventsForDisabledDays
      />
    </Fragment>
  );

  const renderCalendarWithCustomDay = () => (
    <Fragment>
      <Text style={styles.text}>Calendar with custom day component</Text>
      <Calendar
        style={[styles.calendar, styles.customCalendar]}
        dayComponent={({ date, state }:any) => (
          <View>
            <Text
              style={[
                styles.customDay,
                state === 'disabled'
                  ? styles.disabledText
                  : styles.defaultText,
              ]}
            >
              {date?.day}
            </Text>
          </View>
        )}
      />
    </Fragment>
  );

  /* ===================== CUSTOM HEADER ===================== */

  const customHeaderProps = useRef<any>(null);

  const setCustomHeaderNewMonth = (next = false) => {
    if (!customHeaderProps.current) return;

    const add = next ? 1 : -1;
    const month = new Date(customHeaderProps.current.month);
    const newMonth = new Date(month.setMonth(month.getMonth() + add));

    customHeaderProps.current.addMonth(add);
    setCurrentMonth(newMonth.toISOString().split('T')[0]);
  };

  const renderCalendarWithCustomHeader = () => {
    const CustomHeader = React.forwardRef<View, any>((props, ref) => {
      customHeaderProps.current = props;

      return (
        <View ref={ref} style={styles.customHeader}>
          <TouchableOpacity onPress={() => setCustomHeaderNewMonth(false)}>
            <Text style={{ color: Config.Colors.black }}>Previous</Text>
          </TouchableOpacity>

          <Text style={{ color: Config.Colors.black }}>Custom header!</Text>
          <Text style={{ color: Config.Colors.black }}>{currentMonth}</Text>

          <TouchableOpacity onPress={() => setCustomHeaderNewMonth(true)}>
            <Text style={{ color: Config.Colors.black }}>Next</Text>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <Fragment>
        <Text style={styles.text}>Calendar with custom header component</Text>
        <Calendar
          initialDate={INITIAL_DATE}
          testID={testIDs.calendars.LAST}
          style={[styles.calendar, styles.customCalendar]}
          customHeader={CustomHeader}
        />
      </Fragment>
    );
  };

  /* ===================== MAIN ===================== */

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      testID={testIDs.calendars.CONTAINER}
    >
      {renderCalendarWithSelectableDate()}
      {renderCalendarWithWeekNumbers()}
      {renderCalendarWithMinAndMaxDates()}
      {renderCalendarWithCustomDay()}
      {renderCalendarWithCustomHeader()}
    </ScrollView>
  );
};

export default CalendarScreen;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16,
    color: Config.Colors.black,
  },
  disabledText: {
    color: 'grey',
  },
  defaultText: {
    color: 'purple',
  },
  customCalendar: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  customDay: {
    textAlign: 'center',
  },
  customHeader: {
    backgroundColor: '#FCC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
});
