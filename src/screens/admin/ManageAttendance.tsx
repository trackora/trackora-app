import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Linking, Platform, ActivityIndicator, ScrollView } from 'react-native'
import React, { memo, useState } from 'react'
import { heightToDp, widthToDp } from '../../helpers/Responsive'
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { Header_2 } from '../../components/Header';
import { CustomDropDownComponent, CustomInput, CustomInputBox } from '../../components/CustomElements';
import { FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { toLocaleDateString, toLocaleDateTime } from '../../helpers/utils';
import { NotFound_result, SvgCalender } from '../../helpers/Svg';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { attendanceV2List } from '../../redux/slices/admin.slice';
import { apiPostService } from '../../helpers/services';
import { SvgXml } from 'react-native-svg';
import AltertBox from '../../components/AltertBox';
import CustomModal from '../../components/CustomModal';
import CustomMap from '../../components/CustomMap';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../animated/LoadingSpinner';

// import { TouchableOpacity } from 'react-native-gesture-handler';
const today = new Date()
const ManageAttendance = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const attendanceData = useAppSelector(state => state.admin);
    const [liveLocation, setLiveLocation] = useState(null);
    const [mapModal, setMapModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false)
    const [isAlertModal, setIsAlertModal] = useState(false)
    const [alertdata, setAlertdata] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [filter, setFilter] = useState('');
    const goBackScreen = () => navigation.goBack();
    const onChange = (text) => { getAttendanceList({ search: text, date: toLocaleDateString(selectedDate).customDate }) }

    const handleDatePicker = () => setModalVisible(true);
    const getAttendanceList = async (payload) => {
        setLoader(true)
        const bodyData = {
            attend_date: payload?.date ? payload?.date : "",
            attend_month: payload?.month ? payload?.month : "",
            filter: { search: payload?.search ? payload?.search : "", attendance_type: payload?.type ? payload?.type : filter, user_name: payload?.search ? payload?.search : "" },
        }
        let tempData = [];
        let apiData = await apiPostService(Constants?.attendance_v2_list_api, bodyData);
        console.log("apiData==>", apiData,bodyData,filter,payload)
        if (apiData?.data?.result) {
            Object.keys(apiData?.data?.result.detail).map((key) => {
                if (key == "Present") {
                    tempData.push({ name: key, value: apiData?.data?.result.detail[key], backgroundColor: '#f5faf6', borderColor: '#05f545' })
                } else if (key == "Absent") {
                    tempData.push({ name: key, value: apiData?.data?.result.detail[key], backgroundColor: '#f9f5f4', borderColor: '#da2f35', })
                } else if (key == 'Half day') {
                    tempData.push({ name: key, value: apiData?.data?.result.detail[key], backgroundColor: '#faf8f1', borderColor: '#f0d37d', })
                } else if (key == 'Paid Leave') {
                    tempData.push({ name: key, value: apiData?.data?.result.detail[key], backgroundColor: '#faf5fa', borderColor: '#d279d2', })
                }
            });
            apiData = { ...apiData.data.result, detail: tempData }
            setLoader(false)
            dispatch(attendanceV2List(apiData))
        } else {
            console.log("Not Found")
        }
    }
    const handleDateChange = (event, selectedDate) => {
        setModalVisible(false);
        setLoader(true);
        setFilter('')
        if (selectedDate) { setSelectedDate(selectedDate); getAttendanceList({ date: toLocaleDateString(selectedDate).customDate }); }
    }

    const decreaseDate = () => {
        let updatedDate = new Date(selectedDate);
        updatedDate?.setDate(selectedDate.getDate() - 1);
        setSelectedDate(updatedDate);
        getAttendanceList({ date: toLocaleDateString(updatedDate.setDate(selectedDate.getDate() - 1)).customDate })
    }

    const increaseDate = () => {
        const updatedDate = new Date(selectedDate)
        if (updatedDate.toDateString() === today.toDateString()) {
            return;
        } else {
            updatedDate.setDate(selectedDate.getDate() + 1)
            setSelectedDate(updatedDate)
            getAttendanceList({ date: toLocaleDateString(updatedDate.setDate(selectedDate.getDate() + 1)).customDate })
        }
    }
    const handleUserLocation = async (location) => {
        setLiveLocation({ accuracy: 20, altitude: 174.5, altitudeAccuracy: 1.258298635482788, heading: 0, latitude: Number(location?.start_lat), longitude: Number(location?.start_lng), speed: 0, user_name: location?.user_name });
        setMapModal(true)
    }

    const handleResetAttendance = async (id) => {
        const bodyData = {
            attendance_id: `${id}`
        }
        let apiData = await apiPostService(Constants?.attendance_restart_api, bodyData);
        // if (apiData.data) {

        // }
        setIsAlertModal(false)
    }
    const resetAttendance = async (id) => {
        setIsAlertModal(true)
        setAlertdata({
            statusText: t(Config.manage_attendance?.reset_attendance_message),
            time: ``,
            confirm: () => handleResetAttendance(id),
            cancel: () => setIsAlertModal(false),
        });


    }
    const renderItem = ({ item, index }) => {
        const onPress = () => {
            if (filter === item?.name) {
                console.log("filter---->",filter);
                setFilter('');
                getAttendanceList({ type: 'Present', date: toLocaleDateString(selectedDate).customDate });
            } else {
                console.log("filter->",filter);
                setFilter(item?.name);
                getAttendanceList({ type: item?.name, date: toLocaleDateString(selectedDate).customDate });
            }
        }
        return (
            <View style={{ marginRight: 2 }}>
                <TouchableOpacity style={{ borderLeftWidth: 2, borderColor: item?.borderColor, width: widthToDp(22), padding: widthToDp(2), backgroundColor: filter === item?.name && filter != '' ? Config.Colors.textColor.textColor_1 : item?.backgroundColor }}
                    onPress={onPress}
                >
                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_Bold, fontSize: widthToDp(3), color: Config.Colors.black }}>{item?.name}{'\n'}{item?.value}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    useFocusEffect(React.useCallback(() => { getAttendanceList({ date: `${toLocaleDateString().customDate}` }); }, []));
    const renderUserItem = React.useCallback(({ item, index }) => {
        const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${item.start_lat},${item.start_lng}`;
        const label = `${item.start_address}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        return (
            <View style={{
                backgroundColor: Config.Colors.defaultColor,
                // height: heightToDp(20),
                borderRadius: 10,
                elevation: 1,
                marginVertical: 8,

            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.firstWord}>{item?.user_name.replace(/\s/g, '').slice(0, 1).toUpperCase()}</Text>
                        <Text style={{ marginTop: widthToDp(5), marginLeft: widthToDp(2), color: Config.Colors.black, width: widthToDp(40) }}>{item?.user_name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 25, marginTop: widthToDp(5), marginRight: widthToDp(7) }}>
                        <TouchableOpacity onPress={async () => handleUserLocation(item)} >
                            <Image source={Icons.address_icon} style={[styles.image, { width: widthToDp(4), height: heightToDp(2) }]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => await Linking.openURL(`tel:${item?.user_mobile_no}`)}>
                            <Image source={Icons.telephone_icon} style={[styles.image, { width: widthToDp(4), height: heightToDp(2) }]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => await Linking.openURL(`whatsapp://send?phone=${item?.user_mobile_no}`)}>
                            <Image source={Icons.whatsapp_png} style={[styles.image, { width: widthToDp(4), height: heightToDp(2) }]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => resetAttendance(item?.id)}>
                            <Image source={Icons.restart_icon} style={[styles.image, { width: widthToDp(4), height: heightToDp(2) }]} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: widthToDp(5), paddingBottom: widthToDp(5) }}>
                    <View>
                        <TouchableOpacity>
                            <Text style={{ marginLeft: widthToDp(2), backgroundColor: Config.Colors.offWite, color: Config.Colors.black, width: widthToDp(25), textAlign: "center", borderRadius: 5 }}>{t(Config?.manage_attendance?.punch_in)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ marginLeft: widthToDp(2), backgroundColor: Config.Colors.offWite, color: Config.Colors.black, width: widthToDp(25), textAlign: "center", borderRadius: 5 }}>{item?.start_time}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Text style={{ marginLeft: widthToDp(2), backgroundColor: Config.Colors.offWite, color: Config.Colors.black, width: widthToDp(25), textAlign: "center", borderRadius: 5 }}>{t(Config.manage_attendance?.punch_out)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{ marginLeft: widthToDp(2), backgroundColor: Config.Colors.offWite, color: Config.Colors.black, width: widthToDp(25), textAlign: "center", borderRadius: 5 }}>{item?.stop_time}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        width: widthToDp(28),
                        height: heightToDp(5),
                        backgroundColor: Config.Colors.defaultColor,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                        borderColor: Config.Colors.themeColor,
                        borderWidth: 1
                    }}>
                        <Text style={{ ...styles.cellText, color: Config.Colors.successText }}>{item?.attendance_type}</Text>
                    </View>
                </View>
            </View>
        )

    }, [])
    return (
        <View style={styles.container}>
            <View style={{ zIndex: 9999 }}>
                <Header_2
                    leftImage={Icons?.arrow_back}
                    commonWidth={widthToDp(12)}
                    commonHeight={heightToDp(5)}
                    leftText={route?.params?.name}
                    animated={true}
                    svg={true}
                    onPressLeft={goBackScreen}
                    rightImage={loader ? <LoadingSpinner commonWidth={widthToDp(15)} commonHeigth={widthToDp(7)} isLoading={loader} /> : undefined}
                    tintColorRight={Config.Colors.bodyBg}
                />
            </View>
            <View style={styles.body}>
                <View style={styles.bodyContainer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: widthToDp(3) }}>
                        <TouchableOpacity onPress={() => decreaseDate()} activeOpacity={1}>
                            <Image source={Icons.back_icon}
                                style={{
                                    width: widthToDp(6),
                                    height: heightToDp(3),
                                    tintColor: Config.Colors.themeColor
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDatePicker}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <SvgCalender width={widthToDp(6)} height={heightToDp(2.5)} />
                                <Text style={{ fontSize: widthToDp(3.5), color: Config.Colors.black }}>{toLocaleDateString(selectedDate).day_name}, {(toLocaleDateString(selectedDate).month_name).slice(0, 3)} {toLocaleDateString(selectedDate).day}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: widthToDp(6),
                                height: heightToDp(3),
                            }}
                            onPress={increaseDate}
                            activeOpacity={1}
                        >
                            <Image source={Icons.forword_icon} style={{
                                width: widthToDp(6),
                                height: heightToDp(3),
                                tintColor: toLocaleDateString().day == toLocaleDateString(selectedDate).day ? Config.Colors.textColor.textColor_1 : Config.Colors.themeColor
                            }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{}}>
                        <View style={styles.attendance_details}>
                            <FlatList
                                data={attendanceData?.data?.attendanceV2List?.detail ?? []}
                                renderItem={renderItem}
                                extraData={attendanceData?.data?.attendanceV2List?.detail}
                                keyExtractor={(item, index) => String(index)}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                            />
                        </View>
                        <CustomInput
                            commonWidth={widthToDp(100)}
                            onChangeText={(text) => onChange(text)}
                            placeholder={t(Config.employeelistText?.search_emp)}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            autoComplete={'given-name'}
                            leftImage={Icons.search_icon}
                            backgroundColor={Config.Colors.searchBgInput}
                            bgColor={Config.Colors.inputField}
                            countryCodeStatus={true}
                            commonHeight={widthToDp(12)}
                            textAlignVertical="center"
                            onSubmitEditing={(text) => console.log("text")}
                            borderColor={Config.Colors.searchBriderInput}
                        />
                    </View>
                    <SafeAreaView style={{ height: "75.5%" }}>
                        {attendanceData?.data?.attendanceV2List?.data.length ?
                            <>
                                <FlatList
                                    data={attendanceData?.data?.attendanceV2List?.data ?? []}
                                    renderItem={renderUserItem}
                                    extraData={attendanceData?.data?.attendanceV2List?.data}
                                    keyExtractor={(item, index) => String(index)}
                                    style={{ paddingBottom: widthToDp(20), flex: 1 }}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        gap: 10
                                    }}
                                />
                            </>
                            :
                            loader ?
                                <View style={{ height: '90%', justifyContent: 'center' }}>
                                    <ActivityIndicator size="large" color={Config.Colors.themeColor} />
                                </View>
                                :
                                <View style={{ height: '90%', justifyContent: 'center' }}>
                                    <SvgXml xml={NotFound_result} />
                                </View>
                        }
                    </SafeAreaView>

                </View>
            </View>

            {isModalVisible ? (
                <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()}
                    negativeButton={{ label: t(Config.branchesText?.cancel), textColor: Config.Colors.errorText, }}
                    positiveButton={{ label: t(Config.manage_attendance?.confirm), textColor: Config.Colors.themeColor, }}
                />
            ) : null}
            <View>
                {isAlertModal ?
                    <AltertBox isModalVisible={isAlertModal} onRequestClose={() => setIsAlertModal(false)} confirm={() => alertdata?.confirm()} cancel={() => alertdata?.cancel()} imageIcon={Icons?.check_icon} textMessage={{ text1: alertdata?.statusText, text2: alertdata?.time }}
                    />
                    : null}
            </View>
            <View>
                {mapModal ?
                    <CustomModal
                        modalVisible={mapModal}
                        onRequestClose={() => setMapModal(!mapModal)}
                        alignItems='center'
                        justifyContent='center'
                        disableOnPress={false}
                        showHeader={true}
                        animationType="slide"
                    >
                        <ScrollView style={{
                            width: widthToDp(100),
                            height: heightToDp(100),
                            backgroundColor: Config.Colors.bodyBg,
                            borderRadius: widthToDp(2),
                            paddingBottom: widthToDp(10),
                        }}>
                            <Header_2
                                leftImage={Icons?.arrow_back}
                                commonWidth={widthToDp(12)}
                                commonHeight={heightToDp(5)}
                                leftText={liveLocation?.user_name ? liveLocation?.user_name : route?.params?.name}
                                animated={true}
                                onPressLeft={() => setMapModal(!mapModal)}
                                // rightImage={Icons.download_icon}
                                tintColorRight={Config.Colors.bodyBg}
                            />
                            <CustomMap defaultlocation={liveLocation} />
                        </ScrollView>
                    </CustomModal>
                    : null}
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, },
    bodyContainer: { width: widthToDp(90), },
    attContainer: { width: widthToDp(90), minHeight: heightToDp(10), backgroundColor: Config.Colors.themeColor, borderRadius: 10, padding: 20 },
    body: { marginTop: widthToDp(3), width: widthToDp(100), alignItems: 'center', },
    boxContant: { borderBottomWidth: .3, flexDirection: 'row', gap: widthToDp(5), paddingLeft: widthToDp(6), paddingRight: widthToDp(10), paddingTop: widthToDp(3.5), paddingBottom: widthToDp(3.5), alignItems: 'center', },
    text1: { fontFamily: Config.fontFamilys.Poppins_SemiBold, fontSize: widthToDp(3), color: Config.Colors.black },
    text2: { fontFamily: Config.fontFamilys.Poppins_Light, fontSize: widthToDp(2.5), color: Config.Colors.black, },
    firstWord: { backgroundColor: Config.Colors.themeColor, color: Config.Colors.bodyBg, width: 35, height: 35, marginLeft: widthToDp(2), marginTop: widthToDp(4), textAlign: "center", borderRadius: 25, alignItems: "center", flexDirection: "row", fontSize: widthToDp(6) },
    bottomBtn: { position: "absolute", bottom: 0, backgroundColor: Config.Colors.bodyBg, width: widthToDp(95), height: heightToDp(6), alignSelf: "center", borderRadius: 5, marginBottom: widthToDp(2) },
    attendance_details: { height: heightToDp(7), marginBottom: heightToDp(2), flexDirection: 'row', },
    cellText: { fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(3), color: Config.Colors.black },
    image: { tintColor: Config.Colors.attendenceIcon }
})
export default memo(ManageAttendance);