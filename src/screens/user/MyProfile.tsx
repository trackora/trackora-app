import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService, getProfileData } from '../../helpers/services';
import { login } from '../../redux/slices/login.slice';
import { handleCamera, toLocaleDateString } from '../../helpers/utils';
import CustomModal from '../../components/CustomModal';
import CustomImageVIew from './CustomImageVIew';
import CustomDocPiker from '../../components/CustomDocPiker';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const MyProfile = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const getTokenData = useSelector(state => state.login);
  const [openModal, setOpenModal] = React.useState(false);
  const [imgLoader, setImgLoader] = React.useState(false);
  const [fullImage, setFullImage] = React.useState(false);
  const [imagePath, setImagePath] = React.useState('');
  const { t } = useTranslation();
  const [openPickerModal, setOpenPickerModal] = React.useState(false);
  const handelFullImage = img => {
    setFullImage(true);
    setImagePath(img);
  };
  const goBackScreen = () => navigation.goBack();
  const profileData = async () => {
    const apiData = await getProfileData();
    if (isApiSuccess(apiData)) {
      let userDetails = {
        ...getTokenData?.data,
        profileData: apiData?.data?.result,
      };
      dispatch(login(userDetails));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      profileData();
    }, []),
  );
  const uploadProfile = async type => {
    const mediaData = await handleCamera('photo', type);
    let bodyData = { base64: `data:image/jpeg;base64,${mediaData?.data}` };
    setOpenModal(false);
    if (bodyData) {
      setImgLoader(true);
      let apiData = await apiPostService(
        Constants.update_profile_api,
        bodyData,
      );
      if (apiData?.data?.status === 'success') {
        profileData();
        setImgLoader(false);
      } else {
        setImgLoader(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ zIndex: 9999 }}>
        <Header_2
          leftImage={Icons.arrow_back}
          commonWidth={widthToDp(12)}
          commonHeight={heightToDp(5)}
          leftText={t(Config.myProfileText?.profile)}
          animated={true}
          onPressLeft={goBackScreen}
        />
      </View>
      {getTokenData?.data?.profileData?.detail ? (
        <ScrollView style={{ bottom: widthToDp(10), marginTop: heightToDp(3) }}>
          <View style={styles.body}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: widthToDp(5),
                paddingTop: widthToDp(8),
                paddingBottom: widthToDp(5),
              }}
            >
              {getTokenData?.data?.profileData?.detail?.profile_image ? (
                <TouchableOpacity
                  onPress={() =>
                    handelFullImage(
                      getTokenData?.data?.profileData?.detail?.profile_image,
                    )
                  }
                >
                  {imgLoader ? (
                    <ActivityIndicator
                      color={Config.Colors.themeColor}
                      size={75}
                      style={{
                        position: 'absolute',
                        left: 35,
                        zIndex: 1,
                        top: 35,
                      }}
                    />
                  ) : null}
                  <Image
                    source={{
                      uri: getTokenData?.data?.profileData?.detail
                        ?.profile_image,
                    }}
                    style={{
                      width: widthToDp(40),
                      height: widthToDp(40),
                      borderRadius: 20,
                      borderColor: Config.Colors.borderColor,
                    }}
                    resizeMode="contain"
                    onLoadStart={() => setImgLoader(true)}
                    onLoadEnd={() => setImgLoader(false)}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                      backgroundColor: Config.Colors.bodyBg,
                      borderRadius: 10,
                      elevation: 1,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: Config.Colors.defaultColor,
                      borderWidth: 1,
                    }}
                    onPress={() => setOpenModal(!openModal)}
                  >
                    <Image
                      source={Icons.camera_icon}
                      style={{
                        width: 40,
                        height: 20,
                        borderRadius: widthToDp(0),
                        tintColor: Config.Colors.secondary,
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setOpenModal(!openModal)}>
                  <Image
                    source={Icons.profile}
                    style={{
                      width: widthToDp(20),
                      height: heightToDp(20),
                      tintColor: '#000',
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: widthToDp(4),
                    fontFamily: Config.fontFamilys.Poppins_Medium,
                    color: Config.Colors.textColor.textColor_1,
                  }}
                >
                  {getTokenData?.data?.profileData?.detail?.name}
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Image
                    source={Icons.telephone_icon}
                    style={{
                      width: widthToDp(5),
                      height: widthToDp(5),
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: widthToDp(4),
                      fontFamily: Config.fontFamilys.Poppins_SemiBold,
                      color: Config.Colors.textColor.textColor_2,
                    }}
                  >
                    {getTokenData?.data?.profileData.detail?.mobile_no}{' '}
                    {getTokenData?.data.profileData.detail?.email ? '|' : ''}{' '}
                    {getTokenData?.data.profileData.detail?.email}{' '}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles?.boxContainerIner}>
              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.employee_category_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.adminHomeScreenText?.emp_cat)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.employee_category
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.employee_detail_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.adminHomeScreenText?.emp_detail)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.employee_detail
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.status_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.adminHomeScreenText?.attendance_within)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.attendance_within
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {getTokenData?.data?.profileData?.detail?.attendance_within !==
              'Anywhere' ? (
                <View
                  style={{
                    padding: 15,
                    borderBottomColor: Config.Colors.borderColor,
                    borderBottomWidth: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 15,
                      }}
                    >
                      <View>
                        {/* <Image source={Icons.status_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                      </View>
                      <View>
                        <Text
                          style={{
                            color: Config.Colors.textColor.textColor_1,
                            fontFamily: Config.fontFamilys.Poppins_Medium,
                          }}
                        >
                          {t(Config.adminHomeScreenText?.branch)}
                        </Text>
                        <Text style={styles.text2}>
                          {getTokenData?.data?.profileData?.detail?.branch}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.status_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.myProfileText?.increament_period)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.increment_period
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.referance_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.myProfileText?.designation)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.designation
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.employee_category_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.adminHomeScreenText?.salary_wage)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.salary_wages
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.employee_category_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.adminHomeScreenText?.working_hours)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.working_hours
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles?.boxContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                    }}
                  >
                    <View>
                      {/* <Image source={Icons.employee_category_icon} style={{ width: 38, height: 38 }} resizeMode='contain' /> */}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Config.Colors.textColor.textColor_1,
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {t(Config.adminHomeScreenText?.date_of_joining)}
                      </Text>
                      <Text style={styles.text2}>
                        {
                          getTokenData?.data?.profileData?.detail
                            ?.date_of_joining
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles?.activeLoader}>
          <ActivityIndicator size={55} color={Config.Colors.themeColor} />
        </View>
      )}
      <View>
        <CustomModal
          modalVisible={openModal}
          onRequestClose={() => setOpenModal(!openModal)}
          alignItems="flex-end"
          justifyContent="flex-end"
          disableOnPress={true}
          showHeader={false}
        >
          <CustomDocPiker
            uploadFile={type => uploadProfile(type)}
            onRequestClose={() => setOpenModal(!openModal)}
          />
        </CustomModal>
      </View>

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
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  boxContainerIner: {
    width: widthToDp(88),
    minHeight: heightToDp(8),
    backgroundColor: Config.Colors.defaultColor,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  body: {
    marginTop: widthToDp(3),
    width: widthToDp(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContant: {
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    gap: widthToDp(5),
    paddingLeft: widthToDp(6),
    paddingRight: widthToDp(10),
    paddingTop: widthToDp(3.5),
    paddingBottom: widthToDp(3.5),
    alignItems: 'center',
  },
  text1: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    color: Config.Colors.black,
  },
  text2: {
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontSize: widthToDp(4),
    color: Config.Colors.textColor.textColor_2,
  },
  boxContainer: {
    padding: 15,
    borderBottomColor: Config.Colors.borderColor,
    borderBottomWidth: 1,
  },
  activeLoader: {
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
    bottom: widthToDp(100),
  },
});
export default React.memo(MyProfile);
