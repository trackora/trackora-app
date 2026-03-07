import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import { CustomDropDownComponent } from './CustomElements';
import * as Icons from '../helpers/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { SvgcCircle } from '../helpers/Svg';
import { useTranslation } from 'react-i18next';

/* ===================== HEADER 1 ===================== */

type Header1Props = {
  text?: string;
};

export const Header_1: React.FC<Header1Props> = ({ text = '' }) => {
  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        {text.length > 50 ? (
          <ScrollView>
            <Text style={Styles.headerText}>{text}</Text>
          </ScrollView>
        ) : (
          <Text style={Styles.headerText}>{text}</Text>
        )}
      </View>

      <View
        style={{
          position: 'absolute',
          top: widthToDp(-4),
          left: widthToDp(75),
          right: 0,
          zIndex: -1,
        }}
      >
        <SvgcCircle />
      </View>

      <Image
        source={Icons?.line_1}
        style={{ width: widthToDp(55) }}
        resizeMode="contain"
      />
    </View>
  );
};

/* ===================== HEADER 2 ===================== */

export type Header2Props = {
  leftImage?: any;
  rightImage?: any;
  onPressRight?: () => void;
  onPressLeft?: () => void;
  svg?: boolean;
  svgLeft?: boolean;
  commonWidth?: number;
  commonHeight?: number;
  leftText?: string;
  animated?: boolean;
  tintColorLeft?: string;
  tintColorRight?: string;
  rightImageTopText?: string | null; // 🔥 FIX
  filterBranch?: boolean | null;
  branchData?: any[];
  handleDropDown?: (item: any) => void;
  dropDowninitial?: string;
  helpIcon?: any;
  helpIconTintColor?: string;
  onPresshelpIcon?: () => void;
};

export const Header_2: React.FC<Header2Props> = ({
  leftImage,
  rightImage,
  onPressRight,
  svg = false,
  svgLeft = false,
  commonWidth = widthToDp(30),
  commonHeight = heightToDp(7),
  leftText,
  animated = false,
  tintColorLeft = Config.Colors.secondary,
  tintColorRight = Config.Colors.secondary,
  onPressLeft,
  rightImageTopText,
  filterBranch = null,
  branchData = [],
  handleDropDown,
  helpIcon,
  helpIconTintColor,
  onPresshelpIcon,
}) => {
  const { t } = useTranslation();

  return (
    <View style={Styles.headerWrapper}>
      {animated ? (
        <LinearGradient
          style={{ ...Styles.commonHeader, width: '92%' }}
          colors={[
            Config.lineColor.color1,
            Config.lineColor.color2,
            Config.lineColor.color2,
          ]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1.8, y: 1 }}
        >
          <View style={Styles.rowCenter}>
            {leftImage && (
              <TouchableOpacity
                onPress={() => onPressLeft?.()}
                style={Styles.leftIconContainer}
              >
                {svgLeft ? (
                  leftImage
                ) : (
                  <Image
                    source={leftImage}
                    style={{
                      height: widthToDp(6),
                      tintColor: tintColorLeft,
                    }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            )}

            {leftText && (
              <Text style={Styles.leftText}>
                {t(leftText)}
              </Text>
            )}

            {filterBranch && (
              <CustomDropDownComponent
                commonWidth={widthToDp(35)}
                data={branchData}
                defaultColor={Config.Colors.defaultColor}
                placeholder={t(Config.adminHomeStackText?.branches)}
                onChangeDropDown={item => handleDropDown?.(item)}
              />
            )}
          </View>

          <View style={Styles.rowCenter}>
            {rightImage && (
              <TouchableOpacity onPress={() => onPressRight?.()}>
                <View style={{ width: commonWidth, height: commonHeight }}>
                  {svg ? (
                    rightImage
                  ) : (
                    <Image
                      source={rightImage}
                      style={{ width: widthToDp(7), height: widthToDp(7) }}
                      resizeMode="contain"
                      tintColor={tintColorRight}
                    />
                  )}

                  {!!rightImageTopText && (
                    <View style={Styles.badge}>
                      <Text style={{ color: Config.Colors.themeColor }}>
                        {rightImageTopText}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {helpIcon && (
              <TouchableOpacity onPress={() => onPresshelpIcon?.()}>
                <Image
                  source={helpIcon}
                  style={{ width: widthToDp(10), height: widthToDp(7) }}
                  resizeMode="contain"
                  tintColor={helpIconTintColor}
                />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      ) : (
        <View style={Styles.commonHeader}>
          {leftImage && (
            <Image
              source={leftImage}
              style={{ width: commonWidth, height: commonHeight }}
              resizeMode="contain"
            />
          )}

          {rightImage && (
            <TouchableOpacity onPress={() => onPressRight?.()}>
              <Image
                source={rightImage}
                style={{ width: widthToDp(45), height: heightToDp(7) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

/* ===================== HEADER 3 ===================== */

type Header3Props = {
  image?: any;
  nameText?: string;
  onPress?: () => void;
  uriImage?: string;
  userData?: any;
};

export const Header_3: React.FC<Header3Props> = ({
  image,
  nameText = '',
  onPress,
  uriImage,
}) => {
  const [imgLoader, setImgLoader] = React.useState(false);
  const { t } = useTranslation();

  return (
    <LinearGradient
      style={{ backgroundColor: Config.Colors.primary }}
      colors={[
        Config.lineColor.color1,
        Config.lineColor.color2,
        Config.lineColor.color2,
      ]}
    >
      <View style={{ padding: widthToDp(6) }}>
        <Text style={Styles.text}>
          {t(Config.customHeaderText?.welcome)}, {nameText}
        </Text>

        {image && (
          <TouchableOpacity onPress={onPress}>
            {uriImage ? (
              <>
                <Image
                  source={{ uri: uriImage }}
                  style={Styles.profileImage}
                  onLoadStart={() => setImgLoader(true)}
                  onLoadEnd={() => setImgLoader(false)}
                />
                {imgLoader && (
                  <ActivityIndicator
                    size="small"
                    color={Config.Colors.defaultColor}
                  />
                )}
              </>
            ) : (
              <Image source={image} style={Styles.profileImage} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

/* ===================== STYLES ===================== */

const Styles = StyleSheet.create({
  container: {
    backgroundColor: Config.Colors.primary,
    borderBottomRightRadius: 100,
  },
  header: {
    width: '100%',
  },
  headerText: {
    color: Config.Colors.defaultColor,
    fontSize: widthToDp(8),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    marginLeft: widthToDp(4.5),
    marginTop: widthToDp(4.5),
  },
  commonHeader: {
    minHeight: heightToDp(8),
    backgroundColor: Config.Colors.themeColor,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  leftText: {
    color: '#fff',
    fontSize: widthToDp(5),
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
  },
  leftIconContainer: {
    backgroundColor: Config.Colors.bodyBg,
    borderRadius: 10,
    padding: 6,
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#fff',
    right: 4,
    top: -4,
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  text: {
    color: '#fff',
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
  },
  profileImage: {
    width: widthToDp(8),
    height: widthToDp(8),
    borderRadius: widthToDp(100),
  },
});
