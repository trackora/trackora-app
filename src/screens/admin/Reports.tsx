import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native'
import React, { useMemo } from 'react'
import { heightToDp, widthToDp } from '../../helpers/Responsive'
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { Header_2 } from '../../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService } from '../../helpers/services';
import { CustomButton, CustomDropDownComponent, CustomInputBox } from '../../components/CustomElements';

import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { usersList } from '../../redux/slices/admin.slice';
import CustomModal from '../../components/CustomModal';
import RNFS from 'react-native-fs'
import Accordion from '../../animated/Accordion';
import AltertBox from '../../components/AltertBox';
import { useTranslation } from 'react-i18next';
const Reports = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const userData = useAppSelector(state => state.login);
    const adminData = useAppSelector(state => state.admin);
    const [empName, setEmpName] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const [alertdata, setAlertdata] = React.useState(null);
    const [isModalVisible, setiIsModalVisible] = React.useState(false);
    const [reportViewType, setReportViewType] = React.useState("Reports")
    const [userFormModal, setUserFormModal] = React.useState(false)
    const [userFormData, setUserFormData] = React.useState(null)
    const [statusValue, setStatusValue] = React.useState(null)
    const [statusRemark, setStatusRemark] = React.useState(null);
    const {t} = useTranslation();

    const goBackScreen = () => navigation?.goBack();
    const handleDropDown = async (item) => {setStatusValue(item)};
    const getUsersList = async (name) => {
        setLoader(true)
        // `${toLocaleDateString().year}-0${toLocaleDateString().month_number + 1}`
        const bodyDataUserList = {
            limit: 1000000,
            start: 0,
            filter: {
                "search": name
            },
        }
        let tempUserListIds = [];
        let apiUserListData = await apiPostService(Constants?.user_list_api, bodyDataUserList);
        if (apiUserListData?.data?.result?.data) {
            apiUserListData?.data?.result?.data.forEach(element => {
                tempUserListIds.push({ user_id: element.id })
            });
            apiUserListData = {
                ...apiUserListData.data.result,
                user_ids: tempUserListIds
            }
            setLoader(false)
            dispatch(usersList(apiUserListData))
        } else {
            console.log("Not Found")
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            getUsersList(undefined);
        }, [])
    );
    const onChange = (text) => {
        setEmpName(text)
        getUsersList(text)
    }
    const handleUserModal = async (item) => {
        setUserFormModal(true)
        setStatusValue(item?.user_status)
        setUserFormData(item)
    }
    const handleUpdateStatus = async () => {
        const bodyData = {
            "user_id": userFormData?.id,
            "status": statusValue,
            "status_remark": statusRemark,
        }
        let apiData = await apiPostService(Constants?.update_user_status_api, bodyData);
        if (apiData?.data?.status === "success") {
            setUserFormData(null);
            setStatusValue(null);
            setStatusRemark(null);
            setUserFormModal(false);
            getUsersList(undefined);
        }
    }
    async function saveCsvFile(csvData, fileName) {
        const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}.csv`;

        try {
            await RNFS.writeFile(filePath, csvData, 'utf8');
        } catch (error) {
            console.error('Error saving CSV file:', error);
        }
    }


    const handleReport = async () => {
        const contacts = [{
            name: 'Bob',
            lastname: 'Smith'
        }, {
            name: 'James',
            lastname: 'David'
        }, {
            name: 'Robert',
            lastname: 'Miller'
        }, {
            name: 'David',
            lastname: 'Martin'
        }];
        // Extract headers from the first object
        const headers = Object.keys(contacts[0]);
        // Join headers as CSV header row
        let csvData = headers.join(',') + '\n';

        // Convert each object to CSV row
        contacts.forEach(obj => {
            const row = headers.map(header => obj[header]).join(',');
            csvData += row + '\n';
        });
        saveCsvFile(csvData, 'exported_data');
        return csvData;

    }
    const renderEmpItem = ({ item, index }) => {
        return (
            <View style={{ borderBottomWidth: 1, borderBottomColor: Config.Colors.borderColor, paddingBottom: 5 }}>
                <View style={{ flexDirection: "row", gap: 15, marginTop: widthToDp(5), justifyContent: 'space-between' }}>

                    <View style={{ flexDirection: "row", gap: 15 }}>
                        {item.name ?
                            <Text style={styles.firstWord}>{item.name.replace(/\s/g, '').slice(0, 1).toUpperCase()}</Text>
                            : null}
                        <View>
                            <Text style={{
                                color: Config.Colors.black, fontSize: widthToDp(4),
                                fontFamily: Config.fontFamilys.Poppins_SemiBold
                            }}>{item?.name}
                                {'\n'}
                                <Text style={{ fontSize: widthToDp(2.5), fontFamily: Config.fontFamilys.Poppins_SemiBoldItalic, }}>Last Login : 14 Apr 12:30 PM</Text>
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                        width: widthToDp(10),
                        borderWidth: 1,
                        borderColor: Config.Colors.bodyBg,
                        padding: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10
                    }}
                        onPress={() => handleUserModal(item)}
                    >
                        <Image
                            source={Icons?.more_vert_icon}
                            style={{ width: widthToDp(5), height: widthToDp(5) }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ zIndex: 9999, height: heightToDp(100) }}>
                <Header_2
                    leftImage={Icons.arrow_back}
                    commonWidth={widthToDp(12)}
                    commonHeight={heightToDp(5)}
                    leftText={t(Config.report_text?.company_reports)}
                    animated={true}
                    onPressLeft={goBackScreen}
                    tintColorRight={Config.Colors.defaultColor}
                />
                <View style={styles.body}>
                    <View style={styles.bodyContainer}>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, justifyContent: 'center' }}>
                            <TouchableOpacity
                                onPress={() => setReportViewType("Reports")}
                                style={{
                                    backgroundColor:reportViewType === "Reports"? Config.Colors.themeColor:Config.Colors.textColor.textColor_1,
                                    padding: 20,
                                    borderRadius: 10,
                                    width: widthToDp(43),
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <View

                                    style={[styles.history_header_text]}
                                >
                                    <Text style={{ color: reportViewType === "Reports"?Config.Colors.defaultColor:Config.Colors.textColor.textColor_2,
                                fontFamily:Config.fontFamilys.Poppins_Medium }}>{t(Config.report_text?.reports)}</Text>
                                </View>
                                {reportViewType === "Reports" ?
                                    <View style={styles.triangle} />
                                    : null}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setReportViewType("Downloads")}
                                style={{
                                    backgroundColor:reportViewType === "Downloads"? Config.Colors.themeColor:Config.Colors.textColor.textColor_1,
                                    padding: 20,
                                    borderRadius: 10,
                                    width: widthToDp(43),
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <View

                                    style={[styles.history_header_text]}
                                >
                                    <Text style={{ color: reportViewType === "Downloads"?Config.Colors.defaultColor:Config.Colors.textColor.textColor_2,
                                fontFamily:Config.fontFamilys.Poppins_Medium}}>{t(Config.report_text?.downloads)}</Text>
                                </View>
                                {reportViewType === "Downloads" ?
                                    <View style={styles.triangle} />
                                    : null}
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            {reportViewType === "Reports" ?
                                <View style={{ height: heightToDp(75) }}>
                                    <Accordion data={(Config.CompanyReports ?? []).map((r: any, i: number) => ({ ...r, id: r.id ?? i }))} />
                                </View> :
                                <View style={{
                                    width: "100%",
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        padding: 20,
                                        backgroundColor: Config.Colors.defaultColor,
                                        elevation: 1,
                                        borderRadius: 10,
                                        width: widthToDp(90),
                                        gap: 20
                                    }}>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <View>
                                                <Image source={Icons.pdf_icon} style={{ width: widthToDp(10), height: widthToDp(12), resizeMode: 'contain' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_2 }}>{t(Config.report_text?.emp_list_report)}</Text>
                                                <View style={{ gap: 10, justifyContent: 'space-between', flexDirection: 'row', width: widthToDp(66), }}>
                                                    <Text style={{
                                                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                                                        color: Config.Colors.textColor.textColor_1
                                                    }}>{t(Config.report_text?.mar_24)}</Text>
                                                    <Text style={{
                                                        fontFamily: Config.fontFamilys.Poppins_SemiBold,
                                                        color: Config.Colors.textColor.textColor_1
                                                    }}>{t(Config.report_text?.all_branches)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'space-between' }}>
                                            <View style={{
                                                borderColor: Config.Colors.secondary,
                                                width: widthToDp(38),
                                                height: widthToDp(12),
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                flexDirection: 'row',
                                                gap: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <View>
                                                    <Image source={Icons.open_icon} style={{ width: 30, height: 30, }} />
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                                                            color: Config.Colors.secondary
                                                        }}
                                                    >{t(Config.report_text?.open)}</Text>
                                                </View>
                                            </View>
                                            <View style={{
                                                borderColor: Config.Colors.secondary,
                                                width: widthToDp(38),
                                                height: widthToDp(12),
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                flexDirection: 'row',
                                                gap: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <View>
                                                    <Image source={Icons.share_documet_icon} style={{ width: 30, height: 30, }} />
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                                                            color: Config.Colors.secondary
                                                        }}
                                                    >{t(Config.report_text?.share)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>
                        {/* <CustomMenu commonWidth={widthToDp(90)}
                            tintColor2={Config.Colors.black}
                            commonHeight={heightToDp(10)}
                            // item={item}
                            // onPress={(text) => onPressBtn(text)}
                            bottomImg={Icons.arrow_forward}
                            style={{
                                box: {
                                    borderRadius: 10
                                }
                            }}
                        /> */}

                        {/* <View style={{ height: '90%', }}>
                            <TouchableOpacity
                                onPress={() => handleReport()}
                                style={{ width: '100%', height: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: Config.Colors.black }}>Download Report</Text></TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </View>
            <View>
                <CustomModal
                    modalVisible={userFormModal}
                    onRequestClose={() => setUserFormModal(!userFormModal)}
                    alignItems='center'
                    justifyContent='center'
                    disableOnPress={true}
                    showHeader={false}
                >
                    <View style={{ width: widthToDp(90), backgroundColor: '#fff', borderRadius: widthToDp(2), paddingLeft: widthToDp(5), paddingRight: widthToDp(5), paddingBottom: widthToDp(5) }}>
                        <View style={{ width: '100%' }}>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: widthToDp(5), fontFamily: Config.fontFamilys.Poppins_Bold, }}>{t(Config.report_text?.user_info)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                <View>
                                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t(Config.otherText?.name)}</Text>
                                    <Text>{userFormData?.name}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t(Config?.report_text?.mobile_no)}</Text>
                                    <Text>{userFormData?.mobile_no}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t(Config.report_text?.reporting_manager)}</Text>
                                    <Text>{userFormData?.reporting_manager}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t(Config.employeelistText?.role)}</Text>
                                    <Text>{userFormData?.role}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t(Config.report_text?.user_status)}</Text>
                                    <CustomDropDownComponent
                                        commonWidth={widthToDp(80)}
                                        commonHeight={widthToDp(10)}
                                        borderColor={Config.Colors.themeColor}
                                        data={adminData?.data?.userStatusListData}
                                        // placeholder={statusValue}
                                        onChangeDropDown={(item) => handleDropDown(item)}
                                        backgroundColor={Config.Colors.defaultColor}
                                        initialValue={statusValue}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "center", bottom: heightToDp(2.5) }}>
                                    <CustomInputBox
                                        commonWidth={widthToDp(100)}
                                        commonHeight={widthToDp(20)}
                                        placeholder={`${t(Config.report_text?.enter_remark)} *`}
                                        keyboardType={'default'}
                                        autoComplete={'cc-csc'}
                                        // errorMessage={errorMessage?.description ? errorMessage?.description : ''}
                                        // borderColor={errorMessage?.description ? Config.Colors.errorFieldBorder : Config.Colors.grey}
                                        numberOfLines={5}
                                        onChangeText={(text) => setStatusRemark(text)}
                                        inputValue={statusRemark}
                                        commmonBorderRadius={3}
                                        commonBackgroundColor={Config.Colors.defaultColor}
                                    // CommonBorderWidth={0.5}
                                    />
                                </View>

                                <View style={{
                                    width: '100%',
                                    alignItems: "center",
                                    paddingRight: widthToDp(5),
                                    marginBottom: 10,
                                    marginTop: 5
                                }}>
                                    <CustomButton
                                        text={t(Config.otherText?.submit)}
                                        commonWidth={widthToDp(40)}
                                        activeOpacity={1}
                                        onPress={() => handleUpdateStatus()}
                                        elevation={4}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </CustomModal>

            </View>
            {isModalVisible ?
                <AltertBox
                    isModalVisible={isModalVisible}
                    onRequestClose={() => setiIsModalVisible(false)}
                    confirm={() => alertdata?.confirm()}
                    cancel={() => alertdata?.cancel()}
                    imageIcon={Icons?.check_icon}
                    textMessage={{
                        text1: alertdata?.statusText,
                        text2: alertdata?.time
                    }}
                />
                : null}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bodyContainer: {
        width: widthToDp(95),
        // justifyContent: 'space-between',
        // alignContent: 'center',
    },
    attContainer: {
        width: widthToDp(90),
        minHeight: widthToDp(15),
        backgroundColor: Config.Colors.themeColor,
        borderRadius: 10,
        // justifyContent: 'space-between',
        // alignContent: 'center',
        // borderWidth: .1,
        padding: 20
    },
    body: {
        width: widthToDp(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxContant: {
        borderBottomWidth: .3,
        flexDirection: 'row',
        gap: widthToDp(5),
        // minHeight: heightToDp(10),
        paddingLeft: widthToDp(6),
        paddingRight: widthToDp(10),
        paddingTop: widthToDp(3.5),
        paddingBottom: widthToDp(3.5),
        alignItems: 'center',
    },
    text1: {
        fontFamily: Config.fontFamilys.Poppins_SemiBold,
        fontSize: widthToDp(3),
        color: Config.Colors.black
    },
    text2: {
        fontFamily: Config.fontFamilys.Poppins_Light,
        fontSize: widthToDp(2.5),
        color: Config.Colors.black
    },
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
        paddingTop: widthToDp(1)
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
        borderTopColor: Config.Colors.themeColor
    },
    history_header_text: {
        marginTop: 20,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
})
export default React.memo(Reports);