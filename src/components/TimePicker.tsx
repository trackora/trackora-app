import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Pressable,
    Alert,
    Text,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PushNotification, {Importance} from 'react-native-push-notification';
import { v4 as uuidv4 } from 'uuid';
const TimePicker = (props) => {
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

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
        PushNotification.createChannel({
            channelId: "alarm-channel",
            channelName: "Alarm Channel",
        });
    };

    const showDateTimePicker = () => {
        setIsDateTimePickerVisible(true);
    }
    const hideDateTimePicker = () => {
        setIsDateTimePickerVisible(false);
    }


    const handleDatePicker = (dateTime) => {
        var currentTime = Date.now();
        if (dateTime.getTime() < currentTime) {
            Alert.alert("Please choose future time");
            hideDateTimePicker();
            return;
        }
        const fireDate = dateTime;


        const alarmNotifData = {
            id: generateId(),
            title: "Alarm title",
            message: "Alarm Message",
            fire_date: fireDate,
            date: dateTime,
            repeatType:'',
            repeatTime: 1,
            //date: fireDate,
        }
    
        props.setData(alarmNotifData);
        console.log('ID: ' + alarmNotifData.id)
        
        PushNotification.localNotificationSchedule({
            channelId: "alarm-channel",
            title: alarmNotifData.title,
            id: alarmNotifData.id,
            message: alarmNotifData.message,
            date: alarmNotifData.fire_date,
            soundName: 'my_sound.mp3',
            actions: ["Stop Alarm", "Snooze"],
            importance: Importance.HIGH,
            playSound: true,
            allowWhileIdle: true,
            invokeApp: true,
            repeatType:alarmNotifData.repeatType,
            vibrate: true,
            vibration:300,
            largeIcon: "ic_launcher",
            repeatTime: alarmNotifData.repeatTime,
            
        });
        console.log("alarmNotifData",alarmNotifData)
        //ReactNativeAN.scheduleAlarm(alarmNotifData);
        hideDateTimePicker();
    }
    return (
        <>
            <Pressable
                style={styles.buttonStyle}
                onPress={() => {
                    showDateTimePicker(),
                        //handleNotification(),
                        console.log("ShowDateTime");
                }}>
                <Text style={styles.buttonText}>+ Add Alarm</Text>
            </Pressable>
            <DateTimePicker
                mode='datetime'
                isVisible={isDateTimePickerVisible}
                onConfirm={handleDatePicker}
                onCancel={hideDateTimePicker}
            />
        </>
    );
}


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
        //fontWeight:'bold',
        color: 'white',
    }
});


export default TimePicker;