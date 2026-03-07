import { View, StyleSheet, FlatList, Text, ScrollView } from 'react-native';
import React from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { apiPostService } from '../../helpers/services';
import * as Constants from '../../helpers/Constants';
import { isApiSuccess } from '../../helpers/Validation';
import CustomModal from '../../components/CustomModal';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  CustomDropDownComponent,
  CustomInput,
  CustomLabelSelector,
  CustomLinearButton,
} from '../../components/CustomElements';
import { formatTime } from '../../helpers/utils';
import AltertBox from '../../components/AltertBox';

const Break = ({ navigation }) => {
  const { t } = useTranslation();
  const [breakList, setbreakList] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [breakField, setBreakField] = React.useState({
    id: undefined,
    break_name: '',
    break_type: '',
    break_duration: '',
  });
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [timePicker, setTimePicker] = React.useState({
    show: false,
    field: null, // "break_duration",
  });
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedBreak, setSelectedBreak] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState({
    breakName: '',
    breakType: '',
    breakDuration: '',
  });

  // Go back
  const goBackScreen = () => {
    navigation.goBack();
  };

  // For getting all the Break list
  const fetchBreakList = async () => {
    const apiData = await apiPostService(Constants.breakList, { filter: '' });
    if (isApiSuccess(apiData)) {
      setbreakList(apiData?.data?.result?.data || []);
    }
  };

  // For adding breaks
  const addBreak = async () => {
    // Validate all fields
    const errors = {
      breakName: !breakField.break_name ? 'Break Name is required' : '',
      breakType: !breakField.break_type ? 'Break Type is required' : '',
      breakDuration:
        breakField.break_type === 'paid' && !breakField.break_duration
          ? 'Break Duration is required for paid break'
          : '',
    };

    setErrorMessage(errors); // update state so errors show in UI
    if (
      errors?.breakName?.length > 0 ||
      errors?.breakType?.length > 0 ||
      errors?.breakDuration?.length > 0
    ) {
      return;
    }
    const apiUrl = isUpdating ? Constants.updateBreak : Constants.addBreak;
    const apiData = await apiPostService(apiUrl, breakField);

    if (isApiSuccess(apiData)) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Break added successfully',
      });
      setOpenModal(false);
      setBreakField({
        id: undefined,
        break_name: '',
        break_type: '',
        break_duration: '',
      });
      fetchBreakList();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: apiData?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleDeleteModal = id => {
    setDeleteModal(true);
    setSelectedBreak({
      statusText: `Are you sure you want to delete this \n break ?`,
      confirm: () => deleteBreak(id),
      cancel: () => setDeleteModal(false),
    });
  };

  // For deleting Break
  const deleteBreak = async id => {
    const apiData = await apiPostService(Constants.deleteBreak, { id });
    if (isApiSuccess(apiData)) {
      Toast.show({
        type: 'success',
        text1: `${apiData?.data?.message}`,
        text2: `${apiData?.data?.status}`,
      });
      fetchBreakList();
    } else {
      Toast.show({
        type: 'error',
        text1: `${apiData?.data?.message}`,
        text2: `${apiData?.data?.status}`,
      });
    }
    setDeleteModal(false);
  };

  // When user picks time
  const onTimeChange = (event, selectedDate) => {
    setTimePicker({ show: false, field: null });
    if (event.type === 'set' && selectedDate && timePicker.field) {
      setBreakField({
        ...breakField,
        [timePicker.field]: formatTime(selectedDate),
      });
    }
  };

  // For showing break list
  const renderBreak = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setIsUpdating(true);
          setBreakField(item);
          setOpenModal(true);
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            marginVertical: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {/* Top row: Shift Name & Type */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                color: Config.Colors.textColor.textColor_1,
                fontSize: widthToDp(4),
                fontFamily: Config.fontFamilys.Poppins_SemiBold,
              }}
            >
              {item?.break_name}
            </Text>

            {/* Break type as badge */}
            <View
              style={{
                backgroundColor:
                  item?.break_type === 'paid'
                    ? 'rgba(34,197,94,0.15)' // green tint
                    : 'rgba(239,68,68,0.15)', // red tint
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: item?.break_type === 'paid' ? '#16a34a' : '#dc2626',
                  fontSize: widthToDp(3),
                  fontFamily: Config.fontFamilys.Poppins_Medium,
                }}
              >
                {item?.break_type?.toUpperCase()}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                color: Config.Colors.textColor.textColor_2,
                fontSize: widthToDp(3.2),
                fontFamily: Config.fontFamilys.Poppins_Regular,
              }}
            >
              Duration: {item?.break_duration}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteModal(item?.id)}>
              <Text
                style={{
                  backgroundColor: '#dc2626',
                  color: Config.Colors.defaultColor,
                  fontSize: widthToDp(3.2),
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  fontFamily: Config.fontFamilys.Poppins_Medium,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
          {/* Duration */}
        </View>
      </TouchableOpacity>
    );
  };

  const onError = (field, value) => {
    let message = '';
    if (field === 'break_name' && !value) {
      message = 'Break Name is required';
    }
    if (field === 'break_type' && !value) {
      message = 'Break Type is required';
    }
    if (
      field === 'break_duration' &&
      breakField.break_type === 'paid' &&
      !value
    ) {
      message = 'Break Duration is required for paid break';
    }

    setErrorMessage(prev => ({
      ...prev,
      [field === 'break_name'
        ? 'breakName'
        : field === 'break_type'
        ? 'breakType'
        : field === 'break_duration'
        ? 'breakDuration'
        : field]: message,
    }));
  };

  // handleChange for inputs
  const handleChange = (field, value) => {
    setBreakField(prev => ({
      ...prev,
      [field]: value,
    }));

    // Validation inline
    onError(field, value);
  };

  const addBreakModule = () => {
    setIsUpdating(false);
    setBreakField({
      id: undefined,
      break_name: '',
      break_type: '',
      break_duration: '',
    });
    setOpenModal(true);
  };

  React.useEffect(() => {
    fetchBreakList();
  }, []);

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={`Break List`}
        animated={true}
        onPressLeft={goBackScreen}
        tintColorRight={Config.Colors.defaultColor}
        rightImage={Icons.add_icon}
        onPressRight={() => addBreakModule()}
      />

      <View style={{ margin: 20 }}>
        <FlatList
          renderItem={renderBreak}
          data={breakList}
          keyExtractor={(item, index) => `${item.break_name}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80, // ensures last card visible
          }}
        />
      </View>

      {deleteModal ? (
        <AltertBox
          isModalVisible={deleteModal}
          onRequestClose={() => setDeleteModal(false)}
          confirm={() => selectedBreak?.confirm()}
          cancel={() => selectedBreak?.cancel()}
          imageIcon={Icons?.check_icon}
          textMessage={{
            text1: t(selectedBreak?.statusText),
          }}
        />
      ) : null}

      {/* Add Break Modal */}
      {openModal && (
        <CustomModal
          modalVisible={openModal}
          onRequestClose={() => setOpenModal(!openModal)}
          alignItems="center"
          justifyContent="center"
          disableOnPress={false}
          showHeader={true}
          animationType="slide"
        >
          <ScrollView
            style={{
              width: widthToDp(100),
              backgroundColor: Config.Colors.bodyBg,
              borderRadius: widthToDp(2),
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ alignItems: 'center' }}>
              {/* Header */}
              <Header_2
                leftImage={Icons.arrow_back}
                commonWidth={widthToDp(12)}
                commonHeight={heightToDp(5)}
                leftText={isUpdating ? 'Update Break' : 'Add Break'}
                animated={true}
                onPressLeft={() => setOpenModal(!openModal)}
              />

              <View style={{ width: widthToDp(90), marginTop: 10 }}>
                {/* SECTION: Break Details */}
                <View
                  style={{
                    backgroundColor: Config.Colors.defaultColor,
                    padding: 12,
                    marginBottom: 12,
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
                    Break Details
                  </Text>

                  {/* Break Name */}
                  <View style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        fontSize: widthToDp(3),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                        color: '#6b7280',
                        marginBottom: 6,
                      }}
                    >
                      Break Name
                    </Text>
                    <CustomInput
                      placeholder="Enter Break Name"
                      value={breakField?.break_name}
                      onChangeText={text => handleChange('break_name', text)}
                      backgroundColor="#fff"
                      bgColor={Config.Colors.inputField}
                      commonWidth={widthToDp(85)}
                      commonHeight={widthToDp(11)}
                      errorMessage={
                        errorMessage?.breakName ? errorMessage?.breakName : ''
                      }
                      borderColor={
                        errorMessage?.breakName
                          ? Config.Colors.errorFieldBorder
                          : Config.Colors.themeColor
                      }
                      leftImage={Icons?.branch_icon}
                    />
                  </View>
                </View>

                {/* SECTION: Break Type */}
                <View
                  style={{
                    backgroundColor: Config.Colors.defaultColor,
                    padding: 12,
                    marginBottom: 12,
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
                    Break Type
                  </Text>

                  {/* Paid / Unpaid Selector */}
                  <View style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        fontSize: widthToDp(3),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                        color: '#6b7280',
                        marginBottom: 6,
                      }}
                    >
                      Select Break Type
                    </Text>
                    <CustomLabelSelector
                      label="Break Type"
                      options={[
                        { label: 'Paid', value: 'paid' },
                        { label: 'Unpaid', value: 'unpaid' },
                      ]}
                      selectedValue={breakField.break_type}
                      errorMessage={
                        errorMessage?.breakType ? errorMessage?.breakType : ''
                      }
                      borderColor={
                        errorMessage?.breakType
                          ? Config.Colors.errorFieldBorder
                          : Config.Colors.themeColor
                      }
                      onSelect={val => handleChange('break_type', val)}
                    />
                  </View>

                  {/* If Paid → Break Duration */}
                  {breakField?.break_type === 'paid' && (
                    <View style={{ marginBottom: 18 }}>
                      <Text
                        style={{
                          fontSize: widthToDp(3),
                          fontFamily: Config.fontFamilys.Poppins_Medium,
                          color: '#6b7280',
                          marginBottom: 6,
                        }}
                      >
                        Break Duration
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setTimePicker({ show: true, field: 'break_duration' })
                        }
                      >
                        <CustomInput
                          placeholder="Enter Break Duration"
                          value={breakField?.break_duration}
                          editable={false}
                          backgroundColor="#fff"
                          bgColor={Config.Colors.inputField}
                          commonWidth={widthToDp(85)}
                          commonHeight={widthToDp(11)}
                          errorMessage={
                            errorMessage?.breakDuration
                              ? errorMessage?.breakDuration
                              : ''
                          }
                          borderColor={
                            errorMessage?.breakDuration
                              ? Config.Colors.errorFieldBorder
                              : Config.Colors.themeColor
                          }
                          leftImage={Icons?.branch_icon}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Submit Button */}
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <CustomLinearButton
                    commonWidth={widthToDp(50)}
                    text={
                      isUpdating
                        ? t(Config.otherText?.update)
                        : t(Config.otherText?.submit)
                    }
                    onPress={() => addBreak()}
                    color={Config.Colors.defaultColor}
                  />
                </View>

                {/* Time Picker */}
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

export default React.memo(Break);
