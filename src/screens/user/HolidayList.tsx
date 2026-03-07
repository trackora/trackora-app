import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useTranslation } from 'react-i18next';
import { apiPostService } from '../../helpers/services';
import * as Constants from '../../helpers/Constants';
import { isApiSuccess } from '../../helpers/Validation';
import CustomModal from '../../components/CustomModal';
import {
  CustomInput,
  CustomLinearButton,
} from '../../components/CustomElements';
import { SvgCalender } from '../../helpers/Svg';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import AltertBox from '../../components/AltertBox';
 
const CustomModalAny = CustomModal as React.ComponentType<any>;
const CustomInputAny = CustomInput as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;
 
type HolidayItem = {
  id?: number | string;
  holiday_name?: string;
  holiday_date?: string;
  is_holiday_added?: number;
};
 
type HolidayAlert = {
  statusText: string;
  confirm: () => void;
  cancel: () => void;
};
 
type HolidayListProps = {
  navigation: {
    goBack: () => void;
  };
  route?: any;
};
 
const HolidayList: React.FC<HolidayListProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [holidayList, setHolidayList] = React.useState<HolidayItem[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [field, setField] = React.useState({
    holiday_name: '',
    holiday_date: '',
  });
  const [dateObj, setDateObj] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isModalVisible, setisModalVisible] = React.useState(false);
  const [holidayAlertData, setHolidayAlertData] =
    React.useState<HolidayAlert | null>(null);
 
  const goBackScreen = () => {
    navigation.goBack();
  };
 
  const handleDateChange = React.useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setDateObj(selectedDate);
        const formatted = selectedDate.toISOString().split('T')[0];
        setField(prev => ({ ...prev, holiday_date: formatted }));
      }
    },
    [],
  );
 
  const handleOnChange = (key: 'holiday_name' | 'holiday_date', value: string) => {
    setField(prev => ({ ...prev, [key]: value }));
  };
 
  const fetchHolidayList = React.useCallback(async () => {
    const apiData = await apiPostService(Constants?.holidayList, { filter: '' });
    if (isApiSuccess(apiData)) {
      setHolidayList(apiData?.data?.result?.data ?? []);
    }
  }, []);
 
  const addHoliday = React.useCallback(
    async (bodyData?: Partial<typeof field>) => {
      const apiData = await apiPostService(
        Constants.addHolidayApi,
        bodyData ? bodyData : field,
      );
      if (isApiSuccess(apiData)) {
        if (!bodyData) {
          setOpenModal(!openModal);
        }
        fetchHolidayList();
        Toast.show({
          type: 'success',
          text1: `${apiData?.data?.message}`,
          text2: `${apiData?.data?.status}`,
          swipeable: true,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: `${apiData?.data?.message}`,
          text2: `${apiData?.data?.status}`,
          swipeable: true,
        });
      }
    },
    [field, fetchHolidayList, openModal],
  );
 
  const handleRemoveHoliday = (id?: number | string) => {
    setisModalVisible(true);
    setHolidayAlertData({
      statusText: 'Are you sure you want to delete this holiday ?',
      confirm: () => removeHoliday(id),
      cancel: () => setisModalVisible(false),
    });
  };
 
  const removeHoliday = async (id?: number | string) => {
    const apiData = await apiPostService(Constants.updateHoliday, {
      id: `${id}`,
      status: 0,
    });
    if (isApiSuccess(apiData)) {
      fetchHolidayList();
      Toast.show({
        type: 'success',
        text1: `${apiData?.data?.message}`,
        text2: `${apiData?.data?.status}`,
        swipeable: true,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: `${apiData?.data?.message}`,
        text2: `${apiData?.data?.status}`,
        swipeable: true,
      });
    }
    setisModalVisible(false);
  };
 
  const showHolidays = ({ item }: { item: HolidayItem }) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          marginVertical: 8,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
          margin: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: Config.Colors.textColor.textColor_1,
                fontSize: widthToDp(3.9),
                fontFamily: Config.fontFamilys.Poppins_Medium,
                marginBottom: 6,
              }}
            >
              {item?.holiday_name}
            </Text>
 
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  color: Config.Colors.textColor.textColor_2,
                  fontSize: widthToDp(3.2),
                  fontFamily: Config.fontFamilys.Poppins_Regular,
                }}
              >
                {item?.holiday_date}
              </Text>
            </View>
          </View>
 
          <TouchableOpacity
            onPress={() =>
              item?.is_holiday_added == 0
                ? addHoliday({
                    holiday_date: item?.holiday_date,
                    holiday_name: item?.holiday_name,
                  })
                : handleRemoveHoliday(item?.id)
            }
            style={{
              backgroundColor:
                item?.is_holiday_added == 0
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(239,68,68,0.1)',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: item?.is_holiday_added == 0 ? '#16a34a' : '#dc2626',
                fontSize: widthToDp(3.3),
                fontFamily: Config.fontFamilys.Poppins_Medium,
              }}
            >
              {item?.is_holiday_added == 0 ? 'Add' : 'Remove'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };
 
  React.useEffect(() => {
    fetchHolidayList();
  }, [fetchHolidayList]);
 
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        rightImage={Icons.add_icon}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        onPressRight={() => setOpenModal(true)}
        tintColorRight={Config.Colors.defaultColor}
        leftText="Holiday List"
        animated={true}
        onPressLeft={goBackScreen}
      />
      <FlatList
        renderItem={showHolidays}
        data={holidayList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
      />
 
      {isModalVisible ? (
        <AltertBox
          isModalVisible={isModalVisible}
          onRequestClose={() => setisModalVisible(false)}
          confirm={() => holidayAlertData?.confirm()}
          cancel={() => holidayAlertData?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: holidayAlertData?.statusText,
          }}
        />
      ) : null}
 
      {openModal ? (
        <CustomModalAny
          modalVisible={openModal}
          onRequestClose={() => {
            setOpenModal(!openModal);
          }}
          alignItems="center"
          justifyContent="center"
          disableOnPress={false}
          showHeader={true}
          animationType="slide"
        >
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
                leftText="Add Holiday"
                animated={true}
                onPressLeft={() => {
                  setOpenModal(!openModal);
                }}
              />
              <View
                style={{
                  width: widthToDp(90),
                  marginTop: 10,
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
                  <CustomInputAny
                    backgroundColor={Config.Colors.defaultColor}
                    placeholder="Enter Holiday Name"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoComplete="given-name"
                    bgColor={Config.Colors.inputField}
                    countryCodeStatus={true}
                    onChangeText={(text: string) =>
                      handleOnChange('holiday_name', text)
                    }
                    value={field?.holiday_name}
                    commonWidth={widthToDp(90)}
                    commonHeight={widthToDp(15)}
                    textAlignVertical="center"
                    leftImage={Icons?.branch_icon}
                    errorMessage=""
                    borderColor={Config.Colors.borderColor}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundColor: Config.Colors.defaultColor,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: Config.Colors.borderColor,
                        paddingHorizontal: widthToDp(3),
                        height: widthToDp(15),
                        width: widthToDp(90),
                      }}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <SvgCalender width={20} height={20} />
                      <Text
                        style={{
                          color: field?.holiday_date
                            ? Config.Colors.black
                            : '#999',
                          fontSize: widthToDp(3.8),
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                        }}
                      >
                        {field?.holiday_date || 'Select Holiday Date'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dateObj}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      maximumDate={new Date(new Date().getFullYear(), 11, 31)}
                    />
                  )}
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CustomLinearButtonAny
                      commonWidth={widthToDp(40)}
                      text={t(Config.otherText?.submit)}
                      onPress={() => addHoliday()}
                      color={Config.Colors.defaultColor}
                      Icons={null}
                      tintColor={Config.Colors.defaultColor}
                      IconsRigth={null}
                      padding={0}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </CustomModalAny>
      ) : null}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { marginTop: 10 },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: '#000',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: widthToDp(90),
    margin: 10,
    padding: 10,
  },
  boxContainer: { alignSelf: 'center' },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2),
  },
  wrapper: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    height: 40,
    backgroundColor: '#f9f9f9',
    padding: 10,
    flex: 1,
    borderRadius: 8,
  },
  exchangeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0984e3',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  exchangeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#0984e3',
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
 
export default React.memo(HolidayList);