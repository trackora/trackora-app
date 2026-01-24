import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import * as Icons from '../../helpers/Icons';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import { toLocaleDateString } from '../../helpers/utils';
import { SvgXml } from 'react-native-svg';
import { NotFound_result } from '../../helpers/Svg';
import { Header_2 } from '../../components/Header';
import {
  CustomLinearButton,
  CustomDropDownComponent,
  CustomInputBox,
} from '../../components/CustomElements';
import CustomModal from '../../components/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const LeaveRequests = ({ navigation, route }) => {
  const adminData = useSelector(state => state.admin);
  const [searchByStatus, setSearchByStatus] = React.useState('All');
  const [leaveListCountData, setLeaveListCountData] = React.useState(null);
  const [leaveListData, setLeaveListData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userFormModal, setUserFormModal] = React.useState(false);
  const [statusValue, setStatusValue] = React.useState(null);
  const [userFormData, setUserFormData] = React.useState(null);
  const [statusRemark, setStatusRemark] = React.useState(null);
  const [leaveModal, setLeaveModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { t } = useTranslation();
  const leaveListCount = async () => {
    let bodyData = {};
    let apiData = await apiPostService(
      Constants?.leave_list_count_api,
      bodyData,
    );
    if (apiData?.data?.status === 'success') {
      setLeaveListCountData(apiData?.data?.result?.data);
    }
  };
  const handleLeaveList = async (type = null) => {
    setLoading(true);
    try {
      let bodyData = {
        limit: 20,
        start: 0,
        filter: {
          search: null,
          status: type,
        },
      };
      let apiData = await apiPostService(Constants?.leave_list_api, bodyData);
      if (apiData?.data?.status === 'success') {
        setLeaveListData(apiData?.data?.result?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leave list:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      leaveListCount();
      handleLeaveList();
    }, []),
  );
  const keyExtractor = React.useCallback((item, index) => String(index), []);
  const ListFooterComponent = () => {
    return loading ? (
      <TouchableOpacity style={{ marginBottom: heightToDp(10), marginTop: 20 }}>
        <ActivityIndicator size={35} color={Config.Colors.textColor} />
      </TouchableOpacity>
    ) : null;
  };
  const handleUserModal = async item => {
    setUserFormModal(true);
    setStatusValue(item?.status);
    setUserFormData(item);
  };
  const filterLeavesByStatus = item => {
    setLoading(true);
    if (item?.name === 'All') {
      handleLeaveList();
      setSearchByStatus(item?.name);
    } else {
      handleLeaveList(item?.name);
      setSearchByStatus(item?.name);
    }
  };

  const renderLeaveCountItem = ({ item, index }) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <TouchableOpacity
          onPress={() => filterLeavesByStatus(item)}
          style={[
            styles.history_header_text,
            searchByStatus === item.name
              ? { backgroundColor: Config.Colors.themeColor }
              : { backgroundColor: Config.Colors.defaultColor },
          ]}
        >
          <Text
            style={{
              color:
                searchByStatus === item.name
                  ? Config.Colors.defaultColor
                  : Config.Colors.black,
            }}
          >
            {item.name} ({item.count})
          </Text>
        </TouchableOpacity>
        {searchByStatus == item.name ? <View style={styles.triangle} /> : null}
      </View>
    );
  };

  const renderLeaveListItem = ({ item, index }) => {
    return (
      <View
        style={{
          width: '98%',
          justifyContent: 'center',
          alignSelf: 'center',
          marginBottom: 10,
        }}
        key={index}
      >
        <View
          style={{
            backgroundColor: Config.Colors.defaultColor,
            elevation: 1,
            width: '100%',
            borderRadius: 10,
          }}
        >
          <View style={{ padding: 10 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{}}>
                <Text style={styles.history_text_3}>
                  {toLocaleDateString(item?.created_on).customDate} |{' '}
                  {item?.created_by_name}
                </Text>
              </View>
              {searchByStatus === 'All' ? (
                <View
                  style={{
                    backgroundColor: Config.Colors.yellow,
                    padding: widthToDp(1),
                    borderRadius: 15,
                  }}
                >
                  <Text
                    style={[
                      styles.history_text_3,
                      { color: Config.Colors.defaultColor },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    // backgroundColor: Config.Colors.yellow,
                    padding: widthToDp(1),
                    borderRadius: 15,
                  }}
                  onPress={() => handleUserModal(item)}
                >
                  <Image
                    source={Icons?.more_vert_icon}
                    style={{ width: widthToDp(5), height: widthToDp(5) }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View>
              <Text
                style={[
                  styles.history_text_3,
                  {
                    fontSize: widthToDp(3),
                    color: Config.Colors.textColor.textColor_1,
                  },
                ]}
              >
                {t(Config.leave_req_text?.date_created_by)}
              </Text>
            </View>
            <View style={{ marginBottom: 10, width: widthToDp(98) }}>
              <Text
                style={{
                  borderBottomWidth: 1,
                  borderStyle: 'dashed',
                  borderBottomColor: Config.Colors.borderColor,
                  width: '100%',
                  marginLeft: -10,
                }}
              ></Text>
            </View>

            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.container_part_2]}>
                  <Text
                    style={[
                      styles.container_part_2_text_1,
                      {
                        fontSize: widthToDp(4),
                        fontWeight: Config.WEIGHTS.light,
                      },
                    ]}
                  >
                    {toLocaleDateString(item?.start_date).toLocaleDateString}
                  </Text>
                  <Text style={[styles.container_part_2_text_2]}>
                    {t(Config.leave_req_text?.start_day)}
                  </Text>
                </View>
                <View style={[styles.container_part_2]}>
                  <Text
                    style={[
                      styles.container_part_2_text_1,
                      {
                        fontSize: widthToDp(4),
                        fontWeight: Config.WEIGHTS.light,
                      },
                    ]}
                  >
                    {toLocaleDateString(item?.end_date).toLocaleDateString}
                  </Text>
                  <Text style={[styles.container_part_2_text_2]}>
                    {t(Config.leave_req_text?.end_day)}
                  </Text>
                </View>
                <View style={[styles.container_part_2]}>
                  <Text
                    style={[
                      styles.container_part_2_text_1,
                      {
                        fontSize: widthToDp(4),
                        fontWeight: Config.WEIGHTS.light,
                      },
                    ]}
                  >
                    {item.total_days}
                  </Text>
                  <Text style={[styles.container_part_2_text_2]}>
                    {t(Config.leave_req_text?.total_day)}
                  </Text>
                </View>
              </View>

              <View style={styles.container_part_3}>
                <Text style={styles.container_part_3_text_2}>
                  {t(Config.leave_req_text?.subject)} :
                  <Text style={{ color: Config.Colors.textColor.textColor_2 }}>
                    {' '}
                    {t(Config.leave_req_text?.leave)}
                  </Text>
                </Text>
                <Text style={styles.container_part_3_text_2}>
                  {t(Config.leave_req_text?.description)} :
                  <Text style={{ color: Config.Colors.textColor.textColor_2 }}>
                    {' '}
                    {item.description}
                  </Text>
                </Text>
              </View>

              {item?.status_on ? (
                <View style={styles.details2}>
                  <Text style={styles.container_part_3_text_1}>
                    {t(Config.leave_req_text?.updated_by)}{' '}
                    {item?.status_by_name} {t(Config.leave_req_text?.on)}{' '}
                    {toLocaleDateString(item?.status_on).toLocaleDateString}
                  </Text>
                  <Text style={styles.container_part_3_text_1}>
                    {t(Config.employeelistText?.remark)} : {item?.status_remark}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };
  const handleDropDown = async item => {
    setStatusValue(item);
  };
  const goBackScreen = () => {
    navigation.goBack();
  };
  const handleUpdateStatus = async () => {
    if (statusRemark == null) {
      setErrorMessage(prv => ({
        ...prv,
        statusRemark: t(Config.otherText?.required),
      }));
    } else {
      const bodyData = {
        leave_id: userFormData?.id,
        status: statusValue,
        remark: statusRemark,
      };
      let apiData = await apiPostService(
        Constants?.update_leave_status_api,
        bodyData,
      );
      if (apiData?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: `${apiData?.data?.status}`,
          text2: `${apiData?.data?.message} 👋`,
          swipeable: true,
        });
        setUserFormData(null);
        setStatusValue(null);
        setStatusRemark(null);
        leaveListCount();
        handleLeaveList(searchByStatus);
        setUserFormModal(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(20)}
        commonHeight={heightToDp(5)}
        leftText={route?.params?.name}
        animated={true}
        onPressLeft={goBackScreen}
        tintColorRight={Config.Colors.defaultColor}
      />
      <View style={styles.container}>
        <View style={{ ...styles.body, gap: 20 }}>
          {/* <View style={{ width: "90%", marginTop: 20 }}>
                        <Text style={{ fontFamily: Config.fontFamilys.Poppins_Medium, color: Config.Colors.themeColor, fontSize: 20 }}>History</Text>
                    </View> */}
          <View style={{ width: '97%' }}>
            {leaveListCountData?.length > 0 ? (
              <FlatList
                data={leaveListCountData}
                extraData={leaveListCountData}
                renderItem={item => renderLeaveCountItem(item)}
                keyExtractor={keyExtractor}
                onEndReachedThreshold={0.1}
                removeClippedSubviews={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 7,
                }}
                style={{ minHeight: heightToDp(5), marginTop: 5 }}
              />
            ) : null}
          </View>
          <View style={styles?.boxContainerIner}>
            {!loading ? (
              <React.Fragment>
                {leaveListData?.length > 0 ? (
                  <SafeAreaView style={{ height: '95%' }}>
                    <FlatList
                      refreshing={loading}
                      data={leaveListData}
                      extraData={leaveListData}
                      renderItem={renderLeaveListItem}
                      keyExtractor={keyExtractor}
                      showsVerticalScrollIndicator={false}
                      // onEndReached={() => handleMoreData()}
                      onEndReachedThreshold={0.1}
                      initialNumToRender={2}
                      removeClippedSubviews={true}
                      windowSize={5}
                      maxToRenderPerBatch={5}
                      updateCellsBatchingPeriod={1000}
                      snapToAlignment="start"
                      decelerationRate="fast"
                      onRefresh={() => handleLeaveList(searchByStatus)}
                      ListFooterComponent={ListFooterComponent}
                    />
                  </SafeAreaView>
                ) : (
                  <View style={{ height: '90%', justifyContent: 'center' }}>
                    <SvgXml xml={NotFound_result} />
                  </View>
                )}
              </React.Fragment>
            ) : (
              <TouchableOpacity
                style={{ height: '90%', justifyContent: 'center' }}
              >
                <ActivityIndicator size={35} color={Config.Colors.textColor} />
              </TouchableOpacity>
            )}
          </View>
          {/* <TouchableOpacity
                        style={{ position: 'absolute', bottom: widthToDp(40), zIndex: 999, }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <CustomLinearButton
                                commonWidth={widthToDp(40)}
                                text={"Submit"}
                                onPress={() => setLeaveModal(!leaveModal)}
                                color={Config.Colors.defaultColor}
                                Icons={Icons.edit_picture}
                            />
                        </View>
                    </TouchableOpacity> */}
          {userFormModal ? (
            <CustomModal
              modalVisible={userFormModal}
              onRequestClose={() => setUserFormModal(!userFormModal)}
              alignItems="center"
              justifyContent="center"
              disableOnPress={false}
              showHeader={false}
            >
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View
                  style={{
                    width: widthToDp(90),
                    backgroundColor: '#fff',
                    borderRadius: widthToDp(2),
                  }}
                >
                  <View style={{ width: '100%' }}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        borderBottomWidth: 2,
                        borderColor: Config.Colors.borderColor,
                        padding: 10,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: widthToDp(5),
                            fontFamily: Config.fontFamilys.Poppins_Medium,
                            color: Config.Colors.textColor.textColor_2,
                          }}
                        >
                          {t(Config.employeelistText?.user_info)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setUserFormModal(!userFormModal)}
                      >
                        <Image
                          source={Icons.close}
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: Config.Colors.textColor.textColor_1,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 20,
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          width: widthToDp(38),
                          backgroundColor: Config.Colors.bodyBg,
                          padding: 10,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            color: Config.Colors.textColor.textColor_2,
                          }}
                        >
                          {t(Config.otherText?.name)}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            color: Config.Colors.textColor.textColor_1,
                          }}
                        >
                          {userFormData?.created_by_name}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: widthToDp(40),
                          backgroundColor: Config.Colors.bodyBg,
                          padding: 10,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            color: Config.Colors.textColor.textColor_2,
                          }}
                        >
                          {t(Config.leave_req_text?.days)}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            color: Config.Colors.textColor.textColor_1,
                          }}
                        >
                          {userFormData?.total_days}
                        </Text>
                      </View>
                      {/* <View style={{ width: widthToDp(38), backgroundColor: Config.Colors.bodyBg, padding: 10, borderRadius: 10 }}>
                                                <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_2 }}>Manager</Text>
                                                <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_1 }}>{userFormData?.reporting_manager}</Text>
                                            </View>
                                            <View style={{ width: widthToDp(40), backgroundColor: Config.Colors.bodyBg, padding: 10, borderRadius: 10 }}>
                                                <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_2 }}>Role</Text>
                                                <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_1 }}>{userFormData?.role}</Text>
                                            </View> */}
                      <View style={{ justifyContent: 'center' }}>
                        <Text
                          style={{
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            color: Config.Colors.textColor.textColor_2,
                          }}
                        >
                          {t(Config.otherText?.status)}
                        </Text>
                        <CustomDropDownComponent
                          commonWidth={widthToDp(82)}
                          commonHeight={widthToDp(15)}
                          borderColor={Config.Colors.borderColor}
                          data={adminData?.data?.userStatusListData}
                          // placeholder={statusValue}
                          onChangeDropDown={item => handleDropDown(item)}
                          backgroundColor={Config.Colors.defaultColor}
                          initialValue={statusValue}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          bottom: heightToDp(2.5),
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            color: Config.Colors.textColor.textColor_2,
                          }}
                        >
                          {t(Config.employeelistText?.remark)}
                        </Text>
                        <CustomInputBox
                          commonWidth={widthToDp(82)}
                          commonHeight={widthToDp(20)}
                          keyboardType={'default'}
                          autoComplete={'cc-csc'}
                          // borderColor={Config.Colors.borderColor}
                          // errorMessage={errorMessage?.description ? errorMessage?.description : ''}
                          borderColor={
                            errorMessage?.statusRemark
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.grey
                          }
                          numberOfLines={5}
                          onChangeText={text => setStatusRemark(text)}
                          inputValue={statusRemark}
                          commmonBorderRadius={3}
                          commonBackgroundColor={Config.Colors.defaultColor}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <CustomLinearButton
                          commonWidth={widthToDp(80)}
                          text={t(Config.employeelistText?.apply)}
                          onPress={() => handleUpdateStatus()}
                          color={Config.Colors.defaultColor}
                          borderRadius={10}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </CustomModal>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
  },
  // container_part_2_text_1: {
  //     fontSize: widthToDp(2.5),
  //     fontFamily: Config.fontFamilys.Poppins_SemiBold,
  //     fontWeight: Config.WEIGHTS.extraBold,
  //     color: Config.Colors.themeColor
  // },
  history_text_2: {
    // fontSize: widthToDp(2.3),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontWeight: Config.WEIGHTS.semibold,
    color: Config.Colors.themeColor,
  },
  history_text_3: {
    fontSize: widthToDp(4),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontWeight: Config.WEIGHTS.semibold,
    color: Config.Colors.textColor.textColor_2,
  },
  history_text_container: {
    padding: widthToDp(2),
    paddingRight: widthToDp(4),
    width: widthToDp(29),
    height: heightToDp(7),
    alignItems: 'center',
    borderRadius: 5,
  },
  container_part_2: {
    width: '31.5%',
    height: 70,
    backgroundColor: Config.Colors.bodyBg,
    padding: 10,
    borderRadius: 6,
  },
  container_part_2_text_2: {
    fontSize: widthToDp(3),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontWeight: Config.WEIGHTS.semibold,
    color: Config.Colors.textColor.textColor_1,
  },
  container_part_2_text_1: {
    fontSize: widthToDp(3),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontWeight: Config.WEIGHTS.semibold,
    color: Config.Colors.textColor.textColor_2,
  },
  container_part_3: {
    backgroundColor: Config.Colors.bodyBg,
    padding: 10,
    borderRadius: 6,
    width: '100%',
    gap: 10,
  },

  container_part_3_text_2: {
    fontSize: widthToDp(3),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontWeight: Config.WEIGHTS.semibold,
    color: Config.Colors.textColor.textColor_1,
    flexWrap: 'wrap',
  },
  container_part_3_text_1: {
    fontSize: widthToDp(3),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontWeight: Config.WEIGHTS.semibold,
    color: Config.Colors.defaultColor,
    flexWrap: 'wrap',
  },

  history_header_text: {
    borderRadius: 6,
    padding: 10,
  },
  dropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    height: heightToDp(5.5),
    width: '90%',
    borderWidth: 0.5,
    borderColor: Config.Colors.themeColor,
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: widthToDp(3.5),
    borderTopWidth: 0.5,
    borderTopColor: Config.Colors.themeColor,
    padding: widthToDp(3),
  },
  btnLeave: {
    backgroundColor: Config.Colors.inputField_1,
    padding: widthToDp(1.5),
    marginRight: widthToDp(3),
    borderRadius: 5,
  },

  input: {
    height: 100,
    borderWidth: 0.5,
    borderColor: Config.Colors.themeColor,
    width: widthToDp(90),
    marginLeft: heightToDp(2.5),
    paddingLeft: widthToDp(3),
    borderRadius: 5,
  },
  ModalView: {
    backgroundColor: '#fff',
    height: heightToDp(33),
    width: widthToDp(66),
    borderRadius: 5,
    elevation: 30,
  },
  calenderView: {
    backgroundColor: '#fff',
    height: heightToDp(40),
    width: widthToDp(85),
    elevation: 30,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: widthToDp(3),
    paddingLeft: widthToDp(3),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: widthToDp(5),
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Config.Colors.themeColor,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Config.Colors.themeColor,
    marginRight: widthToDp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainerIner: {
    marginBottom: widthToDp(10),
  },
  loader: {
    position: 'absolute',
    flexDirection: 'row',
    width: widthToDp(100),
    height: '100%',
  },
  details: {
    backgroundColor: Config.Colors.grey,
    // width: widthToDp(90),
  },
  details2: {
    backgroundColor: Config.Colors.themeColor,
    borderRadius: 6,
    marginBottom: widthToDp(2.5),
    padding: 10,
  },
  triangle: {
    // width: 10,
    // height: 10,
    // position: "absolute",
    // top: 30,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderTopWidth: 10,
    borderRightColor: 'transparent',
    borderRightWidth: 10,
    borderBottomColor: Config.Colors.themeColor,
    borderTopColor: Config.Colors.themeColor,
  },
});

export default React.memo(LeaveRequests);
