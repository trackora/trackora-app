import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useSelector } from 'react-redux';
import {
  CustomButton,
  CustomDropDownComponent,
  CustomInput,
  CustomInputBox,
  CustomLinearButton,
} from '../../components/CustomElements';
import { isApiSuccess, validateEmail } from '../../helpers/Validation';
import { apiPostService } from '../../helpers/services';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const Enquiry = ({ navigation, route }) => {
  const initialState = {
    email: '',
    enquiry: '',
    type: '',
  };
  const [enquiryField, setEnquiryField] = React.useState(initialState);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { t } = useTranslation();

  // For going back to previous screen
  const goBackScreen = () => {
    navigation.goBack();
  };

  // For change event
  const onChange = text => {
    setEnquiryField(prv => ({ ...prv, ...text }));
    setErrorMessage(null);
  };

  const handleDropDown = text => {
    setEnquiryField(prv => ({ ...prv, ...text }));
    setErrorMessage(null);
  };

  const addEnquiry = async () => {
    if (
      enquiryField.email === '' &&
      enquiryField.type === '' &&
      enquiryField.enquiry === ''
    ) {
      setErrorMessage(prv => ({
        ...prv,
        email: t(Config.otherText?.required),
        type: t(Config?.otherText?.required),
        enquiry: t(Config?.otherText?.required),
      }));
    } else if (enquiryField.type === '') {
      setErrorMessage(prv => ({
        ...prv,
        type: t(Config?.otherText?.required),
      }));
    } else if (enquiryField.enquiry === '') {
      setErrorMessage(prv => ({
        ...prv,
        enquiry: t(Config?.otherText?.required),
      }));
    } else if (enquiryField.email === '') {
      setErrorMessage(prv => ({
        ...prv,
        email: t(Config?.otherText?.required),
      }));
    } else if (!validateEmail(enquiryField.email)) {
      setErrorMessage(prv => ({
        ...prv,
        email: t(Config.holidayListText?.please_enter_valid_email_address),
      }));
    } else {
      const bodyData = { ...enquiryField };
      const apiData = await apiPostService(
        Constants?.submit_enquiry_api,
        bodyData,
      );
      if (isApiSuccess(apiData)) {
        Toast.show({
          type: 'success',
          text1: `${apiData?.data?.message}`,
          text2: `${apiData?.data?.status}`,
          swipeable: true,
        });
        navigation.navigate('Menu');
        setEnquiryField(initialState);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={t(Config.holidayListText?.enquiry)}
        animated={true}
        onPressLeft={goBackScreen}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.body}>
          <View style={styles?.boxContainerIner}>
            <View style={styles.messageBoxContainer}>
              <Text style={{ ...styles.messageBox }}>
                {t(Config.holidayListText?.email)} *
              </Text>
            </View>
            <CustomInput
              keyboardType="email-address"
              bgColor={Config.Colors.inputField}
              countryCodeStatus={true}
              // lable={'Mobile No.'}
              autoComplete="email"
              autoCapitalize={'none'}
              onChangeText={text => onChange({ email: text })}
              value={enquiryField.email}
              commonHeight={54}
              commonWidth={widthToDp(90)}
              textAlignVertical="center"
              // errorMessage={errorMessage?.email ? errorMessage?.email : ''}
              borderColor={
                errorMessage?.email
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.borderColor
              }
            />
            <View style={styles.messageBoxContainer}>
              <Text style={{ ...styles.messageBox }}>
                {t(Config.salaryScreenText?.type)} *
              </Text>
            </View>
            <CustomDropDownComponent
              commonWidth={widthToDp(88)}
              commonHeight={54}
              // errorMessage={errorMessage?.type ? errorMessage?.type : ''}
              borderColor={
                errorMessage?.type
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.borderColor
              }
              data={Config.enquiryType}
              onChangeDropDown={text => handleDropDown({ type: text })}
              backgroundColor={Config.Colors.defaultColor}
            />
            <View style={styles.messageBoxContainer}>
              <Text style={styles.messageBox}>
                {t(Config.holidayListText?.enquiry_feedback)}
              </Text>
            </View>
            <CustomInput
              keyboardType="email-address"
              bgColor={Config.Colors.inputField}
              countryCodeStatus={true}
              // lable={'Mobile No.'}
              autoComplete="email"
              autoCapitalize={'none'}
              onChangeText={text => onChange({ enquiry: text })}
              value={enquiryField.enquiry}
              commonHeight={90}
              commonWidth={widthToDp(90)}
              numberOfLines={5}
              borderColor={
                errorMessage?.enquiry
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.borderColor
              }
              multiline={true}
            />
            {/* <CustomInputBox
                        commonWidth={widthToDp(88)}
                        commonHeight={widthToDp(20)}
                        placeholder={'Your enquiry / Feedback'}
                        keyboardType={'default'}
                        autoComplete={'cc-csc'}
                        errorMessage={errorMessage?.enquiry ? errorMessage?.enquiry : ''}
                        borderColor={errorMessage?.enquiry ? Config.Colors.errorFieldBorder : Config.Colors.themeColor}
                        numberOfLines={5}
                        onChangeText={(text) => onChange({ enquiry: text })}
                        inputValue={enquiryField.enquiry}
                    /> */}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                paddingRight: widthToDp(5),
                marginBottom: 10,
                marginTop: 50,
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CustomLinearButton
                  commonWidth={widthToDp(40)}
                  text={t(Config.otherText?.submit)}
                  onPress={() => addEnquiry()}
                  color={Config.Colors.defaultColor}
                  // Icons={Icons.edit_picture}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: 16,
    width: widthToDp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainerIner: {
    // marginBottom: widthToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    width: widthToDp(90),
    gap: widthToDp(2),
  },
  messageBox: {
    fontSize: widthToDp(3.5),
    fontWeight: Config.WEIGHTS.light,
    fontFamily: Config.fontFamilys.Poppins_Medium,
    color: Config.Colors.primary,
    marginBottom: -10,
    color: Config.Colors.black,
  },
  messageBoxContainer: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
export default React.memo(Enquiry);
