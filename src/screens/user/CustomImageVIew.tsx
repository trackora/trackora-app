import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import ImageZoom from 'react-native-image-pan-zoom';
 
type CustomImageViewProps = {
  handleFullImage: () => void;
  imagePath?: string | null;
  headerText?: string;
  handleSubmit?: () => void;
  imageLoader?: boolean;
  base64?: string;
};
 
// Workaround for incorrect TS typings (children not declared)
const ImageZoomView =
  ImageZoom as unknown as React.ComponentType<{
    cropWidth: number;
    cropHeight: number;
    imageWidth: number;
    imageHeight: number;
    children?: React.ReactNode;
  }>;
 
const CustomImageVIew: React.FC<CustomImageViewProps> = ({
  handleFullImage,
  imagePath = null,
  headerText = '',
  handleSubmit,
  imageLoader,
  base64,
}) => {
  return (
    <View
      style={{
        width: '100%',
        height: heightToDp(95),
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: widthToDp(90),
          borderRadius: 20,
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ borderColor: '#000' }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff' }}>
            {headerText}
          </Text>
        </View>
        <TouchableOpacity onPress={handleFullImage}>
          <Image
            source={Icons.close}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            tintColor="#fff"
          />
        </TouchableOpacity>
      </View>
 
      {imageLoader ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <ActivityIndicator
            size={35}
            color={
              Config.Colors.textColor?.textColor_1 ?? Config.Colors.themeColor
            }
          />
        </View>
      ) : null}
 
      {imagePath ? (
        <ImageZoomView
          cropWidth={widthToDp(100)}
          cropHeight={heightToDp(80)}
          imageWidth={widthToDp(100)}
          imageHeight={heightToDp(100)}
        >
          <Image
            source={{ uri: imagePath }}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
        </ImageZoomView>
      ) : null}
 
      {handleSubmit && base64 ? (
        <TouchableOpacity onPress={handleSubmit}>
          <Image
            source={Icons?.send_icon}
            style={{ width: 30, height: 30 }}
            tintColor={'#FFF'}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
 
export default React.memo(CustomImageVIew);