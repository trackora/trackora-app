import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  ListRenderItemInfo,
} from "react-native";
import * as Icons from "../../helpers/Icons";
import * as Config from "../../helpers/Config";
import * as Constants from "../../helpers/Constants";
import { heightToDp, widthToDp } from "../../helpers/Responsive";
import { useSelector } from "react-redux";
import { handleCamera, toLocaleDateString } from "../../helpers/utils";
import { apiPostService } from "../../helpers/services";
import { useFocusEffect } from "@react-navigation/native";
import { CustomInputBox } from "../../components/CustomElements";
import CustomModal from "../../components/CustomModal";
import CustomImageVIew from "./CustomImageVIew";
import { useTranslation } from "react-i18next";

type RootState = {
  login?: any;
};

type ChatMessage = {
  id?: number | string;
  text?: string;
  filename?: string;
  created_on?: string | number | Date;
};

type TodayNotesProps = {
  navigation: any;
  route: any;
};

const TodayNotes: React.FC<TodayNotesProps> = ({ navigation, route }) => {
  const [chatMessage, setChatMessage] = React.useState<ChatMessage[]>([]);
  const [message, setMessage] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const getTokenData = useSelector((state: RootState) => state.login);
  const [fullImage, setFullImage] = React.useState(false);
  const [imagePath, setImagePath] = React.useState("");
  const [pageLoader, setPageLoader] = React.useState(false);
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList<ChatMessage> | null>(null);

  const handelFullImage = (img: string) => {
    setFullImage(true);
    setImagePath(img);
  };

  const getMessage = async () => {
    setPageLoader(true);
    const bodyData = {
      limit: 50,
      start: 0,
      user_id: getTokenData?.data?.loginData?.id,
      filter: {},
    };
    const apiData = await apiPostService(Constants?.notes_list_api, bodyData);
    if (apiData?.data?.result?.data) {
      setPageLoader(false);
      return setChatMessage(apiData?.data?.result?.data);
    }
    setPageLoader(false);
  };

  const sendMessage = async () => {
    const chatBodyData = {
      user_id: getTokenData?.data?.loginData?.id,
      username: getTokenData?.data?.loginData?.name,
      text: message,
      filename: "",
    };
    const chatApiRes = await apiPostService(
      Constants?.add_notes_api,
      chatBodyData,
    );
    if (chatApiRes?.data?.status === "success") {
      await getMessage();
      setMessage("");
    }
  };

  const uploadDoc = async (type?: "openPicker" | "openCamera") => {
    const mediaData = await handleCamera("photo", type);
    const bodyData = {
      appType: "sfa",
      base64: `data:image/jpeg;base64,${mediaData?.data ?? ""}`,
    };
    setOpenModal(false);
    if (bodyData) {
      const apiData = await apiPostService(
        Constants?.base64_to_file_api,
        bodyData,
      );
      if (apiData?.data?.status === "success") {
        const chatBodyData = {
          user_id: getTokenData?.data?.loginData?.id,
          username: getTokenData?.data?.loginData?.name,
          text: message,
          filename: "uploads/2023-07/1789438732834.jpeg",
        };
        const chatApiRes = await apiPostService(
          Constants?.add_notes_api,
          chatBodyData,
        );
        if (chatApiRes?.data?.status === "success") {
          getMessage();
          setMessage("");
        }
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getMessage();
    }, []),
  );

  const keyExtractor = React.useCallback(
    (item: ChatMessage, index: number) => String(item?.id ?? index),
    [],
  );

  const renderItemMessage = ({ item }: ListRenderItemInfo<ChatMessage>) => {
    const formattedDate = toLocaleDateString(
      item?.created_on ?? new Date(),
    ) as { customDateTime?: string };

    return (
      <View style={{ width: "100%" }}>
        <View style={{ alignItems: "flex-end", paddingRight: 10, gap: 10 }}>
          <View style={{ padding: 10 }}>
            <View
              style={{
                backgroundColor: Config.Colors.themeColor,
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: Config.Colors.defaultColor }}>
                {formattedDate?.customDateTime}
              </Text>
              <Text
                style={{
                  color: Config.Colors.defaultColor,
                  alignSelf: "flex-end",
                }}
              >
                {item?.text}
              </Text>
            </View>
          </View>
          {item?.filename ? (
            <TouchableOpacity
              onPress={() => handelFullImage(`${item?.filename}`)}
              style={{
                borderRadius: 2,
                borderColor: Config.Colors.black,
                width: widthToDp(50),
                height: widthToDp(30),
                backgroundColor: "#000",
              }}
            >
              <Image
                source={{ uri: `${item?.filename}` }}
                style={{
                  width: widthToDp(50),
                  height: widthToDp(30),
                  resizeMode: "cover",
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%", height: "100%", marginTop: 10 }}>
        <View style={{ height: "90%" }}>
          {chatMessage.length ? (
            <FlatList
              refreshing={pageLoader}
              onRefresh={getMessage}
              ref={flatListRef}
              data={chatMessage}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              extraData={chatMessage}
              renderItem={renderItemMessage}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={0.1}
              removeClippedSubviews={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 0 }}
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ActivityIndicator
                size={35}
                color={
                  Config.Colors.textColor?.textColor_1 ??
                  Config.Colors.themeColor
                }
              />
            </View>
          )}
        </View>

        <View
          style={{
            width: widthToDp(100),
            justifyContent: "center",
            alignItems: "flex-end",
            bottom: 0,
            flexDirection: "row",
            alignSelf: "center",
            gap: 3,
            zIndex: 9999,
            backgroundColor: Config.Colors.bodyBg,
            height: "9%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: Config.Colors.themeColor,
              width: widthToDp(11),
              height: heightToDp(5.5),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
            }}
            onPress={() => setOpenModal(true)}
          >
            <Image
              source={Icons.camera_icon}
              tintColor={"#fff"}
              style={{ width: widthToDp(5), height: widthToDp(5) }}
            />
          </TouchableOpacity>
          <CustomInputBox
            commonWidth={widthToDp(75)}
            placeholder={t(Config.todayNotesSreenText?.message)}
            keyboardType={"default"}
            autoComplete={"cc-csc"}
            commmonBorderRadius={100}
            borderColor={Config.Colors.themeColor}
            onChangeText={(text: string) => setMessage(text)}
            inputValue={message}
            errorMessage={""}
            numberOfLines={1}
            autoCapitalize="none"
            leftImage={null}
            tintColor={Config.Colors.themeColor}
            rightImage={null}
            commonBackgroundColor={Config.Colors.bodyBg}
            CommonBorderWidth={1}
            commonElevation={0}
            onFocusFunction={() => {}}
            editable={true}
            multiline={false}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Config.Colors.themeColor,
              width: widthToDp(11),
              height: heightToDp(5.5),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
            }}
            disabled={!message}
            onPress={sendMessage}
          >
            <Image
              source={Icons.send_icon}
              tintColor={"#fff"}
              style={{ width: widthToDp(5), height: widthToDp(5) }}
            />
          </TouchableOpacity>
        </View>

        <View>
          <CustomModal
            modalVisible={openModal}
            onRequestClose={() => setOpenModal(!openModal)}
            alignItems="flex-end"
            justifyContent="flex-end"
            disableOnPress={true}
          >
            <View
              style={{
                width: widthToDp(100),
                height: heightToDp(15),
                backgroundColor: "#fff",
                borderRadius: widthToDp(2),
                paddingLeft: widthToDp(5),
                paddingRight: widthToDp(5),
                paddingBottom: widthToDp(5),
              }}
            >
              <View style={{ width: "100%" }}>
                <View>
                  <Text
                    style={{
                      fontSize: widthToDp(5),
                      fontFamily: Config.fontFamilys.Poppins_Bold,
                    }}
                  >
                    {t(Config.todayNotesSreenText?.photos)}
                  </Text>
                </View>
                <View style={{ gap: widthToDp(2), marginTop: widthToDp(3) }}>
                  <TouchableOpacity
                    style={{ flexDirection: "row", gap: widthToDp(2) }}
                    onPress={() => uploadDoc()}
                  >
                    <Image
                      source={Icons?.gallery_icon}
                      style={{ width: widthToDp(4), height: heightToDp(2) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: widthToDp(3.5),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {t(Config.todayNotesSreenText?.from_photos)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: "row", gap: widthToDp(2) }}
                    onPress={() => uploadDoc("openCamera")}
                  >
                    <Image
                      source={Icons?.camera_icon}
                      style={{ width: widthToDp(4), height: heightToDp(2) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: widthToDp(3.5),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {t(Config.todayNotesSreenText?.take_picture)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CustomModal>
          {fullImage ? (
            <CustomModal
              modalVisible={fullImage}
              onRequestClose={() => setFullImage(!fullImage)}
              backgroundColor="#000"
              transparent={false}
            >
              <CustomImageVIew
                handleFullImage={() => setFullImage(!fullImage)}
                imagePath={imagePath}
              />
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
  },
  boxContainerIner: {
    marginBottom: widthToDp(16),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
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
});

export default React.memo(TodayNotes);
