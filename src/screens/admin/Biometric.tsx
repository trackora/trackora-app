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
} from 'react-native';
import React from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import * as Svgs from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import AltertBox from '../../components/AltertBox';
import CustomModal from '../../components/CustomModal';
import { useTranslation } from 'react-i18next';
import {
  CustomDropDownComponent,
  CustomInput,
  CustomLinearButton,
} from '../../components/CustomElements';
import { biometricData, branchesData } from '../../redux/slices/admin.slice';

const Biometric = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const adminData = useAppSelector(state => state.admin);
  const [openModal, setOpenModal] = React.useState(false);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const { t } = useTranslation();

  const [alertdata, setAlertdata] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  type BiometricFormInputs = {
    name: string;
    code: string;
    brandName: string;
    id?: string | number;
    description?: string;
    status?: number | string;
    radius?: string;
  };
  const initialInput: BiometricFormInputs = {
    name: '',
    code: '',
    brandName: '',
  };
  const [formInputs, setFormInputs] = React.useState<BiometricFormInputs>(initialInput);

  const goBackScreen = () => {
    navigation.navigate('settings');
  };
  const handleOnChange = (name, value) => {
    setFormInputs(prv => ({ ...prv, [name]: value }));
    setErrorMessage(null);
  };
  const onSubmit = async (biometric_id?: string | number) => {
    if (formInputs.name === '' && formInputs.code === '') {
      setErrorMessage(prv => ({
        ...prv,
        name: t(Config?.otherText?.required),
      }));
      setErrorMessage(prv => ({
        ...prv,
        code: t(Config?.otherText?.required),
      }));
      setErrorMessage(prv => ({
        ...prv,
        brandName: t(Config?.otherText?.required),
      }));
    } else if (formInputs.radius === '') {
      setErrorMessage(prv => ({
        ...prv,
        radius: t(Config?.otherText?.required),
      }));
    } else if (formInputs.name === '') {
      setErrorMessage(prv => ({
        ...prv,
        name: t(Config?.otherText?.required),
      }));
    } else if (formInputs.code === '') {
      setErrorMessage(prv => ({
        ...prv,
        code: t(Config?.otherText?.required),
      }));
    }
    // else if (formInputs.brandName === '') {
    //     setErrorMessage((prv) => ({ ...prv, brandName: t(Config?.otherText?.required) }))
    // }
    else {
      setLoader(true);
      let bodyData = {};
      let apiData;
      if (formInputs?.id) {
        bodyData = {
          name: formInputs?.name,
          code: formInputs?.code,
          description: formInputs.description,
          status: formInputs?.status,
          biometric_id: formInputs?.id,
        };
        apiData = await apiPostService(
          Constants?.biometric_update_api,
          bodyData,
        );
      } else {
        bodyData = {
          name: formInputs?.name,
          code: formInputs.code,
          description: 'test description here',
        };

        apiData = await apiPostService(Constants?.biometric_add_api, bodyData);
      }
      if (apiData?.data?.status == 'success') {
        setLoader(false);

        getBiometriData();
        setModalVisible(true);
        setAlertdata({
          statusText: apiData?.data?.message,
          time: '',
          confirm: () => {
            setFormInputs(initialInput),
              setModalVisible(false),
              setOpenModal(false);
          },
          cancel: () => setModalVisible(false),
        });
      } else {
        console.log('Not Found');
      }
    }
  };

  const getBiometriData = async () => {
    const bodyData = {
      limit: 500,
      start: 0,
      filter: {},
    };
    const apiData = await apiPostService(
      Constants?.biometric_list_api,
      bodyData,
    );

    if (apiData?.data?.result?.data) {
      dispatch(biometricData(apiData?.data?.result?.data));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getBiometriData();
    }, []),
  );

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
            {item?.name}{' '}
          </Text>
        </View>
        <View
          style={{
            width: widthToDp(40),
            ...styles.tableCell,
            // alignItems: 'flex-start',
            // justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: Config.Colors.black,
              fontFamily: Config.fontFamilys.Poppins_Medium,
              fontSize: widthToDp(3),
            }}
          >
            {item?.code}
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
            setFormInputs(item);
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
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={route?.params.name}
        animated={true}
        onPressLeft={goBackScreen}
        tintColorRight={Config.Colors.defaultColor}
      />
      {adminData?.data?.branchesData?.branches ? (
        <View style={styles.body}>
          <SafeAreaView style={{ height: '85.5%' }}>
            <FlatList
              data={adminData?.data?.biometricData}
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
                        {t(Config?.otherText?.name)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: widthToDp(40),
                        ...styles.tableCell,
                        // justifyContent: 'center',
                        // alignItems: 'flex-start',
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
                        {t(Config?.otherText?.serial_number)}
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
                        {t(Config?.otherText?.edit)}
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
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomLinearButton
            commonWidth={widthToDp(50)}
            text={Config?.otherText?.add_biometric}
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
                leftText={Config?.otherText?.add_biometric}
                animated={true}
                onPressLeft={() => {
                  setOpenModal(!openModal);
                  setErrorMessage(null);
                  setFormInputs(initialInput);
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
                {/* {loader ?
                                    <View style={{ width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', height: "100%", zIndex: 9999, }}>
                                        <ActivityIndicator size={35} color={Config.Colors.themeColor} />
                                    </View>
                                    : null} */}
                <View style={{ padding: 10, alignSelf: 'flex-start' }}>
                  <Text
                    style={{
                      color: Config.Colors.black,
                      fontSize: widthToDp(4.5),
                    }}
                  >
                    {t(Config?.otherText?.bio_metric_information)}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 20,
                  }}
                >
                  <CustomInput
                    backgroundColor={Config.Colors.defaultColor}
                    placeholder={Config?.otherText?.name}
                    keyboardType={'default'}
                    autoCapitalize={'none'}
                    autoComplete={'given-name'}
                    bgColor={Config.Colors.inputField}
                    countryCodeStatus={true}
                    value={formInputs?.name}
                    onChangeText={text => handleOnChange('name', text)}
                    //   value={empformInputs?.empName}
                    commonWidth={widthToDp(90)}
                    commonHeight={widthToDp(15)}
                    textAlignVertical="center"
                    leftImage={Icons?.branch_icon}
                    multiline={true}
                    numberOfLines={10}
                    errorMessage={errorMessage?.name ? errorMessage?.name : ''}
                    borderColor={
                      errorMessage?.name
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                  />
                  <CustomInput
                    backgroundColor={Config.Colors.defaultColor}
                    placeholder={Config?.otherText?.serial_number}
                    keyboardType={'default'}
                    autoCapitalize={'none'}
                    autoComplete={'given-name'}
                    bgColor={Config.Colors.inputField}
                    countryCodeStatus={true}
                    value={formInputs?.code}
                    onChangeText={text => handleOnChange('code', text)}
                    //   value={empformInputs?.empName}
                    commonWidth={widthToDp(90)}
                    commonHeight={widthToDp(15)}
                    textAlignVertical="center"
                    leftImage={Icons?.branch_icon}
                    multiline={true}
                    numberOfLines={10}
                    errorMessage={errorMessage?.code ? errorMessage?.code : ''}
                    borderColor={
                      errorMessage?.code
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                  />
                  {formInputs?.status ? (
                    <View style={{ justifyContent: 'center' }}>
                      <Text
                        style={{
                          fontFamily: Config.fontFamilys.Poppins_SemiBold,
                          color: Config.Colors.textColor.textColor_2,
                        }}
                      >
                        {t(Config?.otherText?.status)}
                      </Text>
                      <CustomDropDownComponent
                        commonWidth={widthToDp(90)}
                        commonHeight={widthToDp(15)}
                        borderColor={Config.Colors.borderColor}
                        data={[
                          { label: t(Config?.otherText?.active), value: 1 },
                          { label: t(Config?.otherText?.inactive), value: 0 },
                        ]}
                        // placeholder={statusValue}
                        onChangeDropDown={item => handleOnChange('id', item)}
                        backgroundColor={Config.Colors.defaultColor}
                        initialValue={formInputs?.status}
                      />
                    </View>
                  ) : null}
                  {/* <CustomInput
                                        backgroundColor={Config.Colors.defaultColor}
                                        placeholder={'Brand Name'}
                                        keyboardType={'default'}
                                        autoCapitalize={'none'}
                                        autoComplete={'given-name'}
                                        bgColor={Config.Colors.inputField}
                                        countryCodeStatus={true}
                                        value={formInputs?.brandName}
                                        onChangeText={(text) => handleOnChange("brandName", text)}
                                        //   value={empformInputs?.empName}
                                        commonWidth={widthToDp(90)}
                                        commonHeight={widthToDp(15)}
                                        textAlignVertical="center"
                                        leftImage={Icons?.branch_icon}
                                        multiline={true}
                                        numberOfLines={10}
                                        errorMessage={errorMessage?.brandName ? errorMessage?.brandName : ''}
                                        borderColor={errorMessage?.brandName ? Config.Colors.errorFieldBorder : Config.Colors.borderColor}
                                    /> */}
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CustomLinearButton
                      commonWidth={widthToDp(40)}
                      text={
                        formInputs?.id
                          ? t(Config?.otherText?.update)
                          : t(Config?.otherText?.update)
                      }
                      onPress={() => onSubmit()}
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
export default React.memo(Biometric);
