import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import React, { useRef } from 'react';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import country_code from '../../country_code.json';
import Checkbox from 'react-native-check-box';
 
type CustomLineProps = {
  commonWidth?: number;
  commonHight?: number;
  bgColor?: string;
  justifyContent?: ViewStyle['justifyContent'];
  alignSelf?: ViewStyle['alignSelf'];
};
 
export const CustomLine: React.FC<CustomLineProps> = ({
  commonWidth = widthToDp(40),
  commonHight = heightToDp(2),
  bgColor = '#fff',
  justifyContent = 'flex-start',
  alignSelf = 'flex-start',
}) => {
  return (
    <View style={{ justifyContent, alignSelf }}>
      <View
        style={{
          width: commonWidth,
          backgroundColor: bgColor,
          height: commonHight,
        }}
      />
    </View>
  );
};
 
type CustomCheckBoxProps = {
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
  rightText?: string;
  rightTextStyle?: StyleProp<TextStyle>;
  checkBoxColor?: string;
  onClick?: () => void;
  checkedCheckBoxColor?: string;
  uncheckedCheckBoxColor?: string;
  leftText?: string;
  leftTextStyle?: StyleProp<TextStyle>;
};
 
export const CustomCheckBox: React.FC<CustomCheckBoxProps> = props => {
  return <Checkbox {...props} />;
};
 
type CustomInputBoxProps = {
  commonWidth?: number;
  commonHeight?: number;
  borderColor?: string;
  onChangeText?: (text: string) => void;
  inputValue?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoComplete?: TextInputProps['autoComplete'];
  errorMessage?: string;
  numberOfLines?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  leftImage?: any;
  tintColor?: string;
  rightImage?: any;
  commmonBorderRadius?: number;
  commonBackgroundColor?: string;
  CommonBorderWidth?: number;
  commonElevation?: number;
  onFocusFunction?: () => void;
  editable?: boolean;
  multiline?: boolean;
  style?: StyleProp<ViewStyle | TextStyle>;
};
 
export const CustomInputBox: React.FC<CustomInputBoxProps> = ({
  commonWidth = widthToDp(100),
  commonHeight = widthToDp(12),
  borderColor = Config.Colors.themeColor,
  onChangeText = () => {},
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
        borderRadius: commmonBorderRadius,
        backgroundColor: commonBackgroundColor,
        borderWidth: CommonBorderWidth ?? 1,
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
              tintColor: tintColor,
            }}
          />
        </View>
      ) : null}
      <TextInput
        editable={editable}
        style={{
          width: commonWidth,
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
              tintColor: tintColor,
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
 
type DropDownItem = {
  label: string;
  value: string | number;
};
 
type CustomDropDownProps = {
  commonWidth?: number;
  commonHeight?: number;
  borderColor?: string | null;
  errorMessage?: string;
  data?: DropDownItem[];
  placeholder?: string;
  onChangeDropDown?: (value: string | number) => void;
  backgroundColor?: string | null;
  initialValue?: string | number | null;
  defaultColor?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
};
 
export const CustomDropDownComponent: React.FC<CustomDropDownProps> = ({
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
  const [value, setValue] = React.useState<string | number | null>(
    initialValue,
  );
  React.useEffect(() => {
    setValue(initialValue ?? null);
  }, [initialValue]);
  const [isFocus, setIsFocus] = React.useState(false);
 
  const renderLabel = () => {
    if (value || isFocus) {
      return placeholder ? (
        <View>
          <Text
            style={[
              {
                color: defaultColor ?? '#FFF',
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
    <View>
      {placeholder ? renderLabel() : null}
      <Dropdown
        style={[
          {
            width: commonWidth,
            height: commonHeight,
            borderColor: borderColor ? borderColor : undefined,
            backgroundColor: backgroundColor ? backgroundColor : undefined,
            borderWidth: borderColor ? 1 : 0,
            borderRadius: 6,
            paddingHorizontal: 8,
          } as ViewStyle,
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
          styles.iconStyle as ImageStyle,
          { tintColor: defaultColor ? defaultColor : Config.Colors.black },
          isFocus && { transform: [{ rotate: '180deg' }] },
        ] as ImageStyle[]}
        itemTextStyle={{ color: Config.Colors.black }}
        containerStyle={containerStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        searchPlaceholder="Search..."
        value={value as any}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onChangeDropDown?.(item.value);
        }}
      />
      {errorMessage ? (
        <Text style={{ color: Config.Colors.black }}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};
 
type SelectCountryScreenProps = {
  onChangeText: (value: string) => void;
  defaultCode?: string;
  commonWidth?: number;
  commonHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
};
 
export const SelectCountryScreen: React.FC<SelectCountryScreenProps> = ({
  onChangeText,
  defaultCode,
  commonWidth = widthToDp(25),
  commonHeight = widthToDp(12),
  containerStyle,
}) => {
  const [country, setCountry] = React.useState(defaultCode);
  const dropdownProps = {
      style: {
        height: commonHeight,
        minWidth: commonWidth,
        backgroundColor: Config.Colors.inputField_1,
        borderTopLeftRadius: widthToDp(1),
        borderBottomLeftRadius: widthToDp(1),
        paddingHorizontal: 8,
      } as ViewStyle,
      selectedTextStyle: custyles.selectedTextStyle,
      placeholderStyle: custyles.placeholderStyle,
      imageStyle: custyles.imageStyle,
      inputSearchStyle: custyles.inputSearchStyle,
      iconStyle: custyles.iconStyle,
      containerStyle: containerStyle,
      search: true,
      maxHeight: 200,
      value: country,
      autoScroll: false,
      data: country_code,
      valueField: 'value',
      labelField: 'lable',
      searchPlaceholder: 'Search...',
      onChange: (e: { value: string; label?: string }) => {
        setCountry(e.value);
        onChangeText(e.value);
      },
    };
  return <Dropdown {...(dropdownProps as any)} />;
};
 
type CustomInputProps = {
  lable?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoComplete?: TextInputProps['autoComplete'];
  onChangeText?: (text: string) => void;
  value?: string;
  commonHeight?: number;
  commonWidth?: number;
  bgColor?: string;
  borderBottomRightRadius?: number;
  borderTopRightRadius?: number;
  borderRadius?: number;
  countryCodeStatus?: boolean;
  countryCode?: string;
  maxLength?: number;
  textAlign?: TextInputProps['textAlign'];
  inputColor?: string;
  ref?: any;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  numberOfLines?: number;
  borderColor?: string;
  multiline?: boolean;
  backgroundColor?: string;
  textAlignVertical?: TextInputProps['textAlignVertical'];
  errorMessage?: string;
  leftImage?: any;
  tintColor?: string;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: (e: any) => void;
  onChange?: (text: string) => void;
  fontSize?: number;
  editable?: boolean;
  onFocusFunction?: () => void;
  autoFocus?: boolean;
};
 
export const CustomInput: React.FC<CustomInputProps> = ({
  lable,
  placeholder = '',
  keyboardType = 'default',
  autoComplete = 'email',
  onChangeText = () => {},
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
  return (
    <>
      <View>
        <View>{lable ? <Text style={styles.lable}>{lable}</Text> : null}</View>
        <View style={{ flexDirection: 'row' }}>
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
            returnKeyType={returnKeyType}
            autoCapitalize={autoCapitalize}
            numberOfLines={numberOfLines}
            textAlignVertical={textAlignVertical}
            multiline={multiline}
          />
        </View>
        {errorMessage ? (
          <Text style={{ color: borderColor, marginTop: 5 }}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
    </>
  );
};
 
type CustomMultiInputProps = {
  lable?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoComplete?: TextInputProps['autoComplete'];
  onChangeFun?: (text: string) => void;
  value?: string;
  commonHeight?: number;
  commonWidth?: number;
  bgColor?: string;
  borderRadius?: number;
  maxLength?: number;
  textAlign?: TextInputProps['textAlign'];
  inputColor?: string;
  length?: number;
};
 
export const CustomMultiInput: React.FC<CustomMultiInputProps> = ({
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
  length = 0,
}) => {
  const inputRef = useRef<TextInput[]>([]);
  const handleChange = (text: string, index: number) => {
    if (text.length !== 0) {
      return inputRef?.current[index + 1]?.focus();
    } else {
      return inputRef?.current[index - 1]?.focus();
    }
  };
  const handleBackSpace = (event: any, index: number) => {
    const { nativeEvent } = event;
    if (nativeEvent.key === 'Backspace') {
      handleChange('', index);
    }
  };
  return (
    <>
      {[...new Array(length)].map((_, index) => (
        <View key={index}>
          <View>{lable ? <Text style={styles.lable}>{lable}</Text> : null}</View>
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
 
type CustomLinearButtonProps = {
  commonHeight?: number;
  commonWidth?: number;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
  Icons?: any;
  tintColor?: string;
  activeOpacity?: number;
  color?: string;
  borderRadius?: number;
  iconHeight?: number;
  iconWidth?: number;
  IconsRigth?: any;
  fontSize?: number;
  paddingLeft?: number;
  paddingRight?: number;
  padding?: number;
};
 
export const CustomLinearButton: React.FC<CustomLinearButtonProps> = ({
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
      style={{ elevation: 20 }}
    >
      <LinearGradient
        locations={[0, 0.8]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[Config.lineColor.color1, Config.lineColor.color2]}
        style={{
          paddingLeft,
          paddingRight,
          padding,
          width: commonWidth,
          borderRadius,
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
                tintColor,
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
 
type CustomButtonProps = {
  commonHeight?: number;
  commonWidth?: number;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
  Icons?: any;
  tintColor?: string;
  activeOpacity?: number;
  elevation?: number;
  backgroundColor?: string;
  color?: string;
};
 
export const CustomButton: React.FC<CustomButtonProps> = ({
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
          backgroundColor,
          elevation,
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
          <Text style={{ ...styles.buttonText, color }}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
 
type ButtonProps = {
  text?: string;
  onPress?: () => void;
  styles?: { linearGradient?: StyleProp<ViewStyle>; btnImage?: StyleProp<ImageStyle>; buttonText?: StyleProp<TextStyle> };
  image?: any;
  tintColor?: string;
  onLongPress?: () => void;
};
 
export const Button = React.memo(
  ({ text = '', onPress, styles, image, tintColor }: ButtonProps) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[Config.lineColor.color1, Config.lineColor.color2]}
          style={styles?.linearGradient}
        >
          {image ? (
            <Image source={image} style={styles?.btnImage} tintColor={tintColor} />
          ) : null}
          <Text style={styles?.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);
 
type CustomLabelSelectorProps = {
  label: string;
  options?: Array<{ label: string; value: string | number }>;
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  containerWidth?: number;
  errorMessage?: string;
  borderColor?: string;
};

const optionWrapperStyle = (width: number): ViewStyle => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: widthToDp(2),
  width: width,
});

export const CustomLabelSelector: React.FC<CustomLabelSelectorProps> = ({
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
        <View style={optionWrapperStyle(containerWidth)}>
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
                    backgroundColor: isSelected
                      ? Config.Colors.themeColor
                      : '#f3f4f6',
                    borderColor: isSelected
                      ? Config.Colors.themeColor
                      : '#d1d5db',
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
 
const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  placeholderStyle: {
    fontSize: 16,
    color: Config.Colors.black,
  },
  selectedTextStyle: {
    color: Config?.Colors?.textColor?.textColor_2,
    fontFamily: Config?.fontFamilys?.Poppins_SemiBold,
    fontWeight: Config?.WEIGHTS?.medium,
    fontSize: 17,
  },
  imageStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});