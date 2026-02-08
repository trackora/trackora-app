import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SectionList,
} from "react-native";
import React from "react";
import { Header_2 } from "../../components/Header";
import * as Icons from "../../helpers/Icons";
import * as Config from "../../helpers/Config";
import * as Constants from "../../helpers/Constants";
import { heightToDp, widthToDp } from "../../helpers/Responsive";
import { apiPostService } from "../../helpers/services";
import { useFocusEffect } from "@react-navigation/native";
import { toLocaleDateString } from "../../helpers/utils";
import { SvgXml } from "react-native-svg";
import { NotFound_result } from "../../helpers/Svg";
import AltertBox from "../../components/AltertBox";
import { useAppSelector } from "../../redux/store";
import { isApiSuccess } from "../../helpers/Validation";

const Notification = ({ navigation, route }: any) => {
  const userData = useAppSelector((state) => state.login);
  const [notificationData, setNotificationData] = React.useState(null);
  const [statusModal, setStatusModal] = React.useState(false);
  const [statusAlertdata, setStatusAlertdata] = React.useState(null);
  const [totalLimit, setTotalLimit] = React.useState({
    limit: 5,
    start: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const goBackScreen = () => {
    navigation.goBack();
  };
  const getNotification = async (payload?: any) => {
    setLoading(true);
    const bodyData = {
      limit: totalLimit.limit,
      start: totalLimit.start,
      filter: {
        user_ids: payload?.userIds,
        notification_type: payload?.notificationType,
      },
    };
    let apiData = await apiPostService(
      Constants?.notification_list_api,
      bodyData,
    );
    let apiNotiTypeData = await apiPostService(
      Constants?.notification_type_api,
      bodyData,
    );
    // console.log("Notification Data", apiData?.data, apiNotiTypeData?.data)

    if (isApiSuccess(apiNotiTypeData) && isApiSuccess(apiData)) {
      setNotificationData(apiData?.data?.result?.data);
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getNotification();
    }, []),
  );
  const handleReadNotification = async (item: any) => {
    if (item?.status === 0) {
      const bodyData = {
        notification_id: item?.id,
      };
      const apiData = await apiPostService(
        Constants?.mark_read_notification_api,
        bodyData,
      );

      if (isApiSuccess(apiData)) {
        await getNotification();
      }
    } else {
      setStatusModal(true);
      setStatusAlertdata({
        statusText: "Notification Already Readed",
        time: `${toLocaleDateString()?.customTime}`,
        confirm: () => setStatusModal(false),
        cancel: () => setStatusModal(false),
      });
    }
  };

  const handleLoadMoreNotification = async () => {
    setLoading(true);
    if (!loading) {
      const bodyData = {
        limit: totalLimit?.limit,
        start: totalLimit?.start,
      };
      const apiData = await apiPostService(
        Constants.notification_list_api,
        bodyData,
      );
      if (isApiSuccess(apiData)) {
        setNotificationData((prv: any) => [
          ...prv,
          ...apiData?.data?.result?.data,
        ]);
        setTotalLimit((prv) => ({
          ...prv,
          start: prv.limit,
          limit: prv.limit + 10,
        }));
        setLoading(false);
      }
    }
  };
  const renderNotificationItem = React.useCallback(
    ({ item }: any) => {
      return (
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              width: widthToDp(90),
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: Config.Colors.themeColor,
              backgroundColor: item.status == 0 ? "#edebeb" : "#fff",
            }}
            onPress={() => handleReadNotification(item)}
          >
            <View
              style={{
                position: "absolute",
                width: "100%",
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor: Config.Colors.themeColor,
                  paddingLeft: 10,
                  paddingBottom: 4,
                  paddingRight: 10,
                  borderBottomLeftRadius: 20,
                  borderTopRightRadius: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {toLocaleDateString(item?.created_at)?.customValTimeString}
                </Text>
              </View>
            </View>
            <View
              style={{ paddingTop: 15, paddingLeft: 20, paddingBottom: 10 }}
            >
              <Text
                style={{
                  color: Config.Colors.black,
                  fontSize: 13,
                  fontFamily: Config.fontFamilys.Poppins_Bold,
                  lineHeight: 18,
                }}
              >
                {item?.title}
              </Text>
              <Text style={{ color: Config.Colors.black, fontSize: 13 }}>
                {item?.remark}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [notificationData],
  );

  const keyExtractor = React.useCallback((item: any) => item.id, []);

  const ListFooterComponent = () => {
    return (
      <TouchableOpacity style={{ marginBottom: heightToDp(10), marginTop: 20 }}>
        {loading ? (
          <ActivityIndicator size={35} color={Config.Colors.textColor.textColor_1} />
        ) : null}
      </TouchableOpacity>
    );
  };

  console.log("notificationData is----->>>>", notificationData);
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
      <View style={styles.body}>
        <View style={styles?.boxContainerIner}>
          {notificationData ? (
            <FlatList
              refreshing={loading}
              onRefresh={getNotification}
              data={notificationData}
              keyExtractor={(item: { id?: number }) => String(item?.id ?? '')}
              renderItem={renderNotificationItem}
              showsVerticalScrollIndicator={false}
              // renderSectionHeader={({ section: { title } }) => (
              //   <Text style={styles.header}>{title}</Text>
              // )}
              contentContainerStyle={{
                paddingBottom: 80,
              }}
              ListFooterComponent={ListFooterComponent}
              onEndReached={handleLoadMoreNotification}
            />
          ) : loading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <ActivityIndicator size={35} color={Config.Colors.themeColor} />
            </View>
          ) : (
            <View style={{ height: "100%" }}>
              <SvgXml xml={NotFound_result} />
            </View>
          )}

          {/* 
          {route?.params?.notificationCount === 0 ?
            <View style={{ height: '90%' }}>
              <SvgXml xml={NotFound_result} />
            </View>
            : null} */}

          {statusModal ? (
            <AltertBox
              isModalVisible={statusModal}
              onRequestClose={() => setStatusModal(false)}
              confirm={() => statusAlertdata?.confirm()}
              cancel={() => statusAlertdata?.cancel()}
              imageIcon={Icons?.check_icon}
              textMessage={{
                text1: statusAlertdata?.statusText,
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
  header: {
    fontSize: 15,
    fontFamily: Config.fontFamilys.Poppins_Bold,
    justifyContent: "center",
    alignItems: "center",
    color: Config.Colors.black,
    marginTop: 20,
  },
  body: {
    marginTop: 10,
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: "#000",
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: widthToDp(90),
    margin: 10,
    padding: 10,
  },
  boxContainer: {
    alignSelf: "center",
    // bottom: 10
  },
  boxContainerIner: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    // paddingBottom: 100,
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: "center",
    borderRadius: widthToDp(10),
    justifyContent: "center",
    padding: widthToDp(2),
  },
  notificationFilter: {
    borderWidth: 0.5,
    width: widthToDp(40),
    borderRadius: 5,
    padding: widthToDp(1),
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: widthToDp(2),
  },
});

export default React.memo(Notification);
