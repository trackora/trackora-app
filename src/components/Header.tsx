import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { Fragment } from 'react';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import { CustomDropDownComponent, CustomLine } from './CustomElements';
import * as Icons from '../helpers/Icons';
import { Path, Svg } from 'react-native-svg';

import LinearGradient from 'react-native-linear-gradient';
import { Lines_1, SvgcCircle } from '../helpers/Svg';
import { useTranslation } from 'react-i18next';

export const Header_1 = ({ text = '' }) => {
  const { t } = useTranslation();
  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <View style={{}}>
          {text.length > 50 ? (
            <ScrollView>
              <Text style={Styles.headerText}>{text}</Text>
            </ScrollView>
          ) : (
            <Text style={Styles.headerText}>{text}</Text>
          )}
        </View>
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
      <View>
        <Image
          source={Icons?.line_1}
          style={{ width: widthToDp(55) }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export const Header_2 = ({
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
  rightImageTopText = '',
  filterBranch = null,
  branchData = [],
  handleDropDown,
  dropDowninitial = '',
  helpIcon,
  helpIconTintColor,
  onPresshelpIcon,
}) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
      }}
    >
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
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {leftImage ? (
              <TouchableOpacity
                onPress={() => onPressLeft()}
                style={{
                  width: widthToDp(10),
                  height: widthToDp(10),
                  backgroundColor: Config.Colors.bodyBg,
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                {svgLeft ? (
                  leftImage
                ) : (
                  <View
                    style={{
                      width: widthToDp(10),
                      height: widthToDp(6),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={leftImage}
                      style={{
                        height: widthToDp(6),
                        tintColor: tintColorLeft,
                        right: 10,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {leftText ? (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: widthToDp(5),
                    fontFamily: Config.fontFamilys.Poppins_SemiBold,
                    marginLeft: !leftImage ? widthToDp(5) : 0,
                  }}
                >
                  {t(leftText)}
                </Text>
              ) : null}
              {filterBranch ? (
                <View style={{ marginLeft: !leftImage ? 5 : 0 }}>
                  {/* <Text style={{ color: '#fff', fontSize: widthToDp(5), fontFamily: Config.fontFamilys.Poppins_SemiBold }} >filterBranch</Text> */}
                  <CustomDropDownComponent
                    commonWidth={widthToDp(35)}
                    data={branchData}
                    defaultColor={Config.Colors.defaultColor}
                    placeholder={t(Config.adminHomeStackText?.branches)}
                    onChangeDropDown={item => handleDropDown(item)}
                    containerStyle={{
                      width: widthToDp(50),
                      height: widthToDp(50),
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {rightImage ? (
              <TouchableOpacity
                style={{ justifyContent: 'center' }}
                onPress={() => onPressRight()}
              >
                <View
                  style={{
                    width: commonWidth,
                    height: commonHeight,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                  }}
                >
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
                  {rightImageTopText ? (
                    <View
                      style={{
                        position: 'absolute',
                        fontSize: 14,
                        backgroundColor: '#fff',
                        right: 7,
                        top: -3,
                        borderRadius: 6,
                        padding: 2,
                        minWidth: 20,
                        minHeight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: Config.Colors.themeColor }}>
                        {rightImageTopText}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ) : null}
            {helpIcon ? (
              <TouchableOpacity
                style={{ justifyContent: 'center' }}
                onPress={() => onPresshelpIcon()}
              >
                <View
                  style={{
                    width: commonWidth,
                    height: commonHeight,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                  }}
                >
                  {svg ? (
                    helpIcon
                  ) : (
                    <Image
                      source={helpIcon}
                      style={{ width: widthToDp(10), height: widthToDp(7) }}
                      resizeMode="contain"
                      tintColor={helpIconTintColor}
                    />
                  )}
                  {/* {rightImageTopText ?
                                    <View style={{
                                        position: 'absolute',
                                        fontSize: 14,
                                        backgroundColor: '#fff',
                                        right: 7,
                                        top: -3,
                                        borderRadius: 6,
                                        padding: 2,
                                        minWidth: 20,
                                        minHeight: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center'

                                    }}>
                                        <Text style={{ color: Config.Colors.themeColor }}>{rightImageTopText}</Text></View>
                                    : null} */}
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </LinearGradient>
      ) : (
        <View style={Styles.commonHeader}>
          {leftImage ? (
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <View
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 10,
                  backgroundColor: '#fff',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <Image
                  source={leftImage}
                  style={{
                    width: commonWidth,
                    height: commonHeight,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  resizeMode="contain"
                />
              </View>
              {leftText ? (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 24,
                    fontFamily: Config.fontFamilys.Poppins_SemiBold,
                  }}
                >
                  {leftText}
                </Text>
              ) : null}
            </View>
          ) : null}
          {rightImage ? (
            <TouchableOpacity
              style={{ justifyContent: 'center' }}
              onPress={() => onPressRight()}
            >
              {svg ? (
                rightImage
              ) : (
                <Image
                  source={rightImage}
                  style={{
                    width: widthToDp(45),
                    height: heightToDp(7),
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

export const Header_3 = ({ image, nameText, onPress, uriImage, userData }) => {
  const [imgLoader, setImgLoader] = React.useState(false);
  const { t } = useTranslation();
  console.log('userData===>', userData);
  return (
    <View>
      <LinearGradient
        style={{
          // height: heightToDp(37),
          backgroundColor: Config.Colors.primary,
          borderBottomRightRadius: 100,
        }}
        colors={[
          Config.lineColor.color1,
          Config.lineColor.color2,
          Config.lineColor.color2,
        ]}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 1.2, y: 1 }}
      >
        <View
          style={{
            marginLeft: widthToDp(2),
            marginRight: widthToDp(2),
            padding: widthToDp(6),
          }}
        >
          <View
            style={[Styles.header3Contanier, { marginBottom: widthToDp(6) }]}
          >
            <View style={[Styles.header3Text, { alignItems: 'flex-start' }]}>
              <Text style={[Styles.text, { fontSize: widthToDp(5) }]}>
                {t(Config.customHeaderText?.welcome)}, {nameText}
              </Text>
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(3),
                    fontFamily: Config.fontFamilys.Poppins_Light,
                  },
                ]}
              >
                {t(Config.customHeaderText?.check_latest_update)}
              </Text>
            </View>
            {image ? (
              <TouchableOpacity
                onPress={onPress}
                style={[
                  Styles.header3Text,
                  {
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: widthToDp(20),
                  },
                ]}
              >
                {uriImage ? (
                  <View
                    style={{
                      backgroundColor: Config.Colors.lightSecondary,
                      elevation: 20,
                      borderRadius: 100,
                      width: widthToDp(8.5),
                      height: widthToDp(8.5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={{ uri: uriImage }}
                      style={{
                        width: widthToDp(8),
                        height: widthToDp(8),
                        borderRadius: widthToDp(100),
                        borderColor: Config.Colors.lightSecondary,
                        borderRightWidth: 2,
                      }}
                      onLoadStart={() => setImgLoader(true)}
                      onLoadEnd={() => setImgLoader(false)}
                    />
                    {imgLoader ? (
                      <ActivityIndicator size={widthToDp(5)} />
                    ) : null}
                    {/* <View style={{ position: 'absolute', height: widthToDp(10), width: widthToDp(10), bottom: widthToDp(3.5) }}>
                                            <Image source={Icons.plus_icon}
                                                style={{
                                                    width: widthToDp(7),
                                                    height: widthToDp(5),
                                                    tintColor: Config.Colors.defaultColor
                                                }}
                                                resizeMode='contain'
                                            />
                                        </View> */}
                  </View>
                ) : (
                  <Image
                    source={image}
                    style={{
                      width: widthToDp(8),
                      height: widthToDp(8),
                      tintColor: Config.Colors.lightSecondary,
                    }}
                  />
                )}
                <Image
                  source={Icons?.arrow_right}
                  style={{
                    width: 10,
                    height: 20,
                    tintColor: Config.Colors.lightSecondary,
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          {/* <View style={Styles.header3Contanier}>
            <View style={[Styles.header3Text, { width: widthToDp(20) }]}>
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(4),
                    textAlign: 'center',
                    fontFamily: Config.fontFamilys.Poppins_SemiBold,
                  },
                ]}
              >
                {userData?.monthly_bonus}
              </Text>
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(3),
                    textAlign: 'center',
                    fontFamily: Config.fontFamilys.Poppins_Light,
                  },
                ]}
              >
                {t(Config.headerScreenText?.leave_taken)}
              </Text>
            </View>
            <View
              style={[
                Styles.header3Text,
                {
                  borderWidth: 2,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: Config.Colors.lightSecondary,
                  width: widthToDp(36),
                  height: heightToDp(18),
                },
              ]}
            >
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(6),
                    textAlign: 'center',
                    fontFamily: Config.fontFamilys.Poppins_SemiBold,
                  },
                ]}
              >
                {userData?.total_salary_received}{' '}
              </Text>
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(3),
                    textAlign: 'center',
                    fontFamily: Config.fontFamilys.Poppins_Light,
                  },
                ]}
              >
                {' '}
                {t(Config.headerScreenText?.day_worked)}
              </Text>
            </View>
            <View style={[Styles.header3Text, { width: widthToDp(20) }]}>
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(4),
                    textAlign: 'center',
                    fontFamily: Config.fontFamilys.Poppins_SemiBold,
                  },
                ]}
              >
                {userData?.total_working_hours}
              </Text>
              <Text
                style={[
                  Styles.text,
                  {
                    fontSize: widthToDp(3),
                    textAlign: 'center',
                    fontFamily: Config.fontFamilys.Poppins_Light,
                  },
                ]}
              >
                {t(Config.headerScreenText?.average_wh)}
              </Text>
            </View>
          </View> */}
        </View>
      </LinearGradient>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    // height: heightToDp(35),
    backgroundColor: Config.Colors.primary,
    borderBottomRightRadius: 100,
  },
  header: {
    width: '100%',
    // height: '60%',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // position:'absolute'
  },
  headerText: {
    color: Config.Colors.defaultColor,
    fontSize: widthToDp(8),
    textAlign: 'left',
    // width: widthToDp(50),
    fontFamily: Config.fontFamilys.Poppins_Medium,
    marginLeft: widthToDp(4.5),
    marginTop: widthToDp(4.5),
    marginRight: widthToDp(8),
    zIndex: 999999999,
    lineHeight: widthToDp(13),
    // backgroundColor:'#000',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Config.Colors.lineColor,
  },
  commonHeader: {
    minHeight: heightToDp(8),
    width: '92%',
    backgroundColor: Config.Colors.themeColor,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignContent: 'center',
    flexDirection: 'row',
  },
  header3Contanier: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginLeft:10,
    // marginRight:10
  },
  header3Text: {
    // height: heightToDp(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  header3: {
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
  },
});
