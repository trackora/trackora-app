
import React from 'react'
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import * as Svgs from '../../helpers/Svg';
import { SvgCalender } from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll } from '../../helpers/localStorage';
import { toLocaleDateString } from '../../helpers/utils';
import { apiPostService } from '../../helpers/services';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AltertBox from '../../components/AltertBox';
import BackgroundService from 'react-native-background-actions';

import { View, Text, Image, StyleSheet, SafeAreaView, Pressable } from 'react-native'
import PushNotification from 'react-native-push-notification'
import ListAlarms from '../../components/ListAlarms'
import TimePicker from '../../components/TimePicker'
import * as RootNavigation from '../../navigation/RootNavigation'
import { useTranslation } from 'react-i18next';

const Alarm = ({ navigation, route }) => {
    const {t} = useTranslation();
    console.log("navigation",navigation)
    const [data, setData] = React.useState([]);
    const goBackScreen = () => {
        RootNavigation?.navigationRef?.current.goBack();
    }
    React.useEffect(() => {
        console.log("first")
        createChannels();
    }, []);

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "test-channel",
            channelName: "Test Channel",
            channelDescription: "A channel to categorise your notifications",
        });
    };



    const handleNotification = () => {
        console.log("Alarm Snoozed----1")
        PushNotification.cancelAllLocalNotifications();


        PushNotification.localNotificationSchedule({
            channelId: "test-channel",
            title: "Alarm Ringing",

            message: "Message Here",
            actions: ["Accept", "Reject"],
            date: new Date(Date.now() + 100),
            allowWhileIdle: true,
            invokeApp: false,

            //repeatTime: 2,
        });

        PushNotification.configure({
            onAction: function (notification) {
                if (notification.action === 'Accept') {
                    console.log('Alarm Snoozed');
                }
                else if (notification.action === 'Reject') {
                    console.log('Alarm Stoped');
                    //PushNotification.cancelAllLocalNotifications();
                }
                else {
                    console.log('Notification opened');
                }
            },
            actions: ["Accept", "Reject"],
        });
    }
    const handleData = (data) => {
        console.log("data", data)
        setData((prv) => [...prv, data])
    }
    return (
        <View style={styles.container}>
            <Header_2
                leftImage={Icons.arrow_back}
                commonWidth={widthToDp(12)}
                commonHeight={heightToDp(5)}
                leftText={route?.params.name}
                animated={true}
                onPressLeft={goBackScreen}
                tintColorRight={Config.Colors.defaultColor}
            />
            <View style={styles.body}>
                <View style={{ ...styles?.boxContainerIner, height: heightToDp(76) }}>
                    <Text style={styles.heading}>ALARM</Text>
                    <Pressable
                        style={styles.buttonStyle}
                        onPress={() => {
                            handleNotification(),
                                console.log("Schedule Notification")
                        }}>
                        <Image
                            source={Icons.about_us}
                            style={{ height: 60, width: 60 }}
                        />
                    </Pressable>

                    <SafeAreaView style={styles.listAlarms}>
                        <ListAlarms alarms={data} />
                    </SafeAreaView>
                    <View style={styles.timePicker}>
                        <TimePicker setData={(data)=>handleData(data)} />
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // width:widthToDp(90),
        // backgroundColor:'#000'
    },
    body: {
        marginTop: 10,
        width: '100%'
    },
    text: {
        fontFamily: Config.fontFamilys.Poppins_Bold,
        color: '#000'
    },
    box: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: widthToDp(90),
        margin: 10,
        padding: 10
    },
    boxContainer: {
        alignSelf: 'center',
        // bottom: 10
    },
    boxContainerIner: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    bottomImg: {
        backgroundColor: Config.Colors.bodyBg,
        width: widthToDp(10),
        height: heightToDp(5),
        alignItems: 'center',
        borderRadius: widthToDp(10),
        justifyContent: 'center',
        padding: widthToDp(2),

    },
    heading: {
        fontSize: 25,
        padding: 20,
        color: 'black'
    },
    timePicker: {
        paddingTop: "10%",
        width: "50%",
        bottom: 20,
    },
    listAlarms: {
        flex: 1,
        width: "100%",
    },

    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 25,
    },
})
export default Alarm