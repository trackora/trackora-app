import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, } from "react-native";
import React, { useCallback, useMemo, useRef, useState, memo, useEffect } from "react";
import { heightToDp, widthToDp } from "../../helpers/Responsive";
import * as Icons from "../../helpers/Icons";
import * as Config from "../../helpers/Config";
import * as Constants from "../../helpers/Constants";
import { Header_2 } from "../../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { apiPostService } from "../../helpers/services";
import { CustomLinearButton, } from "../../components/CustomElements";
import { toLocaleDateString } from "../../helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import Notes from "../user/Notes";
import CustomModal from "../../components/CustomModal";
import CustomImageVIew from "../user/CustomImageVIew";
import { SvgXml } from "react-native-svg";
import { NotFound_result } from "../../helpers/Svg";
import CustomMap from "../../components/CustomMap";
import { useTranslation } from "react-i18next";
import EmpSalaryDetails from "../../components/EmpSalaryDetails";
import EmpBasicDetails from "../../components/EmpBasicDetails";
import EmpAttendanceDetails from "../../components/EmpAttendanceDetails";

const SalaryDetails = ({ navigation, route }) => {
    const { t } = useTranslation();
    const [mapModal, setMapModal] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [userData, setUserData] = useState<any>([]);
    const [userSalaryData, setUserSalaryData] = useState([]);
    const [userDetails, setUserDetails] = useState("salary");
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [imageLoader, setImageLoader] = useState(false);
    const [base64, setBase64] = useState("");
    const [liveLocation, setLiveLocation] = useState(null);
    const flatListRef = useRef(null);
    const [showMonth, setShowmonth] = useState(false);
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [fullImage, setFullImage] = useState(false);
    const [imagePath, setImagePath] = useState("");
    const [attendMonth, setAttendMonth] = useState(new Date());
    const showPicker = useCallback((value) => setShowmonth(value), []);
    const keyExtractor = useCallback((item, index) => String(index), []);

    const goBackScreen = () => navigation?.goBack();
    const handleUserData = useCallback(async (updatedMonth) => {
        setPageLoader(true);
        let tempData = [];
        let bodyData = {
            month: updatedMonth ? updatedMonth : `${toLocaleDateString(selectedMonth).year}-0${toLocaleDateString(selectedMonth).month_number+1}`,
            user_id: route?.params?.id,
        };
        let apiData = await apiPostService(Constants?.user_salary_details, bodyData);
        let userApiData = await apiPostService(Constants?.user_basic_details, bodyData);
        console.log("apiData==>", apiData?.data?.data?.basicDetail);
        if (apiData?.data || userApiData?.data) {
            setPageLoader(false);
            setUserData(apiData?.data?.data?.basicDetail);
            setUserSalaryData(userApiData?.data?.data?.basicDetail);
            return true;
        }
    }, [selectedMonth, route]);

    const handleAttendanceList = useCallback(async (payload) => {
        console.log("call me")
        showPicker(false);
        let tempData = [];
        let bodyData = {
            attend_date: payload?.date ? payload?.date : "",
            attend_month: payload?.month ? payload?.month : "",
            user_id: route?.params?.id,
        };
        let apiData = await apiPostService(Constants?.attendance_list, bodyData);
        console.log("call me",apiData)
        if (apiData?.data?.result?.data) {
            // for (let index = 0; index < apiData?.data?.result.attendYearMonthData.length; index++) {
            //     tempData.push({ label: apiData?.data?.result.attendYearMonthDisplayArray[index], value: apiData?.data?.result.attendYearMonthData[index] })
            // }
            Object.keys(apiData?.data?.result.detail).map((key) => {
                if (key == "Present") {
                    tempData.push({
                        name: key,
                        value: apiData?.data?.result.detail[key],
                        backgroundColor: "#f5faf6",
                        borderColor: "#05f545",
                    });
                } else if (key == "Absent") {
                    tempData.push({
                        name: key,
                        value: apiData?.data?.result.detail[key],
                        backgroundColor: "#f9f5f4",
                        borderColor: "#da2f35",
                    });
                } else if (key == "Half day") {
                    tempData.push({
                        name: key,
                        value: apiData?.data?.result.detail[key],
                        backgroundColor: "#faf8f1",
                        borderColor: "#f0d37d",
                    });
                } else if (key == "Paid Leave") {
                    tempData.push({
                        name: key,
                        value: apiData?.data?.result.detail[key],
                        backgroundColor: "#faf5fa",
                        borderColor: "#d279d2",
                    });
                }
            });
            apiData = {
                ...apiData.data.result,
                detail: tempData,
            };
            console.log("attendanceData==>", apiData);
            setAttendanceData(apiData as any);
        }
    }, []);

    console.log("attendanceData", attendanceData);

    useFocusEffect(useCallback(() => {
        let updateDate = toLocaleDateString(attendMonth).customMonth;
        handleAttendanceList({ month: updateDate });
        handleUserData(undefined);
    }, []));


    const handleUserLocation = async (location) => {
        setLiveLocation(location);
        setMapModal(true);
    };
    const handelFullImage = (img) => {
        setFullImage(true);
        setImagePath(img);
    };
    const renderNotes = ({ item, index }) => {
        return (
            <View style={{ width: "100%" }} key={index}>
                <View style={{ alignItems: "flex-end", paddingRight: 10, gap: 10 }}>
                    <View style={{ padding: 10 }}>
                        <View
                            style={{
                                backgroundColor: Config.Colors.backgroundColors.bg_3,
                                padding: 10,
                                borderRadius: 20,
                            }}
                        >
                            <View
                                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                            >
                                <Text
                                    style={{
                                        color: Config.Colors.textColor.textColor_1,
                                        fontFamily: Config.fontFamilys.Poppins_Medium,
                                    }}
                                >
                                    {toLocaleDateString(item.created_on).customValTimeString}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: Config.Colors.textColor.textColor_2,
                                        alignSelf: "flex-end",
                                        textAlign: "right",
                                        fontFamily: Config.fontFamilys.Poppins_Medium,
                                    }}
                                >
                                    {item?.text}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {item?.filename != "" ? (
                        <TouchableOpacity
                            onPress={() => handelFullImage(`${item?.filename}`)}
                            style={{
                                borderRadius: 10,
                                borderColor: Config.Colors.black,
                                width: widthToDp(50),
                                height: widthToDp(30),
                                backgroundColor: Config.Colors.backgroundColors.bg_3,
                            }}
                        >
                            <Image
                                source={{ uri: `${item?.filename}` }}
                                style={{
                                    width: widthToDp(50),
                                    height: widthToDp(30),
                                    resizeMode: "cover",
                                    borderRadius: 10,
                                }}
                                onLoad={() => setImageLoader(true)}
                                onLoadStart={() => setImageLoader(true)}
                                onLoadEnd={() => setImageLoader(false)}
                            />
                            {imageLoader ? (
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    <ActivityIndicator
                                        size={35}
                                        color={Config.Colors.textColor.textColor_1}
                                    />
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    };
    const onChangeMonth = async (type) => {
        if (type == "addMonth") {
            let updatedDate = new Date(attendMonth);
            updatedDate.setMonth(updatedDate.getMonth() + 1);
            setAttendMonth(updatedDate);
            handleAttendanceList({
                month: toLocaleDateString(
                    updatedDate.setDate(attendMonth.getMonth() + 1)
                ).customMonth,
            });
            const updatedMonth = toLocaleDateString(
                updatedDate.setDate(attendMonth.getMonth() + 1)
            ).customMonth;
            handleUserData(updatedMonth);
        } else if (type == "minusMonth") {
            let updatedDate = new Date(attendMonth);
            updatedDate.setMonth(updatedDate.getMonth() - 1);
            setAttendMonth(updatedDate);
            handleAttendanceList({
                month: toLocaleDateString(
                    updatedDate.setDate(attendMonth.getMonth() + 1)
                ).customMonth,
            });
            const updatedMonth = toLocaleDateString(
                updatedDate.setDate(attendMonth.getMonth() + 1)
            ).customMonth;
            handleUserData(updatedMonth);
        }
    };
    console.log("userSalaryData", userSalaryData);
    const renderHeadreItem = ({ item, index }) => {
        return (
            <>
                <TouchableOpacity
                    onPress={() => setUserDetails(item?.title)}
                    style={{
                        backgroundColor:
                            userDetails === item?.title
                                ? Config.Colors.themeColor
                                : Config.Colors.textColor.textColor_1,
                        borderRadius: 10,
                        width: widthToDp(28),
                        height: widthToDp(10),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: widthToDp(3),
                            color:
                                userDetails === item?.title
                                    ? Config.Colors.defaultColor
                                    : Config.Colors.textColor.textColor_2,
                            fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                    >
                        {t(item?.title)}
                    </Text>
                    {userDetails === item?.title ? (
                        <View style={styles.triangle} />
                    ) : null}
                </TouchableOpacity>
            </>
        );
    };
    const renderUserDetails = useCallback(() => {
        return (userDetails === "salary" ? (
            <>
                <EmpSalaryDetails userData={userSalaryData} pageLoader={pageLoader} selectedMonth={selectedMonth} />
            </>
        ) : userDetails === "attendance" ? (
            <>
                <EmpAttendanceDetails attendanceData={attendanceData} userData={{ id: route?.params?.id ?? '' }} handleUserLocation={handleUserLocation} selectedMonth={attendMonth}/>
            </>
        ) : userDetails === "notes" ? (
            <View style={{ height: heightToDp(80) }}>
                {userData?.notesData?.length ? (
                    <FlatList
                        refreshing={pageLoader}
                        onRefresh={() => handleUserData(undefined)}
                        ref={(it) => (flatListRef.current = it)}
                        data={userData?.notesData}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                        extraData={userData?.notesData}
                        renderItem={(item) => renderNotes(item)}
                        keyExtractor={keyExtractor}
                        onEndReachedThreshold={0.1}
                        removeClippedSubviews={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{
                            marginBottom: 0,
                        }}
                        contentContainerStyle={{
                            paddingBottom: 80,
                        }}
                    />
                ) : pageLoader ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <ActivityIndicator size={35} color={Config.Colors.textColor.textColor_1} />
                    </View>
                ) : (
                    <View
                        style={{
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <SvgXml xml={NotFound_result} />
                    </View>
                )}
            </View>
        ) : userDetails === "user_details" ? (
            <EmpBasicDetails userData={userData} />
        ) : null);
    }, [userDetails, userData, attendanceData, userSalaryData]);

    return (
        <View style={styles.container}>
            <Header_2 leftImage={Icons.arrow_back} commonWidth={widthToDp(12)} commonHeight={heightToDp(5)} leftText={route?.params?.empName} animated={true} onPressLeft={goBackScreen} tintColorRight={Config.Colors.defaultColor}
            />
            <View style={styles.body}>
                <View style={styles.bodyContainer}>
                    <View style={{ height: widthToDp(20) }}>
                        <FlatList data={Config?.userSalaryDetailsHeader} renderItem={renderHeadreItem} keyExtractor={(_, index) => String(index)} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: 20, }} extraData={userDetails} />
                    </View>
                    {userDetails !== "user_details" ?
                        <View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 20, alignItems: "center", paddingBottom: 10 }}>
                                <View>
                                    <Text style={{ fontSize: widthToDp(3.5), fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_2 }}>{t(userDetails)}{" "} {t(Config.branchesText?.for)}</Text>
                                </View>
                                <View style={{
                                    borderRadius: 6, borderColor: Config.Colors.secondary, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 2, width: widthToDp(53),
                                }}
                                >
                                    <TouchableOpacity
                                        onPress={() => onChangeMonth("minusMonth")}
                                        style={{
                                            borderRadius: 5, borderColor: Config.Colors.secondary, borderWidth: 1, backgroundColor: toLocaleDateString(attendMonth).month_name == toLocaleDateString().month_name ? Config.Colors.backgroundColors.bg_2 : Config.Colors.secondary,
                                        }}
                                    >
                                        <Image source={Icons.arrow_left} style={{ width: 30, height: 30, resizeMode: "contain" }} />
                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{ fontSize: widthToDp(3.5), color: Config.Colors.textColor.textColor_2, fontFamily: Config.fontFamilys.Poppins_Medium }}>
                                            {toLocaleDateString(attendMonth).month_name + "-" + toLocaleDateString(attendMonth).year}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => onChangeMonth("addMonth")}
                                        disabled={toLocaleDateString(attendMonth).month_name == toLocaleDateString().month_name}
                                        style={{
                                            borderRadius: 2, borderColor: Config.Colors.secondary,
                                            borderWidth: 0.5,
                                            backgroundColor:
                                                toLocaleDateString(attendMonth).month_name ==
                                                    toLocaleDateString().month_name
                                                    ? Config.Colors.backgroundColors.bg_2
                                                    : Config.Colors.secondary,
                                        }}
                                    >
                                        <Image source={Icons.arrow_right} style={{ width: 32, height: 32, resizeMode: "contain" }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> : null}
                    <View style={{ height: heightToDp(70) }}>
                        <FlatList nestedScrollEnabled data={[0]} renderItem={renderUserDetails} extraData={userDetails} showsVerticalScrollIndicator={false} contentContainerStyle={{ marginBottom: 20 }} />
                    </View>
                </View>
                {mapModal ? (
                    <CustomModal modalVisible={mapModal} onRequestClose={() => setMapModal(!mapModal)} alignItems="center" justifyContent="center" disableOnPress={false} showHeader={true} animationType="slide">
                        <ScrollView style={{ width: widthToDp(100), height: heightToDp(100), backgroundColor: Config.Colors.bodyBg, borderRadius: widthToDp(2), paddingBottom: widthToDp(10), }}>
                            <Header_2 leftImage={Icons?.arrow_back} commonWidth={widthToDp(12)} commonHeight={heightToDp(5)} leftText={liveLocation?.user_name ? liveLocation?.user_name : route?.params?.name} animated={true} onPressLeft={() => setMapModal(!mapModal)} tintColorRight={Config.Colors.bodyBg} />
                            <CustomMap defaultlocation={liveLocation} filterData={(date) => handleAttendanceList({ date: date })} />
                        </ScrollView>
                    </CustomModal>
                ) : null}
                {fullImage ? (
                    <CustomModal modalVisible={fullImage} onRequestClose={() => setFullImage(!fullImage)} backgroundColor="#000" transparent={false} showHeader={true} headerText="">
                        <CustomImageVIew imageLoader={imageLoader} handleFullImage={() => setFullImage(!fullImage)} imagePath={imagePath} handleSubmit={() => { /* TODO: implement handleSubmitImage */ }} />
                    </CustomModal>
                ) : null}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, },
    bodyContainer: { width: widthToDp(90), },
    attContainer: {
        width: widthToDp(90),
        minHeight: widthToDp(15),
        backgroundColor: Config.Colors.themeColor,
        borderRadius: 10,
        padding: 20,
    },
    body: {
        width: widthToDp(100),
        alignItems: "center",
        justifyContent: "center",
    },
    boxContant: {
        borderBottomWidth: 0.3,
        flexDirection: "row",
        gap: widthToDp(5),
        paddingLeft: widthToDp(6),
        paddingRight: widthToDp(10),
        paddingTop: widthToDp(3.5),
        paddingBottom: widthToDp(3.5),
        alignItems: "center"
    },
    text1: { fontFamily: Config.fontFamilys.Poppins_SemiBold, fontSize: widthToDp(3), color: Config.Colors.black },
    text2: { fontFamily: Config.fontFamilys.Poppins_Light, fontSize: widthToDp(2.5), color: Config.Colors.black, },
    firstWord: {
        backgroundColor: Config.Colors.themeColor,
        color: Config.Colors.bodyBg,
        width: 42,
        height: 42,
        marginLeft: widthToDp(2),
        textAlign: "center",
        borderRadius: 25,
        alignItems: "center",
        flexDirection: "row",
        fontSize: widthToDp(6),
        paddingTop: widthToDp(1),
    },
    triangle: {
        width: 20,
        height: 20,
        position: "absolute",
        bottom: -20,
        borderLeftWidth: 10,
        borderLeftColor: "transparent",
        borderTopWidth: 10,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderBottomColor: Config.Colors.themeColor,
        borderTopColor: Config.Colors.themeColor,
    },
    tableCell: {
        borderWidth: 1,
        borderColor: Config.Colors.borderColor,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
});
export default memo(SalaryDetails);
