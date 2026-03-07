//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {widthToDp} from '../Common/Responsive';
import * as Config from '../Common/Config';

// create a component
const Button = ({
  text,
  _onPress,
  imagePath,
  buttonWidth = widthToDp(90),
  imageStyle,
  buttonHeight,
  borderRadiusOfButton,
  buttonContainerMargin,
  customFont = widthToDp(5.5),
  buttonColor = Config?.themeBgColor,
  textColor = '#fff',
  customFontWeight = 'bold',
  customPadding = widthToDp(2),
  justifyContent = 'center',
  activeOpacity = 0.2,
  hitSlop,
  gapBottom = 0,
}) => {

  return (
    <View
      style={{
        ...styles.container,
        ...{
          borderRadius: borderRadiusOfButton,
          marginRight: buttonContainerMargin,
          backgroundColor: buttonColor,
          padding: customPadding,
          marginBottom: gapBottom,
        },
      }}>
      <TouchableOpacity
        onPress={_onPress}
        style={{
          ...styles.buttonContainer,
          ...{
            width: buttonWidth,
            height: buttonHeight,
          },
        }}
        activeOpacity={activeOpacity}
        hitSlop={hitSlop}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: justifyContent as 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly',
            alignItems: 'center',
          }}>
          {imagePath ? (
            <View>
              <Image source={imagePath} style={imageStyle} />
            </View>
          ) : null}
          <View>
            <Text
              style={{
                ...styles.textStyle,
                fontSize: customFont,
                color: textColor,
                fontWeight: customFontWeight as 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
              }}>
              {text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthToDp(5),
  },
  buttonContainer: {
    width: widthToDp(90),
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: widthToDp(5.5),
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});

//make this component available to the app
export default Button;
