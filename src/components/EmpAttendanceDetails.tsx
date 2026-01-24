import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity, Linking, Alert, Platform, PermissionsAndroid } from 'react-native'
import React, { memo, useCallback } from 'react'
import * as Config from '../helpers/Config'
import * as Icons from '../helpers/Icons'
import * as Constants from '../helpers/Constants'
import { widthToDp, heightToDp } from '../helpers/Responsive'
import { CustomLinearButton } from './CustomElements'
import { useTranslation } from 'react-i18next'
import { toLocaleDateString } from '../helpers/utils'
import Share from 'react-native-share'
import RNFS from 'react-native-fs'
import { createFolder } from '../utils/common'
import { useSelector } from 'react-redux'
import { apiPostService } from '../helpers/services'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import { SvgXml } from 'react-native-svg'
import { NotFound_result } from '../helpers/Svg'
const EmpAttendanceDetails = ({ attendanceData, handleUserLocation, selectedMonth, userData }) => {
    const { t } = useTranslation();
    const appfolderName = useSelector((state) => state?.login?.folderName);
    const keyExtractor = useCallback((item, index) => String(index), []);
    const listHeaderComponent = () => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    borderBottomWidth: 2,
                    borderColor: Config.Colors.borderColor,
                }}
            >
                <View
                    style={{
                        width: widthToDp(15),
                        ...styles.tableCell,
                        padding: 0,
                        borderTopLeftRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            color: Config.Colors.black,
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            fontSize: widthToDp(3.5),
                        }}
                    >
                        {t(Config.salaryScreenText?.date)}
                    </Text>
                </View>
                <View
                    style={{
                        width: widthToDp(25),
                        ...styles.tableCell,
                    }}
                >
                    <Text
                        style={{
                            color: Config.Colors.black,
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            fontSize: widthToDp(3.5),
                        }}
                    >
                        {t(Config.manage_attendance?.punch_in)}
                    </Text>
                </View>
                <View
                    style={{
                        width: widthToDp(25),
                        ...styles.tableCell,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: 5,
                    }}
                >
                    <Text
                        style={{
                            color: Config.Colors.black,
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            fontSize: widthToDp(3.5),
                        }}
                    >
                        {t(Config.manage_attendance?.punch_out)}
                    </Text>
                </View>
                <View
                    style={{
                        width: widthToDp(25),
                        ...styles.tableCell,
                        paddingTop: 10,
                        paddingBottom: 10,
                        padding: 0,
                        borderTopRightRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            color: Config.Colors.black,
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            fontSize: widthToDp(3.5),
                        }}
                    >
                        {t(Config.salaryScreenText?.type)}
                    </Text>
                </View>
            </View>
        );

    }
    const viewAttRenderItem = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    borderBottomWidth: 2,
                    borderColor: Config.Colors.borderColor,
                }}
            >
                <View style={{ flexDirection: "row" }}>
                    <View
                        style={{
                            width: widthToDp(15),
                            ...styles.tableCell,
                        }}
                    >
                        <Text
                            style={{
                                color: Config.Colors.textColor.textColor_2,
                                fontFamily: Config.fontFamilys.Poppins_Medium,
                                fontSize: widthToDp(3.5),
                            }}
                        >
                            {toLocaleDateString(item?.attend_date).day}
                        </Text>
                        <Text
                            style={{
                                color: Config.Colors.textColor.textColor_1,
                                fontFamily: Config.fontFamilys.Poppins_Medium,
                                fontSize: widthToDp(3.5),
                            }}
                        >
                            {toLocaleDateString(item?.attend_date).day_name}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: widthToDp(25),
                            ...styles.tableCell,
                        }}
                    >
                        {item?.start_time ? (
                            <Text
                                style={{
                                    color: Config.Colors.textColor.textColor_2,
                                    fontFamily: Config.fontFamilys.Poppins_Medium,
                                    fontSize: widthToDp(3.5),
                                }}
                            >
                                {item?.start_time}
                            </Text>
                        ) : null}
                    </View>
                    <View
                        style={{
                            width: widthToDp(25),
                            ...styles.tableCell,
                            alignItems: "flex-start",
                            justifyContent: "center",
                        }}
                    >
                        {item?.stop_time ? (
                            <Text
                                style={{
                                    color: Config.Colors.textColor.textColor_2,
                                    fontFamily: Config.fontFamilys.Poppins_Medium,
                                    fontSize: widthToDp(3.5),
                                }}
                            >
                                {item?.stop_time}
                            </Text>
                        ) : null}
                    </View>
                    <View
                        style={{
                            width: widthToDp(25),
                            ...styles.tableCell,
                            alignItems: "flex-start",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 6,
                                borderColor: Config.Colors.borderColor,
                                padding: 10,
                                borderWidth: 0.5,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        item?.attendance_type === "Present"
                                            ? Config.Colors.green
                                            : Config.Colors.textColor.textColor_2,
                                    fontFamily: Config.fontFamilys.Poppins_Medium,
                                    fontSize: widthToDp(3.5),
                                }}
                            >
                                {item?.attendance_type}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    const renderItem = ({ item, index }) => {
        if (item) {
            return (
                <View style={{ marginRight: 2 }}>
                    <View style={{ borderLeftWidth: 5, borderColor: item?.borderColor, width: widthToDp(22), padding: widthToDp(2), backgroundColor: item?.backgroundColor, borderRadius: 10, }}>
                        <Text style={{ color: Config.Colors.textColor.textColor_2, fontFamily: Config.fontFamilys.Poppins_Bold, fontSize: widthToDp(3), }}>  {item.value ? item.value : "00"}</Text>
                        <Text style={{ color: Config.Colors.textColor.textColor_1, fontFamily: Config.fontFamilys.Poppins_Bold, fontSize: widthToDp(3), }}>{item.name}</Text>
                    </View>
                </View>
            );
        }
    };
    const checkFileExists = async (path, fileName) => {
        try {
            const fileExists = await RNFS.exists(path);
            if (fileExists) {
                Alert.alert('File Location', `File is saved at: Android->media->com.trackora_app.tlp->${fileName}.csv`);
                const files = await RNFS.readDir(appfolderName);
                console.log('Files in directory:', files);

            } else {
                Alert.alert('File Not Found', 'The file does not exist at the specified path');
            }
        } catch (err) {
            console.log("err", err.message);
            Alert.alert('Error', 'An error occurred while checking the file');
        }
    };
    async function saveCsvFile(csvData, fileName) {
        const filePath = `${appfolderName}/${fileName}.csv`;

        try {
            await RNFS.writeFile(filePath, csvData, 'utf8').then((success) => {
                console.log("success", success)
                Alert.alert('File Downloaded', 'File has been downloaded successfully!', [
                    { text: 'OK', onPress: () => checkFileExists(filePath, fileName) }
                ]);

            })
                .catch((err) => {
                    console.log(err.message);
                    Alert.alert('Error', 'File could not be downloaded');
                });
            const exists = await RNFS.exists(filePath);

        } catch (error) {
            console.error('Error saving CSV file:', error);
        }
    }
    console.log("selectedMonth=>", selectedMonth)
    const handleReportExcel = async () => {
        let bodyData = {
            attend_month: `${toLocaleDateString(selectedMonth).year}-0${toLocaleDateString(selectedMonth).month_number + 1}`,
            user_id: userData?.id,
        }
        console.log("bodyData", bodyData)
        const apiData = await apiPostService(Constants?.attendance_list_excel_api, bodyData)
        console.log("apiData", apiData?.data?.result?.file_name)
        if (apiData?.data?.result?.data.length > 0) {
            const headers = Object.keys(apiData?.data?.result?.data[0]);
            // Join headers as CSV header row
            let csvData = headers.join(',') + '\n';

            // Convert each object to CSV row
            apiData?.data?.result?.data.forEach(obj => {
                const row = headers.map(header => obj[header]).join(',');
                csvData += row + '\n';
            });
            saveCsvFile(csvData, `${apiData?.data?.result?.data[0]?.Name}-${Date.now()}`);
            return csvData;
        } else {
            Alert.alert('No Data Found', 'No attendance data found for the selected month');
        }
    }
    const handleReportPDF = async () => {
        let bodyData = {
            attend_month: `${toLocaleDateString(selectedMonth).year}-0${toLocaleDateString(selectedMonth).month_number + 1}`,
            user_id: userData?.id,
        }
        try {
            const apiData = await apiPostService(Constants?.attendance_list_pdf_api, bodyData);
            const blob = await apiData.blob();
            console.log("apiData==>", apiData)
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                savePdf(base64data);
            };
        } catch (error) {
            console.log(error);
        }
    }
    const savePdf = async (base64Data) => {
        const path = `${appfolderName}/sample.pdf`;
        try {
            await RNFS.writeFile(path, base64Data, 'base64');
            setFilePath(path);
            Alert.alert('Success', `PDF saved successfully at ${path}`);
        } catch (error) {
            console.error('Error saving PDF:', error);
            Alert.alert('Error', 'Failed to save PDF');
        }
    }
    console.log("first===", attendanceData)
    return (
        <>
            <View>
                <FlatList data={attendanceData?.details} renderItem={(item) => renderItem(item)} keyExtractor={keyExtractor} showsHorizontalScrollIndicator={false} horizontal />
            </View>
            <View style={{ borderBottomColor: Config.Colors.borderColor, borderBottomWidth: 2, marginTop: 10, marginBottom: 10, width: widthToDp(100) }} />
            {attendanceData ? (
                <View >
                    <FlatList data={attendanceData?.data} ListHeaderComponent={listHeaderComponent} renderItem={viewAttRenderItem} keyExtractor={keyExtractor} showsVerticalScrollIndicator={false} removeClippedSubviews />
                </View>
            ) : null}
            {attendanceData?.data && attendanceData?.data.length > 0 ? (
                <View style={{ flexDirection: "row", gap: 5, marginTop: widthToDp(2) }}>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}>
                        <CustomLinearButton commonWidth={widthToDp(28)} text={t(Config.salaryScreenText?.show_in_map)} onPress={() => handleUserLocation(attendanceData?.attendDataShowInMap)} color={Config.Colors.defaultColor} fontSize={widthToDp(3)} borderRadius={10} Icons={Icons.show_map} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}>
                        <CustomLinearButton commonWidth={widthToDp(30)} text={t(Config.salaryScreenText?.live_tracker)} onPress={() => handleUserLocation(attendanceData?.getUserLiveTrack)} color={Config.Colors.defaultColor} fontSize={widthToDp(3)} borderRadius={10} Icons={Icons.live_track_icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }} >
                        <CustomLinearButton commonWidth={widthToDp(30)} text={t(Config.salaryScreenText?.download_report)} color={Config.Colors.defaultColor} fontSize={widthToDp(3)} borderRadius={10} Icons={Icons.download_icon} onPress={handleReportPDF} />
                    </TouchableOpacity>
                </View>) : <View style={{ height: heightToDp(60), justifyContent: 'center', alignSelf: 'center' }}>
                <SvgXml xml={NotFound_result} />
            </View>}
        </>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, },
    bodyContainer: { width: widthToDp(90), },
    attContainer: { width: widthToDp(90), minHeight: widthToDp(15), backgroundColor: Config.Colors.themeColor, borderRadius: 10, padding: 20, },
    body: { width: widthToDp(100), alignItems: "center", justifyContent: "center", },
    boxContant: { borderBottomWidth: 0.3, flexDirection: "row", gap: widthToDp(5), paddingLeft: widthToDp(6), paddingRight: widthToDp(10), paddingTop: widthToDp(3.5), paddingBottom: widthToDp(3.5), alignItems: "center" },
    text1: { fontFamily: Config.fontFamilys.Poppins_SemiBold, fontSize: widthToDp(3), color: Config.Colors.black },
    text2: { fontFamily: Config.fontFamilys.Poppins_Light, fontSize: widthToDp(2.5), color: Config.Colors.black, },
    firstWord: { backgroundColor: Config.Colors.themeColor, color: Config.Colors.bodyBg, width: 42, height: 42, marginLeft: widthToDp(2), textAlign: "center", borderRadius: 25, alignItems: "center", flexDirection: "row", fontSize: widthToDp(6), paddingTop: widthToDp(1), },
    triangle: { width: 20, height: 20, position: "absolute", bottom: -20, borderLeftWidth: 10, borderLeftColor: "transparent", borderTopWidth: 10, borderRightColor: "transparent", borderRightWidth: 10, borderBottomColor: Config.Colors.themeColor, borderTopColor: Config.Colors.themeColor, },
    tableCell: { borderWidth: 1, borderColor: Config.Colors.borderColor, alignItems: "center", justifyContent: "center", padding: 10, },
});
export default EmpAttendanceDetails