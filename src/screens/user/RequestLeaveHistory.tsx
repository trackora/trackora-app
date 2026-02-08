import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import React from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import { toLocaleDateString } from '../../helpers/utils';
import { SvgXml } from 'react-native-svg';
import { NotFound_result } from '../../helpers/Svg';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';
import AltertBox from '../../components/AltertBox';
import Toast from 'react-native-toast-message';

const RequestLeaveHistory = ({ navigation, route }) => {
  const [searchByStatus, setSearchByStatus] = React.useState('All');
  const [leaveListCountData, setLeaveListCountData] = React.useState(null);
  const [leaveListData, setLeaveListData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [deleteAlertBoxContent, setDeleteAlertBoxContent] =
    React.useState(null);
  const { t } = useTranslation();

  // For finding out the count of leave list
  const leaveListCount = async () => {
    let bodyData = {
      filter: {},
    };
    let apiData = await apiPostService(
      Constants?.leave_list_count_api,
      bodyData,
    );

    if (isApiSuccess(apiData)) {
      setLeaveListCountData(apiData?.data?.result?.data);
    }
  };

  // For showing the leave list
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
      console.log("leave body",bodyData)
      let apiData = await apiPostService(Constants?.leave_list_api, bodyData);

      if (isApiSuccess(apiData)) {
        if (type === null) {
          setSearchByStatus('All');
          setLeaveListData(apiData?.data?.result?.data);
        }
      }
    } catch (error) {
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

  React.useLayoutEffect(() => {
    setLoading(true);
    leaveListCount();
    handleLeaveList();
  }, []);

  const keyExtractor = React.useCallback((item, index) => String(index), []);

  const ListFooterComponent = () => {
    return loading ? (
      <TouchableOpacity style={{ marginBottom: heightToDp(10), marginTop: 20 }}>
        <ActivityIndicator size={35} color={Config.Colors.textColor} />
      </TouchableOpacity>
    ) : null;
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

  // For showing Leave count with type like All,Pending,Approved....
  const showLeaveCount = ({ item, index }) => {
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
            styles?.history_header_text,
            searchByStatus === item?.name
              ? { backgroundColor: Config.Colors.themeColor }
              : { backgroundColor: Config.Colors.defaultColor },
          ]}
        >
          <Text
            style={{
              color:
                searchByStatus === item?.name
                  ? Config.Colors.defaultColor
                  : Config.Colors.black,
            }}
          >
            {item?.name} ({item?.count})
          </Text>
        </TouchableOpacity>
        {searchByStatus == item?.name ? <View style={styles.triangle} /> : null}
      </View>
    );
  };

  const handleDeleteLeave = async id => {
    let apiData = await apiPostService(Constants?.delete_leave_api, { id });
    if (isApiSuccess(apiData)) {
      leaveListCount();
      handleLeaveList();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error occured while deleting the leave',
        position: 'top',
        swipeable: true,
      });
    }
  };

  const showAlertBox = id => {
    setShowDeleteAlert(true);
    setDeleteAlertBoxContent({
      statusText: `Are you sure you want to delete this leave request?`,
      time: ``,
      confirm: () => handleDeleteLeave(id),
      cancel: () => setShowDeleteAlert(false),
    });
  };

  // For showing all leave list
  const showLeaveList = ({ item, index }) => {
    return (
      <View
        style={{
          width: '95%',
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
                <>
                  <View
                    style={{ display: 'flex', gap: 4, flexDirection: 'row' }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: Config.Colors.yellow,
                        padding: widthToDp(1),
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={[
                          styles.history_text_2,
                          {
                            color: Config.Colors.defaultColor,
                            padding: 1,
                          },
                        ]}
                      >
                        {item.status}
                      </Text>

                      {/* Delete button */}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: Config.Colors.errorText,
                        padding: widthToDp(1),
                        borderRadius: 8,
                      }}
                    >
                      <TouchableOpacity onPress={() => showAlertBox(item?.id)}>
                        <Text
                          style={[
                            styles.history_text_2,
                            {
                              color: Config.Colors.defaultColor,
                              padding: 1,
                            },
                          ]}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={{
                    padding: widthToDp(1),
                    borderRadius: 15,
                  }}
                  onPress={() => handleUserModal(item)}
                ></TouchableOpacity>
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
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  borderBottomWidth: 1,
                  borderStyle: 'dashed',
                  borderBottomColor: Config.Colors.borderColor,
                  width: widthToDp(90),
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
                    {item?.subject}
                  </Text>
                </Text>
                <Text style={styles.container_part_3_text_2}>
                  {t(Config.leave_req_text?.description)} :
                  <Text style={{ color: Config.Colors.textColor.textColor_2 }}>
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

  return (
    <View style={styles.container}>
      <View style={{ ...styles.body, gap: 10, marginTop: 5 }}>
        <View style={{ width: widthToDp(90) }}>
          {leaveListCountData?.length > 0 ? (
            <FlatList
              data={leaveListCountData}
              extraData={leaveListCountData}
              renderItem={item => showLeaveCount(item)}
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
                <View style={{ height: '95%' }}>
                  <FlatList
                    refreshing={loading}
                    data={leaveListData}
                    extraData={leaveListData}
                    renderItem={showLeaveList}
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
                    onRefresh={handleLeaveList}
                    ListFooterComponent={ListFooterComponent}
                  />
                </View>
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
          {showDeleteAlert ? (
            <AltertBox
              isModalVisible={showDeleteAlert}
              oonRequestClose={() => setShowDeleteAlert(false)}
              confirm={() => {
                deleteAlertBoxContent?.confirm();
                setShowDeleteAlert(false); // close after confirm
              }}
              cancel={() => setShowDeleteAlert(false)} 
              imageIcon={Icons?.check_icon}
              textMessage={{
                text1: deleteAlertBoxContent?.statusText,
              }}
            />
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
    backgroundColor: Config.Colors?.grey,
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
    // left:30,
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
export default React.memo(RequestLeaveHistory);
