import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, { useRef } from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import * as Svgs from '../../helpers/Svg';
import { SvgCalender } from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll } from '../../helpers/localStorage';
import { toLocaleDateString } from '../../helpers/utils';
import { apiPostService } from '../../helpers/services';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { Switch } from 'react-native';
import AltertBox from '../../components/AltertBox';
import CustomModal from '../../components/CustomModal';
import {
  CustomInput,
  CustomInputBox,
  CustomLinearButton,
} from '../../components/CustomElements';
import MiniMap from '../../components/MiniMap';
import { branchesData } from '../../redux/slices/admin.slice';
import Geolocation from 'react-native-geolocation-service';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const Branches = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const adminData = useSelector(state => state.admin);
  const [openModal, setOpenModal] = React.useState(false);
  const [openMapModal, setOpenMapModal] = React.useState(false);
  const [mapLoading, setMapLoading] = React.useState(false);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [liveLocation, setLiveLocation] = React.useState(null);
  const [alertdata, setAlertdata] = React.useState(null);
  const [barnchData, setBranchData] = React.useState([]);
  const [formInputs, setFormInputs] = React.useState(initialInput);
  const [isUpdatingState, setisUpdatingState] = React.useState(false);
  const { t } = useTranslation();

  let initialInput = {
    branchName: '',
    radius: '',
    location: null,
  };
  const [errorMessage, setErrorMessage] = React.useState(initialInput);

  // For getting current location
  const getCurrentLocation = event => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.INTERNET,
            {
              title: t(Config.branchesText?.location_permission),
              message: t(Config.branchesText?.permission_message),
              buttonPositive: t(Config.branchesText?.ok),
              buttonNegative: t(Config.branchesText?.cancel),
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return false;
        }
      } else {
        try {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          if (auth === 'granted') {
            return auth;
          }
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return false;
        }
      }
    };

    // Usage example
    requestLocationPermission().then(hasLocationPermission => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          async position => {
            mapRef?.current?.animateToRegion({
              latitude: position?.coords.latitude,
              longitude: position?.coords.longitude,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
            });
            setTimeout(() => {
              setLiveLocation(position?.coords);
              setMapLoading(false);
            }, 5000);
          },
          error => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        // }
      } else {
        // Location permission is denied
        // Handle accordingly
      }
    });
  };

  // For going back to previous screen
  const goBackScreen = () => {
    navigation.goBack();
  };

  // For changing fields
  const handleOnChange = (name, value) => {
    setFormInputs(prv => ({ ...prv, [name]: value }));
    setErrorMessage(null);
  };

  // For setting location
  const handleLocation = (location, radius) => {
    setOpenMapModal(!openMapModal);
    setFormInputs(prv => ({ ...prv, radius: radius, location: location }));
    setErrorMessage(null);
  };

  // For Adding and Updating Branch
  const onSubmit = async () => {
    if (
      formInputs?.branchName === '' &&
      formInputs?.radius === '' &&
      formInputs?.location === null
    ) {
      setErrorMessage(prv => ({
        ...prv,
        branchName: t(Config.otherText?.required),
      }));
      setErrorMessage(prv => ({
        ...prv,
        radius: t(Config.otherText?.required),
      }));
      setErrorMessage(prv => ({
        ...prv,
        location: t(Config.otherText?.required),
      }));
    } else if (formInputs.radius === '') {
      setErrorMessage(prv => ({
        ...prv,
        radius: t(Config.otherText?.required),
      }));
    } else if (formInputs.location == null) {
      setErrorMessage(prv => ({
        ...prv,
        location: t(Config.otherText?.required),
      }));
    } else if (formInputs.branchName === '') {
      setErrorMessage(prv => ({
        ...prv,
        branchName: t(Config.otherText?.required),
      }));
    } else {
      let bodyData = {};
      let apiData;
      if (formInputs?.id) {
        bodyData = {
          location: {
            latitude: formInputs?.location?.latitude,
            longitude: formInputs?.location?.longitude,
            name: formInputs?.location?.locationName,
          },
          branch_name: formInputs.branchName,
          radius: formInputs.radius,
          branch_id: formInputs.id,
        };
        apiData = await apiPostService(Constants?.update_branch_api, bodyData);
      } else {
        bodyData = {
          location: {
            latitude: formInputs?.location?.latitude,
            longitude: formInputs?.location?.longitude,
            name: formInputs?.location?.locationName,
          },
          branch_name: formInputs.branchName,
          radius: formInputs.radius,
        };
        apiData = await apiPostService(Constants?.add_branch_api, bodyData);
      }

      if (isApiSuccess(apiData)) {
        getBranchData();
        setModalVisible(true);
        setAlertdata({
          statusText: apiData?.data?.message,
          time: '',
          confirm: () => {
            setFormInputs(initialInput);
            setOpenMapModal(false);
            setModalVisible(false);
            setOpenModal(false);
          },
          cancel: () => setModalVisible(false),
        });
      } else {
        console.log('Not Found');
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 2,
          borderColor: Config.Colors.borderColor,
        }}
      >
        <View
          style={{
            width: widthToDp(12),
            ...styles.tableCell,
          }}
        >
          <Text
            style={{
              color: Config.Colors.black,
              fontFamily: Config.fontFamilys.Poppins_Medium,
              fontSize: widthToDp(3),
            }}
          >
            {index + 1}
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
              fontFamily: Config.fontFamilys.Poppins_Medium,
              fontSize: widthToDp(3),
            }}
          >
            {t(Config.branchesText?.radius)} {t(Config.branchesText?.for)}{' '}
            {`\n`}
            {item?.radius} {t(Config.branchesText?.meter)}{' '}
          </Text>
        </View>
        <View
          style={{
            width: widthToDp(40),
            ...styles.tableCell,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: Config.Colors.black,
              fontFamily: Config.fontFamilys.Poppins_Medium,
              fontSize: widthToDp(3),
            }}
          >
            {item?.branch_name}
          </Text>
          <Text
            style={{
              color: Config.Colors.black,
              fontFamily: Config.fontFamilys.Poppins_Medium,
              fontSize: widthToDp(3),
            }}
          >
            {item?.location_name}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: widthToDp(13),
            ...styles.tableCell,
          }}
          onPress={() => {
            setOpenModal(true);
            setFormInputs({
              location: {
                latitude: item?.latitude,
                longitude: item?.longitude,
                locationName: item?.location_name,
              },
              branchName: item?.branch_name,
              radius: item?.radius,
              id: item?.id,
            });
          }}
        >
          <View
            style={{
              backgroundColor: Config.Colors.backgroundColors.bg_3,
              padding: 3,
              borderRadius: 5,
            }}
          >
            <Image
              source={Icons?.more_vert_icon}
              style={{
                width: widthToDp(5),
                height: widthToDp(5),
                tintColor: Config.Colors.themeColor,
              }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Under Development
  const getLocationRadius = (location, radius) => {
    console.log('first', location, radius);
  };

  // For fetching branch data
  const getBranchData = async () => {
    const bodyData = {
      limit: 20,
      start: 0,
      filter: {},
    };
    let tempData = [];
    let apiData = await apiPostService(Constants?.branch_list_api, bodyData);
    if (isApiSuccess(apiData) && apiData?.data?.result?.data) {
      setBranchData(apiData?.data?.result?.data);
      apiData?.data?.result?.data.forEach(element => {
        tempData.push({
          label: element?.branch_name,
          value: element?.branch_name,
          id: element?.id,
        });
      });
      apiData = {
        branches: apiData?.data?.result?.data,
        dropDownData: tempData,
      };
      dispatch(branchesData(apiData));
      setBranchData(tempData);
    }
  };

  const onCLickCreateBranch = () => {
    setisUpdatingState(false);
    setFormInputs(initialInput);
    setOpenModal(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      getCurrentLocation();
    }, []),
  );

  React.useEffect(() => {
    getBranchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        rightImage={Icons.add_icon}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        onPressRight={onCLickCreateBranch}
        leftText={route?.params.name}
        animated={true}
        onPressLeft={goBackScreen}
        tintColorRight={Config.Colors.defaultColor}
      />
      {adminData?.data?.branchesData?.branches ? (
        <View style={styles.body}>
          <SafeAreaView style={{ height: '93%' }}>
            <FlatList
              data={adminData?.data?.branchesData?.branches}
              renderItem={renderItem}
              // extraData={adminData?.data?.branchesData?.branches}
              ListHeaderComponent={() => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomWidth: 2,
                      borderColor: Config.Colors.borderColor,
                    }}
                  >
                    <View
                      style={{
                        width: widthToDp(12),
                        ...styles.tableCell,
                        padding: 0,
                        borderTopLeftRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: Config.Colors.black,
                          fontFamily: Config.fontFamilys.Poppins_SemiBold,
                          fontSize: widthToDp(3),
                        }}
                      >
                        {t(Config.otherText?.s_no)}
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
                          fontSize: widthToDp(3),
                        }}
                      >
                        {t(Config.branchesText?.distance)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: widthToDp(40),
                        ...styles.tableCell,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingLeft: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: Config.Colors.black,
                          fontFamily: Config.fontFamilys.Poppins_SemiBold,
                          fontSize: widthToDp(3),
                        }}
                      >
                        {t(Config.branchesText?.location)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: widthToDp(13),
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
                          fontSize: widthToDp(3),
                        }}
                      >
                        {t(Config.otherText?.edit)}
                      </Text>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => String(index)}
              // style={{ paddingBottom: widthToDp(20), flex: 1 }}
              showsVerticalScrollIndicator={false}
              // contentContainerStyle={styles.table}
            />
          </SafeAreaView>
        </View>
      ) : null}
      <View
        style={{
          position: 'absolute',
          bottom: widthToDp(10),
          alignItems: 'center',
          width: widthToDp(90),
          display: 'none',
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomLinearButton
            commonWidth={widthToDp(50)}
            text={t(Config.branchesText?.add_branch)}
            onPress={() => setOpenModal(true)}
            color={Config.Colors.defaultColor}
            IconsRigth={Icons.add_icon}
            iconWidth={widthToDp(10)}
            iconHeight={widthToDp(5)}
          />
        </View>
      </View>
      {openModal ? (
        <CustomModal
          modalVisible={openModal}
          onRequestClose={() => {
            setOpenModal(!openModal);
            setErrorMessage(null);
          }}
          alignItems="center"
          justifyContent="center"
          disableOnPress={false}
          showHeader={true}
          animationType="slide"
        >
          {/* <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}> */}

          <ScrollView
            style={{
              width: widthToDp(100),
              height: heightToDp(100),
              backgroundColor: Config.Colors.bodyBg,
              borderRadius: widthToDp(2),
              paddingBottom: widthToDp(10),
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Header_2
                leftImage={Icons.arrow_back}
                commonWidth={widthToDp(12)}
                commonHeight={heightToDp(5)}
                leftText={
                  isUpdatingState
                    ? t(Config.branchesText?.add_branch)
                    : t(Config.branchesText?.update_branch)
                }
                animated={true}
                onPressLeft={() => {
                  setOpenModal(!openModal);
                  setErrorMessage(null);
                }}
              />
              <View
                style={{
                  width: widthToDp(90),
                  // height: widthToDp(75),
                  marginTop: 10,
                  // backgroundColor: Config.Colors.defaultColor,
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingBottom: 60,
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 20,
                  }}
                >
                  <CustomInput
                    backgroundColor={Config.Colors.defaultColor}
                    placeholder={t(Config.branchesText?.branch_name)}
                    keyboardType={'default'}
                    autoCapitalize={'none'}
                    autoComplete={'given-name'}
                    bgColor={Config.Colors.inputField}
                    countryCodeStatus={true}
                    onChangeText={text => handleOnChange('branchName', text)}
                    value={formInputs?.branchName}
                    commonWidth={widthToDp(90)}
                    commonHeight={widthToDp(15)}
                    textAlignVertical="center"
                    leftImage={Icons?.branch_icon}
                    errorMessage={
                      errorMessage?.branchName ? errorMessage?.branchName : ''
                    }
                    borderColor={
                      errorMessage?.branchName
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                    onSubmitEditing={e => console.log('e', e)}
                  />
                  <TouchableOpacity onPress={() => handleLocation()}>
                    <CustomInput
                      backgroundColor={Config.Colors.defaultColor}
                      placeholder={t(Config.branchesText?.branch_location)}
                      keyboardType={'default'}
                      autoCapitalize={'none'}
                      autoComplete={'given-name'}
                      bgColor={Config.Colors.inputField}
                      countryCodeStatus={true}
                      onChangeText={text => handleOnChange('location', text)}
                      value={formInputs?.location?.locationName}
                      editable={false}
                      commonWidth={widthToDp(90)}
                      commonHeight={widthToDp(15)}
                      textAlignVertical="center"
                      numberOfLines={10}
                      multiline={true}
                      leftImage={Icons?.location_icon}
                      errorMessage={
                        errorMessage?.location ? errorMessage?.location : ''
                      }
                      borderColor={
                        errorMessage?.location
                          ? Config.Colors.errorFieldBorder
                          : Config.Colors.borderColor
                      }
                      onSubmitEditing={e => console.log('e', e)}
                    />
                  </TouchableOpacity>
                  <CustomInput
                    backgroundColor={Config.Colors.defaultColor}
                    placeholder={t(Config.branchesText?.radius)}
                    keyboardType={'default'}
                    autoCapitalize={'none'}
                    autoComplete={'given-name'}
                    bgColor={Config.Colors.inputField}
                    countryCodeStatus={true}
                    onChangeText={text => handleOnChange('radius', text)}
                    value={formInputs?.radius}
                    commonWidth={widthToDp(90)}
                    commonHeight={widthToDp(15)}
                    textAlignVertical="center"
                    numberOfLines={10}
                    multiline={true}
                    leftImage={Icons?.branch_icon}
                    errorMessage={
                      errorMessage?.radius ? errorMessage?.radius : ''
                    }
                    borderColor={
                      errorMessage?.radius
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                    onSubmitEditing={e => console.log('e', e)}
                  />
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CustomLinearButton
                      commonWidth={widthToDp(40)}
                      text={
                        isUpdatingState
                          ? t(Config.otherText?.submit)
                          : t(Config.otherText?.update)
                      }
                      onPress={onSubmit}
                      color={Config.Colors.defaultColor}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* </KeyboardAvoidingView> */}
        </CustomModal>
      ) : null}

      {openMapModal ? (
        <CustomModal
          modalVisible={openMapModal}
          onRequestClose={() => setOpenMapModal(!openMapModal)}
          alignItems="center"
          justifyContent="center"
          disableOnPress={false}
          showHeader={true}
          animationType="slide"
        >
          {/* <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}> */}

          <ScrollView
            style={{
              width: widthToDp(100),
              height: heightToDp(100),
              backgroundColor: Config.Colors.bodyBg,
              borderRadius: widthToDp(2),
              paddingBottom: widthToDp(10),
            }}
          >
            <MiniMap
              handleLocation={handleLocation}
              onSubmitBtn={getLocationRadius}
              defaultlocation={liveLocation}
            />
          </ScrollView>
          {/* </KeyboardAvoidingView> */}
        </CustomModal>
      ) : null}

      {isModalVisible ? (
        <AltertBox
          isModalVisible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          confirm={() => alertdata?.confirm()}
          cancel={() => alertdata?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: alertdata?.statusText,
            text2: alertdata?.time,
          }}
        />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //   width:widthToDp(100),
    // backgroundColor:'#000'
  },
  body: {
    marginTop: 10,
    // backgroundColor: Config.Colors.backgroundColors,
    // elevation: .1,
    borderRadius: 10,
    // borderColor: Config.Colors.borderColor,
    // borderWidth: 1
  },
  body2: {
    marginTop: 10,
    backgroundColor: Config.Colors.bodyBg,
    elevation: 2,
    flex: 1,
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: '#000',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: widthToDp(90),
    margin: 10,
    padding: 10,
  },
  boxContainer: {
    alignSelf: 'center',
    // bottom: 10
  },
  boxContainerIner: {
    marginBottom: widthToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2),
  },
  salarySettings: {
    width: widthToDp(45),
    marginTop: widthToDp(3),
    marginBottom: widthToDp(3),
    padding: widthToDp(3),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Config.Colors.themeColor,
    marginLeft: widthToDp(3),
  },
  salary: {
    width: widthToDp(45),
    marginTop: widthToDp(3),
    marginBottom: widthToDp(3),
    padding: widthToDp(3),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Config.Colors.themeColor,
    marginRight: widthToDp(3),
  },
  table: {
    // borderWidth: 1,
    // borderColor: '#000',
    // borderRadius: 5,
    // marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Config.Colors.borderColor,
    textAlign: 'center',
  },
  header: {
    // backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    borderWidth: 1,
    borderColor: Config.Colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
export default React.memo(Branches);
