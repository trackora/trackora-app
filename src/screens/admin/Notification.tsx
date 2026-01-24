import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, StatusBar, SectionList, Image } from 'react-native'
import React from 'react'
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import { AlertBox, toLocaleDateString } from '../../helpers/utils';
import { SvgXml } from 'react-native-svg';
import { NotFound_result } from '../../helpers/Svg';
import AltertBox from '../../components/AltertBox';
import BottomSheet from '../../animated/BottomSheet';
import CustomModal from '../../components/CustomModal';
import { CustomButton, CustomInput, CustomLinearButton } from '../../components/CustomElements';
import CustomCheckBox from '../../components/CustomCheckBox';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
let notification_type = []
let userIds = []
const AdminNotification = ({ navigation, route }) => {
  const adminData = useSelector(state => state.admin);
  const [notificationData, setNotificationData] = React.useState(null)
  const [notificationType, setNotificationType] = React.useState(null)
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [alertdata, setAlertdata] = React.useState(null);
  const [statusModal, setStatusModal] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [filterModal, setFilterModal] = React.useState(false)
  const [loader, setLoader] = React.useState(false);
  const { t } = useTranslation();
  const [totalLimit, setTotalLimit] = React.useState({
    limit: 10,
    start: 0,
  })
  const [loading, setLoading] = React.useState(false);
  const [user_ids, setUser_ids] = React.useState([]);
  const goBackScreen = () => {
    navigation.goBack();
  }
  const getNotification = async (payload) => {
    setLoading(true)
    const bodyData = {
      limit: totalLimit.limit,
      start: totalLimit.start,
      filter: {
        user_ids: payload?.userIds,
        notification_type: payload?.notificationType
      },
    }
    let apiData = await apiPostService(Constants?.notification_list_api, bodyData);
    let apiNotiTypeData = await apiPostService(Constants?.notification_type_api, bodyData);
    console.log("apiData", apiData, apiNotiTypeData)

    // let tempData = [];
    // let yesterdayNotification = [];
    // let todayNotification = [];
    // let earlierNotification = [];
    if (apiNotiTypeData?.data?.status === 'success' && apiData?.data?.status === 'success') {
      setNotificationType(apiNotiTypeData?.data?.data)
      setNotificationData(apiData?.data?.data?.notificationList);
      setLoading(false);
      setFilterModal(false)
    }
    // if (apiData?.data?.status === 'success') {

    //   for (let index = 0; index < apiData?.data?.data?.yesterdayNotification.length; index++) {
    //     // const element = apiData?.data?.data?.yesterdayNotification[index];
    //     yesterdayNotification.push(apiData?.data?.data?.yesterdayNotification[index])
    //   }
    //   if (yesterdayNotification.length) {
    //     tempData.push({ title: "Yesterday", data: yesterdayNotification })
    //   }
    //   for (let index = 0; index < apiData?.data?.data?.todayNotification.length; index++) {
    //     // const element = apiData?.data?.data?.todayNotification[index];
    //     todayNotification.push(apiData?.data?.data?.todayNotification[index])
    //   }
    //   if (todayNotification.length) {
    //     tempData.push({ title: "Today", data: todayNotification })
    //   }
    //   for (let index = 0; index < apiData?.data?.data?.earlierNotification.length; index++) {
    //     // const element = apiData?.data?.data?.earlierNotification[index];
    //     earlierNotification.push(apiData?.data?.data?.earlierNotification[index])
    //   }
    //   if (earlierNotification.length) {
    //     tempData.push({ title: "Earlier", data: earlierNotification })
    //   }
    //   // setTotalLimit((prv) => ({ ...prv, start: prv.limit, limit: prv.limit + 50 }))
    //   // setNotificationData(tempData);
    //   setLoading(false);
    //   setFilterModal(false)
    // }
  }
  useFocusEffect(
    React.useCallback(() => {
      getNotification();
    }, [])
  );
  const handleReadNotification = async (item) => {
    if (item?.status === 0) {
      const bodyData = {
        notification_id: item?.id,
      }
      const apiData = await apiPostService(Constants?.mark_read_notification_api, bodyData);
      if (apiData?.data.status === 'success') {
        await getNotification();
      }
    }
    else {
      setModalVisible(true)
      setAlertdata({
        statusText: t(Config.notification_text?.notification_readed),
        time: `${toLocaleDateString()?.customTime}`,
        confirm: () => setModalVisible(false),
        cancel: () => setModalVisible(false),
      });
    }
  }

  const handleMoreData = async () => {
    setLoading(true);
    if (!loading) {
      const bodyData = {
        limit: totalLimit?.limit,
        start: totalLimit?.start,
      }
      const apiData = await apiPostService(Constants.notification_list_api, bodyData);
      if (apiData?.data?.data) {
        setNotificationData((prv) => ([...prv, ...apiData?.data?.data?.notificationList]));
        setTotalLimit((prv) => ({ ...prv, start: prv.limit, limit: prv.limit + 10 }));
        setLoading(false)
      }
    }
  }
  const renderNotificationItem = React.useCallback(({ item }, checkDateType) => {
    return (
      <View >
        <View style={{}}>
          <Text style={{ color: Config.Colors.black, fontSize: 15, fontFamily: Config.fontFamilys.Poppins_Bold }}>{checkDateType}</Text>
        </View>
        <TouchableOpacity
          style={{
            width: widthToDp(90),
            // borderRadius: 10,
            // borderWidth: 1,
            borderBottomWidth: 2,
            borderColor: Config.Colors.borderColor,
            // backgroundColor: item.status == 0 ? '#edebeb' : '#fff',
            flexDirection: "row",
            // justifyContent: 'space-between'
          }}
          onPress={() => handleReadNotification(item)}
        >
          {/* <View style={{ position: 'absolute', width: '100%', alignItems: 'flex-end' }}>
            <View style={{ backgroundColor: Config.Colors.themeColor, paddingLeft: 10, paddingBottom: 4, paddingRight: 10, borderBottomLeftRadius: 20, borderTopRightRadius: 10 }}>
              <Text style={{ color: '#fff' }}>{toLocaleDateString(item?.created_on)?.customValTimeString}</Text>
            </View>
          </View> */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{
              backgroundColor: "#ffe0e2",
              justifyContent: 'center',
              alignItems: 'center',
              width: widthToDp(10),
              height: widthToDp(10),
              borderRadius: 10
            }}>
              <FastImage source={item?.image === '' ? Icons?.notes_icon : item?.image} style={{ width: 40, height: 40 }} />
            </View>
            <View style={{ width: widthToDp(80) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: widthToDp(73) }}>
                <Text style={{ flexWrap: 'wrap', color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(3.5), fontFamily: Config.fontFamilys.Poppins_Medium, lineHeight: 18 }}>{item?.title}</Text>
                <View>
                  <Text style={{ flexWrap: 'wrap', color: Config.Colors.textColor.textColor_1, fontSize: widthToDp(3.5) }}>{toLocaleDateString(item?.created_on)?.day_name} {toLocaleDateString(item?.created_on)?.day}</Text>
                </View>
              </View>
              <View>
                <Text style={{
                  color: Config.Colors.textColor.textColor_1,
                  fontSize: widthToDp(3.5), flexWrap: 'wrap',
                }}>{item?.remark}</Text>
              </View>
            </View>
          </View>

        </TouchableOpacity>
      </View>
    )
  }, [notificationData])

  const keyExtractor = React.useCallback((item) => item.id, [])
  const ListFooterComponent = () => {
    return (
      <TouchableOpacity style={{ marginBottom: heightToDp(10), marginTop: 20 }}>
        {loading ? <ActivityIndicator size={35} color={Config.Colors.textColor} /> : null}
      </TouchableOpacity>
    )
  }

  const handleOptionPress = (value, type) => {
    if (type == "usersList") {
      if (!userIds.includes(value)) {
        userIds.push(value)
      } else {
        let index = userIds.indexOf(value);
        if (index > -1) {
          userIds.splice(index, 1);
          userIds = userIds
        }
      }
    } else if (type === "notification_type") {
      if (!notification_type.includes(value)) {
        notification_type.push(value)
      } else {
        let index = notification_type.indexOf(value);
        if (index > -1) {
          notification_type.splice(index, 1);
          notification_type = notification_type
        }
      }
      // setNotification_type(tempArry)
    }
  }
  const RenderEmpItem = React.useCallback(({ item, index, type }) => {
    item = item?.item
    return (
      <TouchableOpacity
        style={{
          paddingBottom: 10,
          paddingTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", gap: 15, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: "row", gap: 15, justifyContent: 'space-between' }}>
            <View style={{
              backgroundColor: "#ffe0e2",
              justifyContent: 'center',
              alignItems: 'center',
              width: widthToDp(10),
              height: widthToDp(10),
              borderRadius: 10
            }}>
              {item.icon_path ?
                <Image source={{ uri: item?.icon_path }}
                  style={{
                    width: widthToDp(5),
                    height: widthToDp(5),
                    tintColor: Config.Colors.secondary
                  }}
                />
                :
                <Text
                  style={{
                    color: index % 2 == 0 ? Config.Colors.themeColor : Config.Colors.secondary,
                    fontSize: widthToDp(3.5)
                  }}
                >{item?.name?.replace(/\s/g, '').slice(0, 1).toUpperCase()}</Text>
              }
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{
                color: Config.Colors.black,
                fontSize: widthToDp(4),
                fontFamily: Config.fontFamilys.Poppins_Medium,
              }}>{item?.name}
              </Text>
              {item?.last_used ?
                <Text style={{ fontSize: widthToDp(2.5), fontFamily: Config.fontFamilys.Poppins_SemiBold, }}>{t(Config.employeelistText?.last_used)} : {item?.last_used}</Text>
                : null}
            </View>
          </View>
          <View style={{}}>
            {type === "usersList" ?
              <CustomCheckBox
                handleOptionPress={(name) => handleOptionPress(item?.id, "usersList")}
                checkBoxValue={item?.name}
                flexDirection={"column"}
                alignItems={"flex-end"}
              /> :
              <CustomCheckBox
                handleOptionPress={(name) => handleOptionPress(name, "notification_type")}
                checkBoxValue={item?.name}
                flexDirection={"column"}
                alignItems={"flex-end"}
              />
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  }, [])

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={route?.params?.name}
        animated={true}
        onPressLeft={goBackScreen}
        tintColorRight={Config.Colors.defaultColor}
      />

      <View style={{
        // justifyContent: "center",
        // alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Config.Colors.borderColor,
        marginTop: widthToDp(3),
        // width: widthToDp(90),

      }}>
        <View style={{
          flexDirection: "row",
          // width: widthToDp(90),
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: widthToDp(3),
          marginLeft: widthToDp(5),
          marginRight: widthToDp(5),
        }}>
          <View style={{}}>
            <Text style={{ color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(3.5), fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t(Config.notification_text?.filters)}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <TouchableOpacity style={styles.notificationFilter} onPress={() => {
              setFilter('All');
              setFilterModal(true)
            }}>
              <Text style={{ color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(3.5), fontFamily: Config.fontFamilys.Poppins_SemiBold }}>{t
                (Config.notification_text?.all)}</Text>
              <Image source={Icons.arrow_down}
                style={{ width: 25, height: 30, resizeMode: 'contain', tintColor: Config.Colors.secondary }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationFilter} onPress={() => {
              setFilter('Employees');
              setFilterModal(true);
            }}>
              <Text style={{ color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(3.5), fontFamily: Config.fontFamilys.Poppins_SemiBold }}> {t(Config.notification_text?.employees)}</Text>
              <Image source={Icons.arrow_down}
                style={{ width: 25, height: 30, resizeMode: 'contain', tintColor: Config.Colors.secondary }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles?.boxContainerIner}>
          {notificationData ?
            <FlatList
              refreshing={loading}
              onRefresh={getNotification}
              data={notificationData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderNotificationItem}
              showsVerticalScrollIndicator={false}
              // renderSectionHeader={({ section: { title } }) => (
              //   <Text style={styles.header}>{title}</Text>
              // )}
              contentContainerStyle={{
                paddingBottom: 80
              }}
              ListFooterComponent={ListFooterComponent}
              onEndReached={handleMoreData}
            /> :
            loading ?
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', }}>
                <ActivityIndicator size={35} color={Config.Colors.themeColor} />
              </View>
              : <View style={{ height: '100%' }}>
                <SvgXml xml={NotFound_result} />
              </View>}
          {statusModal ?
            <AltertBox
              isModalVisible={statusModal}
              onRequestClose={() => setStatusModal(false)}
              confirm={() => alertdata?.confirm()}
              cancel={() => alertdata?.cancel()}
              imageIcon={Icons?.check_icon}
              textMessage={{
                text1: alertdata?.statusText,
              }}
            />
            : null}
          {filter === "Employees" ?
            <CustomModal
              modalVisible={filterModal}
              onRequestClose={() => setFilterModal(!filterModal)}
              alignItems='flex-end'
              justifyContent='flex-end'
              disableOnPress={true}
              showHeader={false}>
              <View style={{
                backgroundColor: Config.Colors.defaultColor,
                width: widthToDp(100),
                height: heightToDp(70),
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
              }}>
                <View>
                  <View style={{
                    padding: 20,
                    borderBottomWidth: 2,
                    borderColor: Config.Colors.borderColor
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View>
                        <Text style={{ color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(4), fontFamily: Config.fontFamilys.Poppins_Medium }}>{t(Config.notification_text?.select_staff)}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setFilterModal(!filterModal)}>
                        <Image source={Icons.close} style={{ width: 30, height: 30, tintColor: Config.Colors.textColor.textColor_1 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}
                  >
                    <View style={{}}>
                      <CustomInput
                        commonWidth={"100%"}
                        onChangeText={(text) => console.log("first")}
                        // value={empName}
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
                        onSubmitEditing={(text) => console.log("first")}
                        borderColor={Config.Colors.searchBriderInput}
                      />
                      {
                        loader ?
                          <View style={{ justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color={Config.Colors.themeColor} />
                          </View>
                          :
                          null
                      }
                      <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingTop: 20 }}>
                        <Text style={{ color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(4), fontFamily: Config.fontFamilys.Poppins_Medium }}>{t(Config.notification_text?.select_all_emp)}</Text>
                        <View style={{}}>
                          <CustomCheckBox
                            handleOptionPress={(item) => handleOptionPress(item, "all")}
                            checkBoxValue={t(Config.notification_text?.all)}
                            flexDirection={"column"}
                            alignItems={"flex-end"}
                          />
                        </View>
                      </View>
                      <View style={{ height: widthToDp(70) }}>
                        <FlatList
                          data={adminData?.data?.usersList?.data}
                          renderItem={(item, index) => <RenderEmpItem item={item} index={index} type={"usersList"} />}
                          extraData={adminData?.data?.usersList?.data}
                          keyExtractor={(item, index) => String(index)}
                          showsVerticalScrollIndicator={false}
                          ItemSeparatorComponent={() => {
                            return (
                              <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: Config.Colors.borderColor,
                              }} />
                            )
                          }}
                        />
                      </View>
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CustomLinearButton
                          commonWidth={widthToDp(80)}
                          text={t(Config.employeelistText?.apply)}
                          onPress={getNotification}
                          color={Config.Colors.defaultColor}
                          borderRadius={10}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

            </CustomModal>
            :
            <CustomModal
              modalVisible={filterModal}
              onRequestClose={() => setFilterModal(!filterModal)}
              alignItems='flex-end'
              justifyContent='flex-end'
              disableOnPress={true}
              showHeader={false}>
              <View style={{
                backgroundColor: Config.Colors.defaultColor,
                width: widthToDp(100),
                height: heightToDp(70),
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
              }}>
                <View>
                  <View style={{
                    padding: 20,
                    borderBottomWidth: 2,
                    borderColor: Config.Colors.borderColor
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View>
                        <Text style={{ color: Config.Colors.textColor.textColor_2, fontSize: widthToDp(4), fontFamily: Config.fontFamilys.Poppins_Medium }}>{t(Config.notification_text?.select_notification_type)}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setFilterModal(!filterModal)}>
                        <Image source={Icons.close} style={{ width: 30, height: 30, tintColor: Config.Colors.textColor.textColor_1 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}
                  >
                    <View style={{}}>
                      <View style={{ height: widthToDp(90) }}>
                        <FlatList
                          data={notificationType}
                          renderItem={(item, index) => <RenderEmpItem item={item} index={index} type={""} />}
                          extraData={notificationType}
                          keyExtractor={(item, index) => String(index)}
                          showsVerticalScrollIndicator={false}
                          ItemSeparatorComponent={() => {
                            return (
                              <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: Config.Colors.borderColor,
                              }} />
                            )
                          }}
                        />
                      </View>
                      <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <CustomLinearButton
                          commonWidth={widthToDp(80)}
                          text={t(Config.employeelistText?.apply)}
                          onPress={() => getNotification({ notificationType: notification_type })}
                          color={Config.Colors.defaultColor}
                          borderRadius={10}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

            </CustomModal>}
        </View>
      </View>
    </View >
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 15,
    fontFamily: Config.fontFamilys.Poppins_Bold,
    justifyContent: "center",
    alignItems: 'center',
    color: Config.Colors.black,
    marginTop: 20
  },
  body: {
    marginTop: 10,
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
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    // paddingBottom: 100,
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2)
  },
  notificationFilter: {
    borderWidth: 1.5,
    borderRadius: 6,
    borderColor: Config.Colors.secondary,
    paddingLeft: widthToDp(2),
    paddingRight: widthToDp(2),
    paddingTop: widthToDp(1),
    paddingBottom: widthToDp(1),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  }
})
export default React.memo(AdminNotification);