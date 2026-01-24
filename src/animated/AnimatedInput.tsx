import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  TextInputProps,
  ImageSourcePropType,
  KeyboardTypeOptions,
} from 'react-native';
import { widthToDp } from '../helpers/Responsive';

// --- Props ---
interface AnimatedInputProps {
  placeHolderText: string;
  showImage?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  inputMode?: TextInputProps['keyboardType'];
  _onChangeText: (text: string) => void;
  secureText?: boolean;
  containerWidth?: number;
  imagePath?: ImageSourcePropType;
  value?: string;
  id?: string | number;
  _onPressImage?: (id?: string | number) => void;
  keyboardType?: KeyboardTypeOptions;
  defaultValue?: string | null;
  editable?: boolean;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeHolderText,
  showImage = false,
  onBlur,
  onFocus,
  _onChangeText,
  secureText = false,
  containerWidth = widthToDp(90),
  imagePath,
  value = '',
  id,
  _onPressImage,
  keyboardType = 'default',
  defaultValue = null,
  editable = true,
}) => {
  const [imageAlter, setImageAlter] = useState(true);
  const [focus, setFocus] = useState<boolean>();
  const [textLength, setTextLength] = useState<string>(value || '');
  const inputPosition = useRef(new Animated.Value(widthToDp(6))).current;
  const inputFontSize = useRef(new Animated.Value(widthToDp(5))).current;

  useEffect(() => {
    if (defaultValue) {
      setTextLength(defaultValue);
      handleInputFocus();
    }
  }, [defaultValue]);

  const handleInputFocus = () => {
    if (textLength?.length === 0) {
      Animated.parallel([
        Animated.timing(inputPosition, {
          toValue: widthToDp(3.8),
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(inputFontSize, {
          toValue: widthToDp(3.5),
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
    setFocus(true);
  };

  const handleInputBlur = () => {
    if (textLength?.length === 0) {
      Animated.parallel([
        Animated.timing(inputPosition, {
          toValue: widthToDp(6),
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(inputFontSize, {
          toValue: widthToDp(4.5),
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
    setFocus(false);
  };

  const _textChange = (text: string) => {
    _onChangeText(text);
    setTextLength(text);
  };
  return (
    <View
      style={{
        ...styles.container,
        ...{
          width: containerWidth,
        },
      }}
    >
      <View style={styles.subContainer}>
        <Animated.View style={[{ transform: [{ translateY: inputPosition }] }]}>
          <Animated.Text
            style={{
              ...{ fontSize: widthToDp(4) },
              ...{
                paddingHorizontal: widthToDp(0.8),
              },
            }}
          >
            {placeHolderText}
          </Animated.Text>
        </Animated.View>

        <View
          style={{
            ...styles.inputTextContainer,
          }}
        >
          <TextInput
            style={styles.textInput}
            secureTextEntry={secureText ? imageAlter : false}
            onFocus={event => handleInputFocus()}
            onBlur={event => handleInputBlur()}
            onChangeText={text => _textChange(text)}
            value={value}
            keyboardType={keyboardType}
            defaultValue={defaultValue ?? ''}
            editable={editable}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthToDp(2),
    borderTopEndRadius: widthToDp(1),
    borderTopStartRadius: widthToDp(1),
    borderBottomWidth: widthToDp(0.6),
    height: widthToDp(16),
    justifyContent: 'center',
  },
  subContainer: {},
  textContainer: {
    position: 'absolute',
    zIndex: 99,
  },
  inputTextContainer: {
    flexDirection: 'row',
  },
  textInput: {
    width: '90%',
    fontSize: widthToDp(4.5),
    color: '#000',
  },
  textImage: {
    width: widthToDp(5),
    height: widthToDp(5),
    resizeMode: 'contain',
  },
});

export default React.memo(AnimatedInput);
