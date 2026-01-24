import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import ImageZoom from 'react-native-image-pan-zoom';
// import FastImage from 'react-native-fast-image'

const CustomImageVIew = ({
  handleFullImage,
  imagePath = null,
  headerText = '',
  handleSubmit,
  imageLoader,
  base64,
}) => {
  // 🔍 Debug incoming props
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
          // marginLeft: 20,
          // marginRight:20,
        }}
      >
        <View style={{ borderColor: '#000' }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff' }}>
            {headerText}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleFullImage()}>
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
          <ActivityIndicator size={35} color={Config.Colors.textColor} />
        </View>
      ) : null}
      {imagePath ? (
        <ImageZoom
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
        </ImageZoom>
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
