import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Alert, Text } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
// import PushNotification, { Importance } from 'react-native-push-notification';
 
type AlarmNotifData = {
  id: number;
  title: string;
  message: string;
  fire_date: Date;
  date: Date;
  repeatType: string;
  repeatTime: number;
};
 
type TimePickerProps = {
  setData: (data: AlarmNotifData) => void;
};
 
const TimePicker: React.FC<TimePickerProps> = props => {
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
    useState(false);
  const [id, setId] = useState(0);
 
  useEffect(() => {
    createChannels();
  }, []);
 
  const generateId = () => {
    const newId = id + 1;
    setId(newId);
    return newId;
  };
 
  const createChannels = () => {
    // PushNotification.createChannel({
    //   channelId: 'alarm-channel',
    //   channelName: 'Alarm Channel',
    // });
  };
 
  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };
  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };
 
  const handleDatePicker = (dateTime: Date) => {
    const currentTime = Date.now();
    if (dateTime.getTime() < currentTime) {
      Alert.alert('Please choose future time');
      hideDateTimePicker();
      return;
    }
 
    const alarmNotifData: AlarmNotifData = {
      id: generateId(),
      title: 'Alarm title',
      message: 'Alarm Message',
      fire_date: dateTime,
      date: dateTime,
      repeatType: '',
      repeatTime: 1,
    };
 
    props.setData(alarmNotifData);
    console.log('ID: ' + alarmNotifData.id);
 
    // PushNotification.localNotificationSchedule({
    //   channelId: 'alarm-channel',
    //   title: alarmNotifData.title,
    //   id: alarmNotifData.id,
    //   message: alarmNotifData.message,
    //   date: alarmNotifData.fire_date,
    //   soundName: 'my_sound.mp3',
    //   actions: ['Stop Alarm', 'Snooze'],
    //   importance: Importance.HIGH,
    //   playSound: true,
    //   allowWhileIdle: true,
    //   invokeApp: true,
    //   repeatType: alarmNotifData.repeatType,
    //   vibrate: true,
    //   vibration: 300,
    //   largeIcon: 'ic_launcher',
    //   repeatTime: alarmNotifData.repeatTime,
    // });
 
    console.log('alarmNotifData', alarmNotifData);
    hideDateTimePicker();
  };
 
  return (
    <>
      <Pressable
        style={styles.buttonStyle}
        onPress={() => {
          showDateTimePicker();
          console.log('ShowDateTime');
        }}
      >
        <Text style={styles.buttonText}>+ Add Alarm</Text>
      </Pressable>
      <DateTimePicker
        mode="datetime"
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicker}
        onCancel={hideDateTimePicker}
      />
    </>
  );
};
 
const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
  },
});
 
export default TimePicker;