import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import React from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useTranslation } from 'react-i18next';
import { apiPostService } from '../../helpers/services';
import * as Constants from '../../helpers/Constants';
import { isApiSuccess } from '../../helpers/Validation';
import CustomModal from '../../components/CustomModal';
import Toast from 'react-native-toast-message';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  CustomInput,
  CustomLabelSelector,
  CustomLinearButton,
} from '../../components/CustomElements';
import { formatTime } from '../../helpers/utils';
import AltertBox from '../../components/AltertBox';
 
// Casts to avoid strict prop requirements from CustomElements typing
const CustomInputAny = CustomInput as React.ComponentType<any>;
const CustomLabelSelectorAny = CustomLabelSelector as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;
 
type ShiftField = {
  shift_name: string;
  shift_start_time: string;
  can_punch_in: string;
  start_limit: string;
  shift_end_time: string;
  can_punch_out: string;
  end_limit: string;
};
 
type ShiftItem = ShiftField & {
  id?: number | string;
};
 
type ErrorState = Record<keyof ShiftField, string>;
 
type TimeField =
  | 'shift_start_time'
  | 'shift_end_time'
  | 'start_limit'
  | 'end_limit';
 
type TimePickerState = {
  show: boolean;
  field: TimeField | null;
};
 
type DeleteAlert = {
  statusText: string;
  confirm: () => void;
  cancel: () => void;
};
 
type ShiftProps = {
  navigation: {
    goBack: () => void;
  };
};
 
const initialErrorState: ErrorState = {
  shift_name: '',
  shift_start_time: '',
  can_punch_in: '',
  start_limit: '',
  shift_end_time: '',
  can_punch_out: '',
  end_limit: '',
};
 
const emptyShiftField: ShiftField = {
  shift_name: '',
  shift_start_time: '',
  can_punch_in: '',
  start_limit: '',
  shift_end_time: '',
  can_punch_out: '',
  end_limit: '',
};

 
const Shift: React.FC<ShiftProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [shiftList, setShiftList] = React.useState<ShiftItem[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [shiftField, setShiftField] = React.useState<ShiftField>(emptyShiftField);
  const [errorMessage, setErrorMessage] =
    React.useState<ErrorState>(initialErrorState);
 
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [timePicker, setTimePicker] = React.useState<TimePickerState>({
    show: false,
    field: null,
  });
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedShift, setSelectedShift] = React.useState<DeleteAlert | null>(
    null,
  );
 
  // Go back
  const goBackScreen = () => {
    navigation.goBack();
  };
 
  // Validation function
  const validateField = (field: keyof ShiftField, value: string) => {
    let message = '';
    const requiredFields: Array<keyof ShiftField> = [
      'shift_name',
      'shift_start_time',
      'shift_end_time',
    ];
 
    if (!value && requiredFields.includes(field)) {
      message = `${field.replace('_', ' ')} is required`;
    }
 
    // Punch In / Out must be selected
    if (!value && ['can_punch_in', 'can_punch_out'].includes(field)) {
      message = `${field.replace('_', ' ')} is required`;
    }
 
    if (
      field === 'start_limit' &&
      shiftField.can_punch_in === 'limit' &&
      !value
    ) {
      message = 'Start limit is required when Punch In is limited';
    }
    if (
      field === 'end_limit' &&
      shiftField.can_punch_out === 'limit' &&
      !value
    ) {
      message = 'End limit is required when Punch Out is limited';
    }
 
    setErrorMessage(prev => ({ ...prev, [field]: message }));
    return message === '';
  };
 
  const handleChange = (field: keyof ShiftField, value: string) => {
    setShiftField(prev => ({ ...prev, [field]: value }));
 
    if (field === 'can_punch_in' && value === 'anytime') {
      setShiftField(prev => ({ ...prev, start_limit: '' }));
    }
    if (field === 'can_punch_out' && value === 'anytime') {
      setShiftField(prev => ({ ...prev, end_limit: '' }));
    }
 
    validateField(field, value);
  };
 
  // For getting all the shifts
  const fetchShiftList = async () => {
    const apiData = await apiPostService(Constants.shiftList, { filter: '' });
    if (isApiSuccess(apiData)) {
      setShiftList(apiData?.data?.result?.data || []);
    }
  };
 
  // When user picks time
  const onTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setTimePicker({ show: false, field: null });
    if (event.type === 'set' && selectedDate && timePicker.field) {
      setShiftField(prev => ({
        ...prev,
        [timePicker.field as keyof ShiftField]: formatTime(selectedDate),
      }));
    }
  };
 
  const punchOptions: Array<{ label: string; value: 'anytime' | 'limit' }> = [
    { label: 'Anytime', value: 'anytime' },
    { label: 'Set Limit', value: 'limit' },
  ];
 
  const deleteShift = async (id?: number | string) => {
    const apiData = await apiPostService(Constants.deleteShift, { id });
    if (isApiSuccess(apiData)) {
      fetchShiftList();
      Toast.show({
        type: 'success',
        text1: apiData?.data?.message,
        text2: apiData?.data?.status,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: apiData?.data?.message,
        text2: apiData?.data?.status,
      });
    }
    setDeleteModal(false);
  };
 
  const handleDeleteModal = (id?: number | string) => {
    setDeleteModal(true);
    setSelectedShift({
      statusText: `Are you sure you want to delete this \n shift ?`,
      confirm: () => deleteShift(id),
      cancel: () => setDeleteModal(false),
    });
  };
 
  const normalizeShiftField = (item: ShiftItem): ShiftField => ({
    shift_name: item.shift_name ?? '',
    shift_start_time: item.shift_start_time ?? '',
    can_punch_in: item.can_punch_in ?? '',
    start_limit: item.start_limit ?? '',
    shift_end_time: item.shift_end_time ?? '',
    can_punch_out: item.can_punch_out ?? '',
    end_limit: item.end_limit ?? '',
  });
 
  // For showing shift list
  const renderShift = ({ item }: ListRenderItemInfo<ShiftItem>) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setIsUpdating(true);
          setShiftField(normalizeShiftField(item));
          setOpenModal(true);
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            marginVertical: 8,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.08)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View style={{ marginTop: 4 }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <Text
                style={{
                  fontSize: widthToDp(3.5),
                  fontFamily: Config.fontFamilys.Poppins_Medium,
                  color: Config.Colors.textColor.textColor_2,
                  marginBottom: 2,
                }}
              >
                Shift Name: &nbsp;
                <Text
                  style={{
                    color: Config.Colors.textColor.textColor_1,
                    fontFamily: Config.fontFamilys.Poppins_Medium,
                  }}
                >
                  {item?.shift_name || 'Unnamed Shift'}
                </Text>
              </Text>
              <TouchableOpacity onPress={() => handleDeleteModal(item?.id)}>
                <Text
                  style={{
                    backgroundColor: '#dc2626',
                    color: Config.Colors.defaultColor,
                    fontSize: widthToDp(3.2),
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 8,
                    fontFamily: Config.fontFamilys.Poppins_Medium,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
 
            <Text
              style={{
                fontSize: widthToDp(3.5),
                fontFamily: Config.fontFamilys.Poppins_Medium,
                color: Config.Colors.textColor.textColor_2,
              }}
            >
              Break Duration: &nbsp;
              <Text
                style={{
                  fontFamily: Config.fontFamilys.Poppins_Medium,
                  color: Config.Colors.textColor.textColor_1,
                }}
              >
                {item?.shift_start_time} – {item?.shift_end_time}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
 
  // For adding/updating shift
  const postShift = async () => {
    const fields = Object.keys(shiftField) as Array<keyof ShiftField>;
    const isValid = fields.every(field => validateField(field, shiftField[field]));
    if (!isValid) return;
 
    const apiUrl = isUpdating ? Constants.updateShift : Constants.addShift;
    const apiData = await apiPostService(apiUrl, shiftField);
 
    if (isApiSuccess(apiData)) {
      setOpenModal(false);
      fetchShiftList();
      Toast.show({
        type: 'success',
        text1: `${apiData?.data?.status}`,
        text2: `${apiData?.data?.message} 👋`,
        swipeable: true,
      });
    } else {
      setOpenModal(false);
      Toast.show({
        type: 'error',
        text1: `${apiData?.data?.status}`,
        text2: `${apiData?.data?.message}`,
        swipeable: true,
      });
    }
  };
 
  const onCreateShiftClick = () => {
    setIsUpdating(false);
    setShiftField(emptyShiftField);
    setOpenModal(true);
  };
 
  React.useEffect(() => {
    if (shiftField?.can_punch_in === 'anytime') {
      setShiftField(prev => ({
        ...prev,
        start_limit: '',
      }));
    }
    if (shiftField?.can_punch_out === 'anytime') {
      setShiftField(prev => ({
        ...prev,
        end_limit: '',
      }));
    }
  }, [shiftField?.can_punch_in, shiftField?.can_punch_out]);
 
  React.useEffect(() => {
    fetchShiftList();
  }, []);
 
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={`Shift List`}
        animated={true}
        onPressLeft={goBackScreen}
        tintColorRight={Config.Colors.defaultColor}
        rightImage={Icons.add_icon}
        onPressRight={onCreateShiftClick}
      />
 
      <View style={{ margin: 20 }}>
        <FlatList
          renderItem={renderShift}
          data={shiftList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item?.shift_name}-${index}`}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
 
      {deleteModal ? (
        <AltertBox
          isModalVisible={deleteModal}
          onRequestClose={() => setDeleteModal(false)}
          confirm={() => selectedShift?.confirm()}
          cancel={() => selectedShift?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: t(selectedShift?.statusText ?? ''),
          }}
        />
      ) : null}
 
      {openModal && (
        <CustomModal
          modalVisible={openModal}
          onRequestClose={() => setOpenModal(!openModal)}
          alignItems="center"
          justifyContent="center"
          disableOnPress={false}
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
                leftText={isUpdating ? 'Update Shift' : 'Add Shift'}
                animated={true}
                onPressLeft={() => setOpenModal(!openModal)}
              />
 
              <View
                style={{
                  width: widthToDp(90),
                  marginTop: 10,
                  paddingBottom: 40,
                }}
              >
                {/* Shift Details */}
                <View
                  style={{
                    backgroundColor: Config.Colors.defaultColor,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: widthToDp(2),
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthToDp(4),
                      fontFamily: Config.fontFamilys.Poppins_SemiBold,
                      color: '#111827',
                      marginBottom: 12,
                    }}
                  >
                    Shift Details
                  </Text>
                  <View style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        fontSize: widthToDp(3),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                        color: '#6b7280',
                        marginBottom: 6,
                      }}
                    >
                      Shift Name
                    </Text>
                    <CustomInputAny
                      lable=""
                      placeholder="Enter Shift Name"
                      value={shiftField?.shift_name}
                      onChangeText={(text: string) =>
                        handleChange('shift_name', text)
                      }
                      backgroundColor="#fff"
                      bgColor={Config.Colors.inputField}
                      commonWidth={widthToDp(85)}
                      commonHeight={widthToDp(11)}
                      errorMessage={errorMessage?.shift_name ?? ''}
                      borderColor={
                        errorMessage?.shift_name
                          ? Config.Colors.errorFieldBorder
                          : Config.Colors.themeColor
                      }
                      countryCode=""
                      maxLength={undefined}
                      ref={undefined}
                      leftImage={null}
                      tintColor={Config.Colors.themeColor}
                      onSubmitEditing={undefined}
                      onChange={undefined}
                      onFocusFunction={undefined}
                      autoFocus={false}
                    />
                  </View>
 
                  <View style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        fontSize: widthToDp(3),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                        color: '#6b7280',
                        marginBottom: 6,
                      }}
                    >
                      Shift Start Time
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTimePicker({ show: true, field: 'shift_start_time' })
                      }
                    >
                      <CustomInputAny
                        lable=""
                        placeholder="Select Start Time"
                        value={shiftField?.shift_start_time}
                        editable={false}
                        backgroundColor="#fff"
                        bgColor={Config.Colors.inputField}
                        commonWidth={widthToDp(85)}
                        commonHeight={widthToDp(11)}
                        errorMessage={errorMessage?.shift_start_time ?? ''}
                        borderColor={
                          errorMessage?.shift_start_time
                            ? Config.Colors.errorFieldBorder
                            : Config.Colors.themeColor
                        }
                        countryCode=""
                        maxLength={undefined}
                        ref={undefined}
                        leftImage={null}
                        tintColor={Config.Colors.themeColor}
                        onSubmitEditing={undefined}
                        onChange={undefined}
                        onFocusFunction={undefined}
                        autoFocus={false}
                      />
                    </TouchableOpacity>
                  </View>
 
                  <View style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        fontSize: widthToDp(3),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                        color: '#6b7280',
                        marginBottom: 6,
                      }}
                    >
                      Shift End Time
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTimePicker({ show: true, field: 'shift_end_time' })
                      }
                    >
                      <CustomInputAny
                        lable=""
                        placeholder="Select End Time"
                        value={shiftField?.shift_end_time}
                        editable={false}
                        backgroundColor="#fff"
                        bgColor={Config.Colors.inputField}
                        commonWidth={widthToDp(85)}
                        commonHeight={widthToDp(11)}
                        errorMessage={errorMessage?.shift_end_time ?? ''}
                        borderColor={
                          errorMessage?.shift_end_time
                            ? Config.Colors.errorFieldBorder
                            : Config.Colors.themeColor
                        }
                        countryCode=""
                        maxLength={undefined}
                        ref={undefined}
                        leftImage={null}
                        tintColor={Config.Colors.themeColor}
                        onSubmitEditing={undefined}
                        onChange={undefined}
                        onFocusFunction={undefined}
                        autoFocus={false}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
 
                {/* Punch In Settings */}
                <View
                  style={{
                    backgroundColor: Config.Colors.defaultColor,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: widthToDp(2),
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthToDp(4),
                      fontFamily: Config.fontFamilys.Poppins_SemiBold,
                      color: '#111827',
                      marginVertical: 12,
                    }}
                  >
                    Punch In Settings
                  </Text>
                  <View style={{ marginBottom: 18 }}>
                    <CustomLabelSelectorAny
                      label="Can Punch In"
                      options={punchOptions}
                      selectedValue={shiftField.can_punch_in}
                      onSelect={(val: string) =>
                        handleChange('can_punch_in', val)
                      }
                      errorMessage={errorMessage.can_punch_in}
                    />
                  </View>
                  {shiftField?.can_punch_in === 'limit' && (
                    <View style={{ marginBottom: 18 }}>
                      <Text
                        style={{
                          fontSize: widthToDp(3),
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                          color: '#6b7280',
                          marginBottom: 6,
                        }}
                      >
                        Start Limit
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setTimePicker({ show: true, field: 'start_limit' })
                        }
                      >
                        <CustomInputAny
                          lable=""
                          placeholder="Enter Start Limit (HH:MM:SS)"
                          value={shiftField?.start_limit}
                          editable={false}
                          backgroundColor="#fff"
                          errorMessage={errorMessage.start_limit}
                          borderColor={
                            errorMessage?.start_limit
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.themeColor
                          }
                          bgColor={Config.Colors.inputField}
                          commonWidth={widthToDp(85)}
                          commonHeight={widthToDp(11)}
                          countryCode=""
                          maxLength={undefined}
                          ref={undefined}
                          leftImage={null}
                          tintColor={Config.Colors.themeColor}
                          onSubmitEditing={undefined}
                          onChange={undefined}
                          onFocusFunction={undefined}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
 
                {/* Punch Out Settings */}
                <View
                  style={{
                    backgroundColor: Config.Colors.defaultColor,
                    padding: 10,
                    borderRadius: widthToDp(2),
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthToDp(4),
                      fontFamily: Config.fontFamilys.Poppins_SemiBold,
                      color: '#111827',
                      marginVertical: 12,
                    }}
                  >
                    Punch Out Settings
                  </Text>
                  <View style={{ marginBottom: 18 }}>
                    <CustomLabelSelectorAny
                      label="Can Punch Out"
                      options={punchOptions}
                      selectedValue={shiftField.can_punch_out}
                      onSelect={(val: string) =>
                        handleChange('can_punch_out', val)
                      }
                      errorMessage={errorMessage.can_punch_out}
                    />
                  </View>
                  {shiftField?.can_punch_out === 'limit' && (
                    <View style={{ marginBottom: 18 }}>
                      <Text
                        style={{
                          fontSize: widthToDp(3),
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                          color: '#6b7280',
                          marginBottom: 6,
                        }}
                      >
                        End Limit
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setTimePicker({ show: true, field: 'end_limit' })
                        }
                      >
                        <CustomInputAny
                          lable=""
                          placeholder="Enter End Limit (HH:MM:SS or leave empty)"
                          value={shiftField?.end_limit}
                          editable={false}
                          backgroundColor="#fff"
                          bgColor={Config.Colors.inputField}
                          commonWidth={widthToDp(85)}
                          errorMessage={errorMessage.end_limit}
                          borderColor={
                            errorMessage?.end_limit
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.themeColor
                          }
                          commonHeight={widthToDp(11)}
                          countryCode=""
                          maxLength={undefined}
                          ref={undefined}
                          leftImage={null}
                          tintColor={Config.Colors.themeColor}
                          onSubmitEditing={undefined}
                          onChange={undefined}
                          onFocusFunction={undefined}
                          autoFocus={false}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
 
                {/* Submit Button */}
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <CustomLinearButtonAny
                    commonWidth={widthToDp(50)}
                    text={
                      isUpdating
                        ? t(Config.otherText?.update)
                        : t(Config.otherText?.submit)
                    }
                    onPress={postShift}
                    color={Config.Colors.defaultColor}
                    Icons={null}
                    tintColor={Config.Colors.defaultColor}
                    IconsRigth={null}
                    padding={0}
                  />
                </View>
 
                {timePicker.show && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onTimeChange}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </CustomModal>
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1 },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: widthToDp(90),
    margin: 1,
    padding: 10,
  },
  boxContainer: {
    alignSelf: 'center',
  },
  detailText: {
    color: Config.Colors.textColor.textColor_1,
    fontSize: widthToDp(3.5),
    fontFamily: Config.fontFamilys.Poppins_Regular,
    marginTop: 2,
  },
});
 
export default React.memo(Shift);