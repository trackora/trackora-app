import React from 'react';
import CustomModal from './CustomModal';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';
import { Header_2 } from './Header';
import {
  CustomDropDownComponent,
  CustomInput,
  CustomLinearButton,
} from './CustomElements';
import { useSelector } from 'react-redux';

const AttendanceDetails = ({ openModal, setOpenModal, onSubmit }) => {
  const initialForm = {
    attendance_type: '',
    travel_mode: '',
    odometer_reading: '',
    description: '',
  };

  const [attendField, setAttendField] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});

  const controls =
    useSelector(
      state =>
        state?.login?.data?.attendanceDetailsData?.data?.attendData?.controls,
    ) || {};

  const basic = controls?.basic || {};

  const attendanceTypeOptions =
    basic?.attendance_type_data?.map(item => ({
      label: item.label,
      value: item.code,
    })) || [];

  const travelModeOptions =
    basic?.travel_mode_data?.map(item => ({
      label: item.label,
      value: item.code,
    })) || [];

  const handleOnChange = (field, value) => {
    setAttendField(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '', // clear error if user fills again
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!attendField.attendance_type)
      newErrors.attendance_type = 'Attendance type is required';
    if (!attendField.travel_mode)
      newErrors.travel_mode = 'Travel mode is required';
    if (!attendField.odometer_reading)
      newErrors.odometer_reading = 'Odometer reading is required';
    if (!attendField.description)
      newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit();
    setOpenModal(false);
  };

  React.useEffect(() => {
    setAttendField(initialForm);
  }, []);

  return (
    <>
      {openModal ? (
        <CustomModal
          modalVisible={openModal}
          onRequestClose={() => setOpenModal(false)}
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
            <View style={styles.innerWrapper}>
              <Header_2
                leftImage={Icons.arrow_back}
                commonWidth={widthToDp(12)}
                commonHeight={heightToDp(5)}
                leftText={'Start Attendance'}
                animated={true}
                onPressLeft={() => setOpenModal(false)}
              />

              <View style={styles.formCard}>
                {/* Attendance Type */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Attendance Type</Text>
                  <CustomDropDownComponent
                    commonWidth={'100%'}
                    commonHeight={50}
                    borderColor={
                      errors.attendance_type
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                    data={attendanceTypeOptions}
                    onChangeDropDown={val =>
                      handleOnChange('attendance_type', val)
                    }
                    backgroundColor={Config.Colors.defaultColor}
                    initialValue={attendField?.attendance_type}
                  />
                  {errors.attendance_type && (
                    <Text style={styles.errorText}>
                      {errors.attendance_type}
                    </Text>
                  )}
                </View>

                {/* Travel Mode */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Travel Mode</Text>
                  <CustomDropDownComponent
                    commonWidth={'100%'}
                    commonHeight={50}
                    borderColor={
                      errors.travel_mode
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                    data={travelModeOptions}
                    onChangeDropDown={val => handleOnChange('travel_mode', val)}
                    backgroundColor={Config.Colors.defaultColor}
                    initialValue={attendField?.travel_mode}
                  />
                  {errors.travel_mode && (
                    <Text style={styles.errorText}>{errors.travel_mode}</Text>
                  )}
                </View>

                {/* Odometer Reading */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Odometer Reading</Text>
                  <CustomInput
                    placeholder={'Enter Odometer reading'}
                    keyboardType={'numeric'}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    bgColor={Config.Colors.inputField}
                    onChangeText={text =>
                      handleOnChange('odometer_reading', text)
                    }
                    value={attendField?.odometer_reading}
                    commonWidth={'100%'}
                    commonHeight={widthToDp(12)}
                    textAlignVertical="center"
                    borderColor={
                      errors.odometer_reading
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                  />
                  {errors.odometer_reading && (
                    <Text style={styles.errorText}>
                      {errors.odometer_reading}
                    </Text>
                  )}
                </View>

                {/* Description */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Description</Text>
                  <CustomInput
                    placeholder={'Enter description'}
                    keyboardType={'default'}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    bgColor={Config.Colors.inputField}
                    onChangeText={text => handleOnChange('description', text)}
                    value={attendField?.description}
                    commonWidth={'100%'}
                    commonHeight={widthToDp(25)}
                    textAlignVertical="top"
                    multiline={true}
                    borderColor={
                      errors.description
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                {/* Button */}
                <View style={styles.buttonRow}>
                  <CustomLinearButton
                    commonWidth={widthToDp(60)}
                    text={'Start Attendance'}
                    onPress={handleSubmit}
                    color={Config.Colors.defaultColor}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </CustomModal>
      ) : null}
    </>
  );
};

export default AttendanceDetails;

const styles = StyleSheet.create({
  innerWrapper: {
    width: widthToDp(100),
    height: heightToDp(100),
    alignItems: 'center',
  },
  formCard: {
    width: widthToDp(90),
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  fieldGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: widthToDp(3.5),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    color: '#666',
    marginBottom: 6,
  },
  errorText: {
    fontSize: widthToDp(3),
    color: Config.Colors.errorFieldBorder,
    marginTop: 4,
    marginLeft: 2,
    fontFamily: Config.fontFamilys.Poppins_Regular,
  },
  buttonRow: {
    marginTop: 25,
    alignItems: 'center',
  },
});
