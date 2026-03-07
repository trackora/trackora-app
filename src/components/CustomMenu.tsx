import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import { useTranslation } from 'react-i18next';

// --- Type Definitions ---
interface MenuItem {
  title?: string;
  icon?: ImageSourcePropType;
  tintColor?: string;
  des?: string;
  data?: any;
}

interface CustomMenuProps {
  item: MenuItem;
  onPress: (title?: string) => void;
  bottomImg?: ImageSourcePropType | null;
  style?: Record<string, any>;
  commonWidth?: number;
  commonHeight?: number;
  tintColor1?: string;
  tintColor2?: string;
  disBottomImg?: ImageSourcePropType;
  titleColor?: string;
  bottomImgBGColor?: string;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  item,
  onPress,
  bottomImg = null,
  style,
  tintColor1 = Config.Colors.secondary,
  tintColor2 = Config.Colors.secondary,
  disBottomImg,
  titleColor = Config.Colors.black,
  bottomImgBGColor = Config.Colors.bodyBg,
}) => {
  const { t } = useTranslation();
  return (
    <View style={[style?.box, styles?.box]}>
      <TouchableOpacity onPress={() => onPress(item?.title)}>
        {item?.icon ? (
          <Image
            source={item?.icon}
            style={{
              width: widthToDp(8),
              height: widthToDp(8),
              resizeMode: 'contain',
              tintColor: item?.tintColor,
              marginBottom: 12,
            }}
          />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={[styles.text, { color: titleColor }]}>
            {t(item?.title || '')}
          </Text>
          {bottomImg ? (
            <View
              style={{
                ...styles?.bottomImg,
                backgroundColor: bottomImgBGColor,
              }}
            >
              <Image
                source={bottomImg}
                style={{
                  tintColor: tintColor2,
                  width: widthToDp(5),
                  height: widthToDp(5),
                  resizeMode: 'contain',
                }}
              />
            </View>
          ) : null}
        </View>
        {item?.des ? (
          <View style={{ marginTop: widthToDp(2) }}>
            <View style={{ height: widthToDp(20) }}>
              <Text style={styles.des} numberOfLines={3}>
                {t(item?.des)}
              </Text>
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <View style={[style?.bottomImg, { marginTop: heightToDp(1) }]}>
                {disBottomImg && (
                  <Image
                    source={disBottomImg}
                    style={{
                      tintColor: tintColor2,
                      width: widthToDp(5),
                      height: widthToDp(5),
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    fontSize: widthToDp(3.5),
    fontWeight: Config.WEIGHTS.medium,
  },
  des: {
    fontWeight: Config.WEIGHTS.light,
    fontFamily: Config.fontFamilys.Poppins_Light,
    lineHeight: 22,
    color: Config.Colors.black,
  },
  box: {
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 10,
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: 35,
    height: 35,
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    // padding: widthToDp(2)
  },
});
export default React.memo(CustomMenu);
