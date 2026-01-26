import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Header_2 } from "../../components/Header";
import * as Icons from "../../helpers/Icons";
import * as Config from "../../helpers/Config";
import * as Constants from "../../helpers/Constants";
import { heightToDp, widthToDp } from "../../helpers/Responsive";
import CustomModal from "../../components/CustomModal";
import { useFocusEffect } from "@react-navigation/native";
import { apiPostService } from "../../helpers/services";
import {
  CustomInput,
  CustomLinearButton,
} from "../../components/CustomElements";
import { handleCamera } from "../../helpers/utils";
import CustomImageVIew from "./CustomImageVIew";
import CustomMenu from "../../components/CustomMenu";
import CustomDocPiker from "../../components/CustomDocPiker";
import { useTranslation } from "react-i18next";
import { isApiSuccess } from "../../helpers/Validation";

const CustomModalAny = CustomModal as React.ComponentType<any>;
const CustomInputAny = CustomInput as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;
const CustomMenuAny = CustomMenu as React.ComponentType<any>;
const CustomDocPikerAny = CustomDocPiker as React.ComponentType<any>;

type DocumentsProps = {
  navigation: {
    goBack: () => void;
  };
};

type DocTypeItem = {
  doc_type_code?: string;
  doc_type_name?: string;
  name?: string;
};

type ErrorState = Record<string, string> | null;

const Documents: React.FC<DocumentsProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [docType, setDocType] = React.useState<DocTypeItem[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [docNumber, setDocNumber] = React.useState("");
  const [updateDoc, setUpdateDoc] = React.useState(true);
  const [fullImage, setFullImage] = React.useState(false);
  const [imagePath, setImagePath] = React.useState("");
  const [uploadLoader, setUploadLoader] = React.useState(false);
  const [base64Loader, setBase64Loader] = React.useState(false);
  const [openPickerModal, setOpenPickerModal] = React.useState(false);
  const [docTypeCheck, setDocTypeCheck] = React.useState("");
  const [currentDocumetData, setCurrentDocumetData] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [documetData, setDocumetData] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<ErrorState>(null);

  const handelFullImage = (img: string) => {
    setFullImage(true);
    setImagePath(img);
  };

  const handleUploadModal = async (type: string) => {
    setDocTypeCheck(type);
    setOpenPickerModal(!openPickerModal);
  };

  const getDocumentsType = async () => {
    const apiData = await apiPostService(Constants?.doc_type_list_api, {});
    if (isApiSuccess(apiData)) {
      setDocType(apiData?.data?.result?.data || []);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getDocumentsType();
    }, []),
  );

  const goBackScreen = () => {
    setUpdateDoc(true);
    setFullImage(false);
    navigation.goBack();
    setErrorMessage(null);
  };

  const handleDocumentUpload = async (item: DocTypeItem) => {
    setUploadLoader(true);
    const bodyData = { doc_type: item?.doc_type_code };
    const apiData = await apiPostService(
      Constants?.document_detail_api,
      bodyData,
    );
    if (isApiSuccess(apiData)) {
      setUploadLoader(false);
      setOpenModal(true);
      if (apiData?.data?.data?.document?.doc_type) {
        setCurrentDocumetData({ ...apiData?.data?.data?.document });
      } else {
        setCurrentDocumetData({
          ...item,
          doc_type: item?.doc_type_name ?? item?.name,
          images: ["", ""],
        });
      }
    }
  };

  const renderDocumentType = ({ item }: { item: DocTypeItem }) => {
    return (
      <CustomMenuAny
        item={{
          icon: Icons.upload_icon,
          title: item?.doc_type_name,
          tintColor: Config.Colors.secondary,
        }}
        bottomImg={Icons.arrow_forward}
        onPress={() => handleDocumentUpload(item)}
        tintColor2={Config.Colors.black}
        style={{
          box: {
            width: widthToDp(90),
            borderRadius: 10,
            elevation: 1,
          },
        }}
      />
    );
  };

  const uploadDoc = async (type: string, imageSide: string) => {
    setUploadLoader(true);
    const mediaData: any = await handleCamera("photo", type);
    const imageBodyData = {
      base64: `data:image/jpeg;base64,${mediaData?.data ?? ""}`,
    };

    const apiData = await apiPostService(
      Constants?.base64_to_file_api,
      imageBodyData,
    );

    if (apiData?.data?.status === "success") {
      if (imageSide === "front") {
        setDocumetData((prv) => ({
          ...(prv ?? {}),
          fromImage: apiData?.data?.response?.Location,
          fromImagePath: apiData?.data?.response?.uploadPath,
        }));
      } else {
        setDocumetData((prv) => ({
          ...(prv ?? {}),
          backImage: apiData?.data?.response?.Location,
          backImagePath: apiData?.data?.response?.uploadPath,
        }));
      }
      setOpenPickerModal(false);
      setUploadLoader(false);
    }
  };

  const onSubmit = async () => {
    if (documetData?.fromImage == null) {
      setErrorMessage((prev) => ({
        ...(prev ?? {}),
        fromImage: t(Config?.otherText?.required),
      }));
    } else if (docNumber === "") {
      setErrorMessage((prev) => ({
        ...(prev ?? {}),
        docNumber: t(Config?.otherText?.required),
      }));
    } else {
      setUploadLoader(true);
      const bodyData = {
        doc_type: currentDocumetData?.doc_type,
        doc_filename: documetData?.fromImagePath,
        doc_filename_1: documetData?.backImagePath,
        doc_type_value: docNumber,
      };
      const uploadDocData = await apiPostService(
        Constants?.update_profile_document_api,
        bodyData,
      );
      if (uploadDocData?.data?.status === "success") {
        setUpdateDoc(true);
        setUploadLoader(false);
        setOpenModal(false);
        setCurrentDocumetData(null);
        setDocNumber("");
        setDocumetData(null);
        setErrorMessage(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={t(Config.documentScreenText?.docs)}
        animated={true}
        onPressLeft={goBackScreen}
      />
      <View style={styles.body}>
        <View style={styles.boxContainerIner}>
          <FlatList
            data={docType}
            renderItem={renderDocumentType}
            keyExtractor={(_, index) => String(index)}
            style={{ height: heightToDp(70) }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          />
          {uploadLoader ? (
            <TouchableOpacity
              style={{
                height: "90%",
                justifyContent: "center",
                position: "absolute",
                zIndex: 9999,
                alignItems: "center",
                width: "100%",
              }}
            >
              <ActivityIndicator
                size={35}
                color={
                  Config.Colors.textColor?.textColor_1 ??
                  Config.Colors.themeColor
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {openModal ? (
          <CustomModalAny
            modalVisible={openModal}
            onRequestClose={() => {
              setOpenModal(!openModal);
              setUpdateDoc(true);
              setFullImage(false);
              setErrorMessage(null);
            }}
            alignItems="center"
            justifyContent="center"
            disableOnPress={false}
            showHeader={true}
          >
            <ScrollView
              style={{
                width: widthToDp(100),
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: widthToDp(2),
                paddingBottom: widthToDp(10),
              }}
            >
              <Header_2
                leftImage={Icons.arrow_back}
                commonWidth={widthToDp(12)}
                commonHeight={heightToDp(5)}
                leftText={
                  !updateDoc
                    ? t(Config.documentScreenText?.add_doc)
                    : currentDocumetData?.doc_type
                }
                animated={true}
                onPressLeft={() => {
                  setUpdateDoc(true);
                  setFullImage(false);
                  setOpenModal(!openModal);
                  setErrorMessage(null);
                }}
                rightImage={!updateDoc ? Icons.document : Icons.edit_icon}
                tintColorRight={Config.Colors.defaultColor}
                onPressRight={() => setUpdateDoc(!updateDoc)}
              />

              {uploadLoader ? (
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
              ) : null}

              <View
                style={{
                  width: widthToDp(100),
                  height: heightToDp(80),
                  alignItems: "center",
                }}
              >
                <View style={{ gap: 15, width: "90%", marginTop: 10 }}>
                  {!updateDoc ? (
                    <>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          height: widthToDp(50),
                          borderRadius: 10,
                          alignItems: "center",
                          backgroundColor: "#FFF",
                          borderWidth: 1,
                          borderColor: errorMessage?.fromImage
                            ? Config.Colors.errorFieldBorder
                            : Config.Colors.borderColor,
                        }}
                        onPress={() => handleUploadModal("front")}
                      >
                        <View
                          style={{
                            width: "100%",
                            height: widthToDp(50),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {documetData?.fromImage ? (
                            <>
                              <Image
                                source={{ uri: documetData?.fromImage }}
                                style={{
                                  width: "100%",
                                  height: widthToDp(50),
                                  resizeMode: "cover",
                                  borderRadius: 10,
                                }}
                                onLoadStart={() => setBase64Loader(true)}
                                onLoadEnd={() => setBase64Loader(false)}
                              />
                              {base64Loader ? (
                                <View
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "absolute",
                                    zIndex: 1,
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
                              ) : null}
                            </>
                          ) : (
                            <>
                              <Image
                                source={Icons?.upload_icon}
                                style={{
                                  width: widthToDp(80),
                                  height: widthToDp(20),
                                  resizeMode: "contain",
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: widthToDp(5),
                                  color: Config.Colors.themeColor,
                                  fontFamily:
                                    Config.fontFamilys.Poppins_SemiBold,
                                }}
                              >
                                {t(Config.documentScreenText?.front_img)}
                              </Text>
                            </>
                          )}
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          width: "100%",
                          height: widthToDp(50),
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#FFF",
                          borderColor: Config.Colors.borderColor,
                          borderWidth: 1,
                        }}
                        onPress={() => handleUploadModal("back")}
                      >
                        <View
                          style={{
                            width: "100%",
                            height: widthToDp(50),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {documetData?.backImage ? (
                            <>
                              <Image
                                source={{ uri: documetData?.backImage }}
                                style={{
                                  width: "100%",
                                  height: widthToDp(50),
                                  resizeMode: "cover",
                                  borderRadius: 10,
                                }}
                                onLoadStart={() => setBase64Loader(true)}
                                onLoadEnd={() => setBase64Loader(false)}
                              />
                              {base64Loader ? (
                                <View
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "absolute",
                                    zIndex: 1,
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
                              ) : null}
                            </>
                          ) : (
                            <>
                              <Image
                                source={Icons?.upload_icon}
                                style={{
                                  width: widthToDp(80),
                                  height: widthToDp(20),
                                  resizeMode: "contain",
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: widthToDp(5),
                                  color: Config.Colors.themeColor,
                                  fontFamily:
                                    Config.fontFamilys.Poppins_SemiBold,
                                }}
                              >
                                {t(Config.documentScreenText?.back_img)}
                              </Text>
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={{ gap: 30 }}>
                      <TouchableOpacity style={{ width: "100%", gap: 5 }}>
                        <View>
                          <Text
                            style={{
                              fontSize: widthToDp(5),
                              color: Config.Colors.themeColor,
                              fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            }}
                          >
                            {t(Config.documentScreenText?.front_img)}
                          </Text>
                        </View>
                        {currentDocumetData?.doc_filename_path ? (
                          <TouchableOpacity
                            onPress={() =>
                              handelFullImage(
                                `${currentDocumetData?.doc_filename_path}`,
                              )
                            }
                            style={{
                              height: widthToDp(50),
                              width: "100%",
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#FFF",
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={{
                                uri: `${currentDocumetData?.doc_filename_path}`,
                              }}
                              style={{
                                width: "100%",
                                height: widthToDp(50),
                                resizeMode: "cover",
                                borderRadius: 10,
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={{
                              height: widthToDp(50),
                              width: "100%",
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#FFF",
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={Icons?.default_document}
                              style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity style={{ width: "100%", gap: 5 }}>
                        <Text
                          style={{
                            fontSize: widthToDp(5),
                            color: Config.Colors.themeColor,
                            fontFamily: Config.fontFamilys.Poppins_SemiBold,
                          }}
                        >
                          {t(Config.documentScreenText?.back_img)}
                        </Text>
                        {currentDocumetData?.doc_filename_1_path ? (
                          <TouchableOpacity
                            onPress={() =>
                              handelFullImage(
                                `${currentDocumetData?.doc_filename_1_path}`,
                              )
                            }
                            style={{
                              height: widthToDp(50),
                              width: "100%",
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#FFF",
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={{
                                uri: `${currentDocumetData?.doc_filename_1_path}`,
                              }}
                              style={{
                                width: "100%",
                                height: widthToDp(50),
                                resizeMode: "cover",
                                borderRadius: 10,
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={{
                              height: widthToDp(50),
                              width: "100%",
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#FFF",
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={Icons?.default_document}
                              style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>

                      <View
                        style={{
                          width: "100%",
                          backgroundColor: Config.Colors.secondary,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 20,
                          padding: widthToDp(3),
                          borderRadius: 10,
                        }}
                      >
                        <Image
                          source={Icons.document}
                          style={{
                            width: widthToDp(10),
                            height: widthToDp(10),
                            tintColor: "#FFF",
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              fontSize: widthToDp(3),
                              color: Config.Colors.defaultColor,
                              fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            }}
                          >
                            {t(Config.documentScreenText?.doc_number)}
                          </Text>
                          <Text
                            style={{
                              fontSize: widthToDp(5),
                              color: Config.Colors.defaultColor,
                              fontFamily: Config.fontFamilys.Poppins_SemiBold,
                            }}
                          >
                            {currentDocumetData?.doc_type_value}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                {!updateDoc ? (
                  <View
                    style={{ justifyContent: "flex-end", alignItems: "center" }}
                  >
                    <View
                      style={{ gap: widthToDp(2), marginTop: widthToDp(3) }}
                    >
                      <Text
                        style={{
                          fontSize: widthToDp(4),
                          color: Config.Colors.themeColor,
                          fontFamily: Config.fontFamilys.Poppins_SemiBold,
                        }}
                      >
                        {t(Config.documentScreenText?.doc_number)}
                      </Text>
                      <CustomInputAny
                        commonWidth={widthToDp(90)}
                        commonHeight={widthToDp(12)}
                        keyboardType="default"
                        autoComplete="cc-csc"
                        commmonBorderRadius={10}
                        errorMessage={errorMessage?.docNumber ?? ""}
                        borderColor={
                          errorMessage?.docNumber
                            ? Config.Colors.errorFieldBorder
                            : Config.Colors.borderColor
                        }
                        onChangeText={(text: string) => {
                          setDocNumber(text);
                          setErrorMessage(null);
                        }}
                        leftImage={Icons.document}
                        lable=""
                        countryCode=""
                      />
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        <CustomLinearButtonAny
                          commonWidth={widthToDp(90)}
                          text={t(Config.otherText?.submit)}
                          onPress={onSubmit}
                          color={Config.Colors.defaultColor}
                          Icons={Icons.edit_picture}
                          borderRadius={6}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </CustomModalAny>
        ) : null}

        {fullImage ? (
          <CustomModalAny
            modalVisible={fullImage}
            onRequestClose={() => setFullImage(!fullImage)}
            backgroundColor="#000"
            transparent={false}
            showHeader={true}
            headerText=""
          >
            <CustomImageVIew
              handleFullImage={() => setFullImage(!fullImage)}
              imagePath={imagePath}
            />
          </CustomModalAny>
        ) : null}

        {openPickerModal ? (
          <CustomModalAny
            modalVisible={openPickerModal}
            onRequestClose={() => setOpenPickerModal(!openPickerModal)}
            transparent={true}
            showHeader={true}
            headerText=""
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <CustomDocPikerAny
              uploadFile={(type: string) => uploadDoc(type, docTypeCheck)}
              onRequestClose={() => setOpenPickerModal(!openPickerModal)}
            />
          </CustomModalAny>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    marginTop: widthToDp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainerIner: {
    width: "92%",
    marginBottom: widthToDp(16),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 30,
  },
});

export default React.memo(Documents);
