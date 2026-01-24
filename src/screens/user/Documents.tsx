import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import React from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { SvgCalender } from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useSelector } from 'react-redux';
import CustomModal from '../../components/CustomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService } from '../../helpers/services';
import {
  CustomButton,
  CustomInput,
  CustomInputBox,
  CustomLinearButton,
} from '../../components/CustomElements';
import { handleCamera } from '../../helpers/utils';
import CustomImageVIew from './CustomImageVIew';
import CustomMenu from '../../components/CustomMenu';
import CustomDocPiker from '../../components/CustomDocPiker';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const Documents = ({ navigation }) => {
  const ref = React.useRef(null);
  const { t } = useTranslation();
  const [docType, setDocType] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [docNumber, setDocNumber] = React.useState('');
  const [updateDoc, setUpdateDoc] = React.useState(true);
  const [fullImage, setFullImage] = React.useState(false);
  const [imagePath, setImagePath] = React.useState('');
  const [uploadLoader, setUploadLoader] = React.useState(false);
  const [base64Loader, setBase64Loader] = React.useState(false);
  const [openPickerModal, setOpenPickerModal] = React.useState(false);
  const [docTypeCheck, setDocTypeCheck] = React.useState('');
  const [currentDocumetData, setCurrentDocumetData] = React.useState(null);
  const [documetData, setDocumetData] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const handelFullImage = img => {
    setFullImage(true);
    setImagePath(img);
  };
  const handleUploadModal = async type => {
    setDocTypeCheck(type);
    setOpenPickerModal(!openPickerModal);
  };

  // For Fetching all the document with their types
  const getDocumentsType = async () => {
    let bodyData = {};
    const apiData = await apiPostService(
      Constants?.doc_type_list_api,
      bodyData,
    );
    if (isApiSuccess(apiData)) {
      setDocType(apiData?.data?.result.data);
    }
  };

  // For calling the getDocumentsType api
  useFocusEffect(
    React.useCallback(() => {
      getDocumentsType();
    }, []),
  );

  // For going back to previous screen
  const goBackScreen = () => {
    setUpdateDoc(true);
    setFullImage(false);
    navigation.goBack();
    setErrorMessage(null);
  };

  // For uploading the document
  const handleDocumentUpload = async item => {
    setUploadLoader(true);
    // setBase64Loader(true);
    let bodyData = {
      doc_type: item?.doc_type_code,
    };
    if (bodyData) {
      let apiData = await apiPostService(
        Constants?.document_detail_api,
        bodyData,
      );
      if (isApiSuccess(apiData)) {
        setUploadLoader(false);
        // setBase64Loader(false)
        setOpenModal(true);
        if (apiData?.data?.data?.document?.doc_type) {
          setCurrentDocumetData({ ...apiData?.data?.data?.document });
        } else {
          setCurrentDocumetData({
            ...item,
            doc_type: item.name,
            images: ['', ''],
          });
        }
      } else {
      }
    }
  };

  // For showing various document type like Aadhar, Pan Card
  const renderDocumentType = ({ item }) => {
    return (
      <>
        <CustomMenu
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
      </>
    );
  };

  const uploadDoc = async (type, imageSide) => {
    setUploadLoader(true);
    // setBase64Loader(true)
    const mediaData = await handleCamera('photo', type);
    // console.log("mediaData", mediaData, imageSide);
    let imageBodyData = {
      base64: `data:image/jpeg;base64,${mediaData.data}`,
    };
    if (imageSide === 'front' && mediaData?.data) {
      let apiData = await apiPostService(
        Constants?.base64_to_file_api,
        imageBodyData,
      );
      // console.log("apiData-----front", apiData);
      if (apiData?.data?.status === 'success') {
        setDocumetData(prv => ({
          ...prv,
          fromImage: apiData?.data?.response?.Location,
          fromImagePath: apiData?.data?.response?.uploadPath,
        }));
        setOpenPickerModal(false);
        // setBase64Loader(false)
        setUploadLoader(false);
      }
    } else {
      let apiData = await apiPostService(
        Constants?.base64_to_file_api,
        imageBodyData,
      );
      // console.log("apiData-----back", apiData);
      if (apiData?.data?.status === 'success') {
        setDocumetData(prv => ({
          ...prv,
          backImage: apiData?.data?.response.Location,
          backImagePath: apiData?.data?.response?.uploadPath,
        }));
        setOpenPickerModal(false);
        setUploadLoader(false);
        // setBase64Loader(false)
      }
    }
  };

  const onSubmit = async () => {
    // console.log("documetData?.fromImage",documetData?.fromImage)
    if (documetData?.fromImage == undefined) {
      setErrorMessage(prv => ({
        ...prv,
        fromImage: t(Config?.otherText?.required),
      }));
    } else if (docNumber == '') {
      setErrorMessage(prv => ({
        ...prv,
        docNumber: t(Config?.otherText?.required),
      }));
    } else {
      setUploadLoader(true);
      // console.log("calltest")
      let bodyData = {
        doc_type: currentDocumetData?.doc_type,
        doc_filename: documetData?.fromImagePath,
        doc_filename_1: documetData?.backImagePath,
        doc_type_value: docNumber,
      };
      if (bodyData) {
        let uploadDocData = await apiPostService(
          Constants?.update_profile_document_api,
          bodyData,
        );
        // console.log("uploadDocData", uploadDocData, bodyData)
        if (uploadDocData?.data?.status === 'success') {
          setUpdateDoc(true);
          setUploadLoader(false);
          setOpenModal(false);
          setCurrentDocumetData(null);
          setDocNumber('');
          setDocumetData(null);
          setErrorMessage(null);
          // apiData?.data?.response;
          // Location,fileName,uploadPath
        }
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
        <View style={styles?.boxContainerIner}>
          <FlatList
            data={docType}
            renderItem={renderDocumentType}
            keyExtractor={(item, index) => String(index)}
            style={{ height: heightToDp(70) }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          />
          {uploadLoader ? (
            <TouchableOpacity
              style={{
                height: '90%',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 9999,
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ActivityIndicator size={35} color={Config.Colors.textColor} />
            </TouchableOpacity>
          ) : null}
        </View>
        {openModal ? (
          <CustomModal
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
            {/* <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}> */}

            <ScrollView
              style={{
                width: widthToDp(100),
                height: '100%',
                backgroundColor: '#fff',
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
                onPressRight={() => {
                  setUpdateDoc(!updateDoc);
                }}
              />

              {uploadLoader ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <ActivityIndicator
                    size={35}
                    color={Config.Colors.textColor}
                  />
                </View>
              ) : null}

              <View
                style={{
                  width: widthToDp(100),
                  height: heightToDp(80),
                  alignItems: 'center',
                }}
              >
                <View style={{ gap: 15, width: '90%', marginTop: 10 }}>
                  {/* <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} onPress={() => setUpdateDoc(!updateDoc)}>
                    <Text style={{ color: Config.Colors.black }}>{updateDoc ? "Edit" : "View"}</Text>
                  </TouchableOpacity> */}
                  {!updateDoc ? (
                    <>
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          height: widthToDp(50),
                          borderRadius: 10,
                          alignItems: 'center',
                          backgroundColor: '#FFF',
                          // elevation:1,
                          // borderColor: Config.Colors.borderColor,

                          borderWidth: 1,
                          borderColor: errorMessage?.fromImage
                            ? Config.Colors.errorFieldBorder
                            : Config.Colors.borderColor,
                        }}
                        onPress={() => handleUploadModal('front')}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: widthToDp(50),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {documetData?.fromImage ? (
                            <>
                              <Image
                                source={{ uri: documetData?.fromImage }}
                                style={{
                                  width: '100%',
                                  height: widthToDp(50),
                                  resizeMode: 'cover',
                                  borderRadius: 10,
                                }}
                                onLoadStart={() => setBase64Loader(true)}
                                onLoadEnd={() => setBase64Loader(false)}
                              />
                              {base64Loader ? (
                                <View
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    zIndex: 1,
                                  }}
                                >
                                  <ActivityIndicator
                                    size={35}
                                    color={Config.Colors.textColor}
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
                                  resizeMode: 'contain',
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
                          width: '100%',
                          height: widthToDp(25),
                          justifyContent: 'center',
                          width: '100%',
                          height: widthToDp(50),
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#FFF',
                          // elevation:1,
                          borderColor: Config.Colors.borderColor,
                          borderWidth: 1,
                        }}
                        onPress={() => handleUploadModal('back')}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: widthToDp(50),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {documetData?.backImage ? (
                            <>
                              <Image
                                source={{ uri: documetData?.backImage }}
                                style={{
                                  width: '100%',
                                  height: widthToDp(50),
                                  resizeMode: 'cover',
                                  borderRadius: 10,
                                }}
                                onLoadStart={() => setBase64Loader(true)}
                                onLoadEnd={() => setBase64Loader(false)}
                              />
                              {base64Loader ? (
                                <View
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    zIndex: 1,
                                  }}
                                >
                                  <ActivityIndicator
                                    size={35}
                                    color={Config.Colors.textColor}
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
                                  resizeMode: 'contain',
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
                      <TouchableOpacity style={{ width: '100%', gap: 5 }}>
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
                              width: '100%',
                              justifyContent: 'center',
                              width: '100%',
                              height: widthToDp(50),
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FFF',
                              // elevation:1,
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={{
                                uri: `${currentDocumetData?.doc_filename_path}`,
                              }}
                              style={{
                                width: '100%',
                                height: widthToDp(50),
                                resizeMode: 'cover',
                                borderRadius: 10,
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={{
                              height: widthToDp(50),
                              width: '100%',
                              justifyContent: 'center',
                              width: '100%',
                              height: widthToDp(50),
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FFF',
                              // elevation:1,
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={Icons?.default_document}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: '100%', gap: 5 }}>
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
                              width: '100%',
                              justifyContent: 'center',
                              width: '100%',
                              height: widthToDp(50),
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FFF',
                              // elevation:1,
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={{
                                uri: `${currentDocumetData?.doc_filename_1_path}`,
                              }}
                              style={{
                                width: '100%',
                                height: widthToDp(50),
                                resizeMode: 'cover',
                                borderRadius: 10,
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={{
                              height: widthToDp(50),
                              width: '100%',
                              justifyContent: 'center',
                              width: '100%',
                              height: widthToDp(50),
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FFF',
                              // elevation:1,
                              borderColor: Config.Colors.borderColor,
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={Icons?.default_document}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: Config.Colors.secondary,
                          flexDirection: 'row',
                          alignItems: 'center',
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
                            tintColor: '#FFF',
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
                        {/* <Text style={{ fontSize: widthToDp(3.5), color: Config.Colors.black }}></Text> */}
                      </View>
                    </View>
                  )}
                </View>
                {!updateDoc ? (
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
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
                      <CustomInput
                        commonWidth={widthToDp(90)}
                        commonHeight={widthToDp(12)}
                        keyboardType={'default'}
                        autoComplete={'cc-csc'}
                        commmonBorderRadius={10}
                        errorMessage={
                          errorMessage?.docNumber ? errorMessage?.docNumber : ''
                        }
                        borderColor={
                          errorMessage?.docNumber
                            ? Config.Colors.errorFieldBorder
                            : Config.Colors.borderColor
                        }
                        onChangeText={text => {
                          setDocNumber(text);
                          setErrorMessage(null);
                        }}
                        // inputValue={message}
                        leftImage={Icons.document}
                        // onSubmitEditing={() => onSubmit()}
                      />

                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        <TouchableOpacity style={{ zIndex: 999 }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <CustomLinearButton
                              commonWidth={widthToDp(90)}
                              text={t(Config.otherText?.submit)}
                              onPress={() => onSubmit()}
                              color={Config.Colors.defaultColor}
                              Icons={Icons.edit_picture}
                              borderRadius={6}
                            />
                          </View>
                        </TouchableOpacity>
                        {/* <CustomButton
                          commonWidth={widthToDp(40)}
                          text={"Submit"}
                          onPress={() => onSubmit()}
                          disabled={docNumber ? false : true}
                          backgroundColor={docNumber ? Config.Colors.themeColor : '#9ba2ad'}
                          color={"#FFF"}
                        /> */}
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
          </CustomModal>
        ) : null}

        {fullImage ? (
          <CustomModal
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
          </CustomModal>
        ) : null}
        {openPickerModal ? (
          <CustomModal
            modalVisible={openPickerModal}
            onRequestClose={() => setOpenPickerModal(!openPickerModal)}
            // backgroundColor='#000'
            transparent={true}
            showHeader={true}
            headerText=""
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <CustomDocPiker
              uploadFile={type => uploadDoc(type, docTypeCheck)}
              onRequestClose={() => setOpenPickerModal(!openPickerModal)}
            />
          </CustomModal>
        ) : null}
        {/* <View style={styles.loadingContainer}>
          {loading && (
            <ActivityIndicator size="large" color={Config.Colors.themeColor} />
          )}
        </View> */}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  // container: {
  //   flex: 1
  // },
  container: {
    flex: 1,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: widthToDp(4),
    flexDirection: 'row',
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    color: '#000',
    color: Config.Colors.textColor.textColor_2,
  },
  boxContainer: {
    alignSelf: 'center',
    // justifyContent: 'center'
    // bottom: 10
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: widthToDp(40),
  },
  body: {
    marginTop: widthToDp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainerIner: {
    width: '92%',
    marginBottom: widthToDp(16),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor: '#000',
    paddingBottom: 30,
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(8),
    height: heightToDp(4),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2),
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: '#000',
    opacity: 0.6,
  },
});

export default React.memo(Documents);
