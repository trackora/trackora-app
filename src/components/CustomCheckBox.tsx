//import liraries
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import * as Config from '../helpers/Config';
import { widthToDp } from '../helpers/Responsive';
// create a component
const CustomCheckBox = ({
  checkButtonText,
  handleOptionPress,
  checkBoxValue,
  index,
  disabled = false,
  alignItems = 'center',
  flexDirection = 'row',
}) => {
  const [visibility, setVisibility] = React.useState(false);
  return (
    <View style={{
      alignItems: alignItems,
      flexDirection: flexDirection,
    }}>
      <CheckBox
        disabled={disabled}
        value={visibility}
        onValueChange={newValue => {
          handleOptionPress(checkBoxValue, newValue, index);
          setVisibility(newValue)
        }}
        style={styles.checkBoxStyle}
        // onCheckColor={{ true: Config.colors.themeBgColor, false: Config.colors.themeBgColor }}
        // onFillColor={{ true: Config.colors.themeBgColor, false: Config.colors.themeBgColor }}
        // onTintColor={{ true: Config.colors.themeBgColor, false: Config.colors.themeBgColor }}
        tintColors={{ true: Config.Colors.black, false: Config.Colors.black }}
      />
      <View
        // onPress={() => {
        //   handleOptionPress(checkBoxValue, visibility, index);
        //   setVisibility(!visibility)
        // }}
        style={{ paddingRight: 10 }}
      >
        <Text style={{ color: Config.Colors.black, fontFamily: Config.fontFamilys.Poppins_Medium }}>{checkButtonText}</Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: '',
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkBoxStyle: {
    color: Config.Colors.black,
    // tintColor: Config?.image_tint_color,
    // width: widthToDp(6),
    // height: widthToDp(6),
    borderColor: Config.Colors.black
  },
});

//make this component available to the app

export const CompareCheckBox = ({
  checkButtonText,
  handlePress,
  checkBoxValue,
  visibility,
}) => {
  //const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <View style={{ ...styles.container }}>
      <CheckBox
        disabled={false}
        value={visibility}
        onValueChange={newValue => {
          handlePress(checkBoxValue, newValue);
        }}
        style={styles.checkBoxStyle}
      // onCheckColor={'#6F763F'}
      // onFillColor={'#4DABEC'}
      // onTintColor={'#F4DCF8'}
      />
      <View>
        <Text>{checkButtonText}</Text>
      </View>
    </View>
  );
};
export default CustomCheckBox;
