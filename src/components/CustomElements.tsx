import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useRef } from 'react';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';
import country_code from '../../country_code.json';
import { SvgXml } from 'react-native-svg';
import { Search_icon } from '../helpers/Svg';
import Checkbox from 'react-native-check-box';

export const CustomLine = ({
  commonWidth = widthToDp(40),
  commonHight = heightToDp(2),
  bgColor = '#fff',
  justifyContent = 'flex-start',
  alignSelf = 'flex-start',
}) => {
  return (
    <View style={{ justifyContent: justifyContent, alignSelf: alignSelf }}>
      <View
        style={{
          width: commonWidth,
          backgroundColor: bgColor,
          height: commonHight,
        }}
      ></View>
    </View>
  );
};
export const CustomCheckBox = ({
  isChecked,
  onChange,
  style,
  rightText,
  rightTextStyle,
  checkBoxColor,
  onClick,
  checkedCheckBoxColor,
  uncheckedCheckBoxColor,
  leftText,
  leftTextStyle,
}) => {
  return (
    <Checkbox
      onClick={onClick}
      isChecked={isChecked}
      onChange={onChange}
      style={style}
      rightText={rightText}
      rightTextStyle={rightTextStyle}
      checkBoxColor={checkBoxColor}
      checkedCheckBoxColor={checkedCheckBoxColor}
      uncheckedCheckBoxColor={uncheckedCheckBoxColor}
      leftText={leftText}
      leftTextStyle={leftTextStyle}
    />
  );
};

// export const CustomRadioButton = ({ onPress, radioButtons, layout, containerStyle, label, labelStyle, disabled, color, borderSize, borderColor, size }) => {
//   return (
//     <RadioGroup
//       onPress={onPress}
//       radioButtons={radioButtons}
//       layout={layout}
//       containerStyle={containerStyle}
//       label={label}
//       labelStyle={labelStyle}
//       disabled={disabled}
//       color={color}
//       borderSize={borderSize}
//       borderColor={borderColor}
//       size={size}
//     />
//   )
// }

export const CustomInputBox = ({
  commonWidth = widthToDp(100),
  commonHeight = widthToDp(12),
  borderColor = Config.Colors.themeColor,
  onChangeText,
  inputValue,
  placeholder,
  keyboardType,
  autoComplete,
  errorMessage,
  numberOfLines,
  autoCapitalize,
  leftImage,
  tintColor,
  rightImage,
  commmonBorderRadius = widthToDp(2),
  commonBackgroundColor,
  CommonBorderWidth,
  commonElevation,
  onFocusFunction,
  editable = true,
  multiline = false,
}) => {
  return (
    <View
      style={{
        width: commonWidth,
        height: commonHeight,
        borderWidth: 1,
        borderRadius: commmonBorderRadius,
        backgroundColor: commonBackgroundColor,
        borderWidth: CommonBorderWidth,
        elevation: commonElevation,
      }}
    >
      {leftImage ? (
        <View
          style={{
            paddingLeft: 10,
            justifyContent: 'center',
            height: commonHeight,
            width: commonWidth,
            position: 'absolute',
          }}
        >
          <Image
            source={leftImage}
            style={{
              width: 20,
              height: 20,
              tintColor: { tintColor },
            }}
          />
        </View>
      ) : null}
      <TextInput
        editable={editable}
        style={{
          width: commonWidth,
          // height: commonHeight,
          paddingLeft: leftImage ? 50 : 15,
          fontFamily: Config.fontFamilys.Poppins_Medium,
          borderWidth: 1,
          borderColor: borderColor,
          borderRadius: commmonBorderRadius,
          color: Config.Colors.black,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        enablesReturnKeyAutomatically={true}
        onFocus={onFocusFunction}
        placeholderTextColor={Config.Colors.black}
        onChangeText={text => onChangeText(text)}
        value={inputValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        // autoComplete='given-name'
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
      />
      {rightImage ? (
        <View
          style={{
            paddingLeft: 10,
            justifyContent: 'center',
            height: commonHeight,
            width: commonWidth,
            position: 'absolute',
          }}
        >
          <Image
            source={rightImage}
            style={{
              width: 20,
              height: 20,
              tintColor: { tintColor },
            }}
          />
        </View>
      ) : null}
      {errorMessage ? (
        <Text style={{ color: borderColor }}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};
export const CustomDropDownComponent = ({
  commonWidth = widthToDp(100),
  commonHeight = widthToDp(10),
  borderColor = null,
  errorMessage,
  data = [],
  placeholder,
  onChangeDropDown,
  backgroundColor = null,
  initialValue = null,
  defaultColor = null,
  containerStyle,
}) => {
  const [value, setValue] = React.useState();
  console.log('value', value);
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const [isFocus, setIsFocus] = React.useState(false);
  const renderLabel = () => {
    if (value || isFocus) {
      return placeholder ? (
        <View>
          <Text
            style={[
              {
                color: '#FFF',
                color: defaultColor,
                // position: 'absolute',
                top: 5,
                zIndex: 999,
                paddingHorizontal: 8,
                fontSize: 14,
              },
            ]}
          >
            {placeholder}
          </Text>
        </View>
      ) : null;
    }
    return null;
  };

  return (
    <View style={{}}>
      {placeholder ? renderLabel() : null}
      <Dropdown
        style={[
          {
            width: commonWidth,
            height: commonHeight,
            borderColor: borderColor ? borderColor : null,
            fontFamily: Config.fontFamilys.Poppins_Light,
            backgroundColor: backgroundColor ? backgroundColor : null,
            borderWidth: borderColor ? 1 : 0,
            borderRadius: 6,
            paddingHorizontal: 8,
          },
          isFocus && { borderColor: borderColor },
        ]}
        placeholderStyle={{
          ...styles.placeholderStyle,
          color: defaultColor ? defaultColor : Config.Colors.defaultColor,
        }}
        selectedTextStyle={{
          fontSize: 14,
          color: defaultColor ? defaultColor : Config.Colors.black,
          bottom: 5,
        }}
        inputSearchStyle={{
          ...styles.inputSearchStyle,
          color: defaultColor ? defaultColor : Config.Colors.black,
        }}
        iconStyle={[
          styles.iconStyle,
          { tintColor: defaultColor ? defaultColor : Config.Colors.black },
          isFocus && { transform: [{ rotate: '180deg' }] },
        ]}
        itemTextStyle={{ color: Config.Colors.black }}
        containerStyle={containerStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onChangeDropDown(item.value);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? 'blue' : 'black'}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      />
      {errorMessage ? (
        <Text style={{ color: Config.Colors.black }}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export const SelectCountryScreen = ({
  onChangeText,
  defaultCode,
  commonWidth = widthToDp(25),
  commonHeight = widthToDp(12),
  containerStyle,
}) => {
  const [country, setCountry] = React.useState(defaultCode);
  return (
    <Dropdown
      style={{
        height: commonHeight,
        minWidth: commonWidth,
        backgroundColor: Config.Colors.inputField_1,
        borderTopLeftRadius: widthToDp(1),
        borderBottomLeftRadius: widthToDp(1),
        paddingHorizontal: 8,
        fontFamily: Config.fontFamilys.Poppins_Medium,
      }}
      selectedTextStyle={custyles.selectedTextStyle}
      placeholderStyle={custyles.placeholderStyle}
      imageStyle={custyles.imageStyle}
      inputSearchStyle={custyles.inputSearchStyle}
      iconStyle={custyles.iconStyle}
      containerStyle={containerStyle}
      search
      maxHeight={200}
      value={country}
      autoScroll={false}
      data={country_code}
      valueField="value"
      labelField="lable"
      searchPlaceholder="Search..."
      onChangeText={() => {
        console.log('tes');
      }}
      onChange={e => {
        setCountry(e.value);
        onChangeText(e.value);
      }}
    />
  );
};

export const CustomInput = ({
  lable,
  placeholder = '',
  keyboardType = 'default',
  autoComplete = 'email',
  onChangeText,
  value,
  commonHeight = widthToDp(12),
  commonWidth = widthToDp(60),
  bgColor = '#fff',
  borderBottomRightRadius = widthToDp(1),
  borderTopRightRadius = widthToDp(1),
  borderRadius = widthToDp(1),
  countryCodeStatus = false,
  countryCode,
  maxLength,
  textAlign = 'left',
  inputColor = '#000',
  ref,
  autoCapitalize = 'none',
  numberOfLines = 1,
  borderColor = '#fff',
  multiline = false,
  backgroundColor = '#FFF',
  textAlignVertical = 'top',
  errorMessage = '',
  leftImage,
  tintColor,
  returnKeyType = 'default',
  onSubmitEditing,
  onChange,
  fontSize = 14,
  editable = true,
  onFocusFunction,
  autoFocus,
}) => {
  const inputRef = useRef(null);
  return (
    <>
      <View>
        <View>{lable ? <Text style={styles.lable}>{lable}</Text> : null}</View>
        <View
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {leftImage ? (
            <View
              style={{
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                width: 20,
                height: commonHeight,
                position: 'absolute',
                zIndex: 2,
                // backgroundColor:'#000'
              }}
            >
              <Image
                source={leftImage}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: tintColor,
                }}
              />
            </View>
          ) : null}
          <TextInput
            style={{
              ...styles.input,
              ...styles.commonInput,
              width: commonWidth,
              height: commonHeight,
              borderBottomRightRadius: borderBottomRightRadius,
              borderTopRightRadius: borderTopRightRadius,
              textAlign: textAlign,
              color: inputColor,
              borderRadius: borderRadius,
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              paddingLeft: leftImage ? 50 : 10,
              fontSize: fontSize,
              fontFamily: Config.fontFamilys.Poppins_Medium,
            }}
            autoFocus={autoFocus}
            onFocus={onFocusFunction}
            placeholderTextColor={Config.Colors.textColor.textColor_1}
            ref={ref}
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoComplete={autoComplete}
            onChangeText={text => onChangeText(text)}
            maxLength={maxLength}
            value={value}
            // onSubmitEditing={(e) =>onSubmitEditing(e.nativeEvent.text)}
            returnKeyType={returnKeyType}
            autoCapitalize={autoCapitalize}
            numberOfLines={numberOfLines}
            textAlignVertical={textAlignVertical}
            multiline={multiline}
          />
        </View>
        {errorMessage ? (
          <Text style={{ color: borderColor, marginTop:5 }}>{errorMessage}</Text>
        ) : null}
      </View>
    </>
  );
};
export const CustomMultiInput = ({
  lable,
  placeholder = '',
  keyboardType = 'default',
  autoComplete = 'email',
  onChangeFun,
  value,
  commonHeight = heightToDp(8),
  commonWidth = widthToDp(60),
  bgColor = '#fff',
  borderRadius,
  maxLength = 10,
  textAlign = 'left',
  inputColor = '#000',
  length,
}) => {
  const inputRef = useRef([]);
  const handleChange = (text, index) => {
    if (text.length !== 0) {
      return inputRef?.current[index + 1]?.focus();
    } else {
      return inputRef?.current[index - 1]?.focus();
    }
  };
  const handleBackSpace = (event, index) => {
    const { nativeEvent } = event;
    if (nativeEvent.key === 'Backspace') {
      handleChange('', index);
    }
  };
  return (
    <>
      {[...new Array(length)].map((item, index) => (
        <View key={index}>
          <View>
            {lable ? <Text style={styles.lable}>{lable}</Text> : null}
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TextInput
              style={{
                ...styles.input,
                ...styles.commonInput,
                width: commonWidth,
                height: commonHeight,
                backgroundColor: bgColor,
                borderRadius: borderRadius,
                textAlign: textAlign,
                color: inputColor,
              }}
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoComplete={autoComplete}
              onChangeText={text => handleChange(text, index)}
              maxLength={maxLength}
              // value={value}
              ref={ref => {
                if (ref && !inputRef.current.includes(ref)) {
                  inputRef.current = [...inputRef.current, ref];
                }
              }}
              onKeyPress={event => handleBackSpace(event, index)}
              selectTextOnFocus
              contextMenuHidden
            />
          </View>
        </View>
      ))}
    </>
  );
};
export const CustomLinearButton = ({
  commonHeight = widthToDp(14),
  commonWidth = widthToDp(20),
  text = '',
  onPress,
  disabled = false,
  Icons,
  tintColor,
  activeOpacity = 1,
  color = Config.Colors.black,
  borderRadius = 100,
  iconHeight = 22,
  iconWidth = 20,
  IconsRigth,
  fontSize = 16,
  paddingLeft = 15,
  paddingRight = 15,
  padding,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={{
        elevation: 20,
        // borderRadius: borderRadius
      }}
    >
      <LinearGradient
        locations={[0, 0.8]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[Config.lineColor.color1, Config.lineColor.color2]}
        style={{
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
          padding: padding,
          width: commonWidth,
          borderRadius: borderRadius,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {Icons ? (
            <Image
              source={Icons}
              style={{
                height: iconHeight,
                width: iconWidth,
                tintColor: tintColor,
                resizeMode: 'contain',
              }}
            />
          ) : null}

          <Text
            style={{ ...styles.buttonText, fontSize: fontSize, color: color }}
          >
            {text}
          </Text>
          {IconsRigth ? (
            <Image
              source={IconsRigth}
              style={{
                height: iconHeight,
                width: iconWidth,
                tintColor: '#fff',
                resizeMode: 'contain',
              }}
            />
          ) : null}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const CustomButton = ({
  commonHeight = widthToDp(14),
  commonWidth = widthToDp(20),
  text = '',
  onPress,
  disabled = false,
  Icons,
  tintColor,
  activeOpacity = 1,
  elevation,
  backgroundColor = '#9ba2ad',
  color = Config.Colors.black,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
      <View
        style={{
          ...styles.linearGradient,
          width: commonWidth,
          backgroundColor: backgroundColor,
          elevation: elevation,
          borderRadius: 100,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {Icons ? (
            <Image
              source={Icons}
              style={{ height: 22, width: 20, tintColor: '#fff' }}
            />
          ) : null}

          <Text style={{ ...styles.buttonText, color: color }}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const Button = React.memo(
  ({ text = '', onPress, styles, image, tintColor, onLongPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[Config.lineColor.color1, Config.lineColor.color2]}
          style={styles?.linearGradient}
        >
          {image ? (
            <Image
              source={image}
              style={styles?.btnImage}
              tintColor={tintColor}
            />
          ) : null}
          <Text style={styles?.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);

// ---- Custom Label Selector ----
export const CustomLabelSelector = ({
  label,
  options = [],
  selectedValue,
  onSelect,
  containerWidth = widthToDp(90),
  errorMessage,
}) => {
  return (
    <View style={{ marginBottom: errorMessage ? heightToDp(2) : heightToDp(1) }}>
      <View style={[styles.container, { width: containerWidth }]}>
        <Text style={styles.selectorLabel}>{label}</Text>
        <View style={styles.optionWrapper(containerWidth)}>
          {options.map(option => {
            const isSelected = selectedValue === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => onSelect(option.value)}
                activeOpacity={0.8}
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: isSelected ? Config.Colors.themeColor : '#f3f4f6',
                    borderColor: isSelected ? Config.Colors.themeColor : '#d1d5db',
                    shadowOpacity: isSelected ? 0.2 : 0.05,
                    elevation: isSelected ? 4 : 2,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: widthToDp(3.2),
                    color: isSelected ? '#fff' : '#374151',
                    fontWeight: isSelected ? '600' : '500',
                    fontFamily: Config.fontFamilys.Poppins_Regular,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

// export const customCheckBox = ({
//   commonWidth:widthToDp(40),
//   commonHight:heightToDp(2),
// }) => {
//   return (
//     <View>

//     </View>
//   )
// }

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  lable: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  left_input: {
    height: 70,
    width: 80,
    textAlign: 'center',
    backgroundColor: Config.Colors.inputField_1,
    borderColor: Config.Colors.inputField_1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  input: {
    backgroundColor: Config.Colors.inputField,
    borderColor: Config.Colors.inputField,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  commonInput: {
    fontSize: widthToDp(3),
    padding: 10,
    borderWidth: 1,
    fontFamily: Config.fontFamilys.Poppins_Light,
  },
  linearGradient: {
    // flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
  },
  buttonText: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    textAlign: 'center',
    margin: 10,
    color: Config.Colors.black,
    fontWeight: Config.WEIGHTS.medium,
  },
  container: {
    // backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    // borderWidth: 1,
    // borderRadius: 6,
    // paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    // position: 'absolute',
    // left: 0,
    // top: 1,
    // zIndex: 999,
    // paddingHorizontal: 8,
    // fontSize: 10,
    // color: Config.Colors.black
  },
  placeholderStyle: {
    fontSize: 16,
    color: Config.Colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  mainLabel: {
    fontSize: widthToDp(3.5),
    fontWeight: '600',
    marginBottom: 8,
    color: Config.Colors.black,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: Config.Colors.inputField,
    borderWidth: 1,
    borderColor: Config.Colors.borderColor,
  },
  selectedOption: {
    backgroundColor: Config.Colors.themeColor,
    borderColor: Config.Colors.themeColor,
  },
  optionText: {
    fontSize: widthToDp(3.2),
    color: Config.Colors.black,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
   errorText: {
    color: 'red',
    fontSize: widthToDp(3),
    marginTop: heightToDp(0.5),
    fontFamily: Config.fontFamilys.Poppins_Regular,
  },
  selectorLabel: {
    fontSize: widthToDp(3.2),
    color: '#6b7280',
    marginBottom: 5,
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  optionWrapper: width => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthToDp(2),
    width: width,
  }),
  optionBox: {
    paddingVertical: heightToDp(1.5),
    paddingHorizontal: widthToDp(4),
    borderRadius: widthToDp(2),
    minWidth: widthToDp(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
  },
});

const custyles = StyleSheet.create({
  dropdown: {
    height: widthToDp(12),
    width: widthToDp(25),
    backgroundColor: Config.Colors.inputField_1,
    borderRadius: widthToDp(1),
    paddingHorizontal: 8,
  },
  selectedTextStyle: {
    color: Config?.Colors?.textColor?.textColor_2,
    fontFamily: Config?.fontFamilys?.Poppins_SemiBold,
    fontWeight: Config?.WEIGHTS?.medium,
    fontSize: 17,
  },
});
