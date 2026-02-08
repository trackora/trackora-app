import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "transparent",
    alignSelf: "center",
    borderRadius: 4,
    borderWidth: 2,
    width: 320,
    height: 52,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    backgroundColor: "rgb(243,243,243)",
    alignSelf: "center",
    borderRadius: 4,
    borderWidth: 2,
    width: 320,
    height: 52,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 14,
    color: "white",
  },
  imgLeft: {
    width: 24,
    height: 24,
    position: "absolute",
    left: 16,
  },
});

/* ===================== TYPES ===================== */

type ButtonProps = {
  children: React.ReactNode;

  onPress?: () => void | Promise<void>;

  isLoading?: boolean;
  isDisabled?: boolean;

  style?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  imgLeftSrc?: any;
  imgLeftStyle?: StyleProp<ImageStyle>;

  indicatorColor?: string;
  activeOpacity?: number;
};

/* ===================== COMPONENT ===================== */

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  isDisabled = false,
  onPress,
  style = styles.btn,
  disabledStyle = styles.btnDisabled,
  textStyle = styles.txt,
  imgLeftSrc,
  imgLeftStyle = styles.imgLeft,
  indicatorColor = "white",
  activeOpacity = 0.5,
}) => {
  if (isDisabled) {
    return (
      <View style={disabledStyle}>
        <Text style={textStyle}>{children}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={style}>
        <ActivityIndicator size="small" color={indicatorColor} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={style}>
        {imgLeftSrc ? <Image style={imgLeftStyle} source={imgLeftSrc} /> : null}
        <Text style={textStyle}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
