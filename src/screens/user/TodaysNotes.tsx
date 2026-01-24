import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useRef } from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { handleCamera, toLocaleDateString } from '../../helpers/utils';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import { CustomInputBox } from '../../components/CustomElements';
import CustomModal from '../../components/CustomModal';
import CustomImageVIew from './CustomImageVIew';
import { useTranslation } from 'react-i18next';

const TodayNotes = ({ navigation, route }) => {
  const [chatMessage, setChatMessage] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const getTokenData = useSelector(state => state.login);
  const [fullImage, setFullImage] = React.useState(false);
  const [imagePath, setImagePath] = React.useState('');
  const [pageLoader, setPageLoader] = React.useState(false);
  const { t } = useTranslation();
  const flatListRef = useRef(null);
  const handelFullImage = img => {
    setFullImage(true);
    setImagePath(img);
  };
  const getMessage = async () => {
    // let bodyData = {
    //     start: 0,
    //     limit: 100000,
    //     filter: {
    //         "search": ""
    //     },
    // }
    setPageLoader(true);
    let bodyData = {
      limit: 50,
      start: 0,
      user_id: getTokenData?.data?.loginData?.id,
      filter: {},
    };
    const apiData = await apiPostService(Constants?.notes_list_api, bodyData);
    if (apiData?.data?.result.data) {
      setPageLoader(false);
      return setChatMessage(apiData?.data?.result.data);
    }
  };
  const sendMessage = async () => {
    let chatBodyData = {
      user_id: getTokenData?.data?.loginData?.id,
      username: getTokenData?.data?.loginData?.name,
      text: message,
      filename: '',
    };
    let chatApiRes = await apiPostService(
      Constants?.add_notes_api,
      chatBodyData,
    );
    if (chatApiRes?.data?.status === 'success') {
      await getMessage();
      setMessage('');
    }
  };
  const uploadDoc = async type => {
    const mediaData = await handleCamera('photo', type);
    let bodyData = {
      appType: 'sfa',
      base64: `data:image/jpeg;base64,${mediaData?.data}`,
    };
    setOpenModal(false);
    if (bodyData) {
      let apiData = await apiPostService(
        Constants?.base64_to_file_api,
        bodyData,
      );
      if (apiData?.data?.status === 'success') {
        let chatBodyData = {
          user_id: getTokenData?.data?.loginData?.id,
          username: getTokenData?.data?.loginData?.name,
          text: message,
          filename: 'uploads/2023-07/1789438732834.jpeg',
        };
        let chatApiRes = await apiPostService(
          Constants?.add_notes_api,
          chatBodyData,
        );
        if (chatApiRes?.data?.status === 'success') {
          getMessage();
          setMessage('');
        }
        // apiData?.data?.response;
        // Location,fileName,uploadPath
      }
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getMessage();
    }, []),
  );
  // const scrollToBottom = () => {
  //     flatListRef.current.scrollToEnd();
  // };
  const keyExtractor = React.useCallback((item, index) => String(index), []);
  const renderItemMessage = ({ item, index }) => {
    return (
      <View style={{ width: '100%' }} key={index}>
        <View style={{ alignItems: 'flex-end', paddingRight: 10, gap: 10 }}>
          <View style={{ padding: 10 }}>
            <View
              style={{
                backgroundColor: Config.Colors.themeColor,
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: Config.Colors.defaultColor }}>
                {toLocaleDateString(item.created_on).customDateTime}
              </Text>
              <Text
                style={{
                  color: Config.Colors.defaultColor,
                  alignSelf: 'flex-end',
                }}
              >
                {item?.text}
              </Text>
            </View>
          </View>
          {item?.filename ? (
            <TouchableOpacity
              onPress={() => handelFullImage(`${item?.filename}`)}
              style={{
                borderRadius: 2,
                borderColor: Config.Colors.black,
                width: widthToDp(50),
                height: widthToDp(30),
                backgroundColor: '#000',
              }}
            >
              <Image
                source={{ uri: `${item?.filename}` }}
                style={{
                  width: widthToDp(50),
                  height: widthToDp(30),
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%', height: '100%', marginTop: 10 }}>
        <View style={{ height: '90%' }}>
          {chatMessage.length ? (
            <FlatList
              refreshing={pageLoader}
              onRefresh={() => getMessage()}
              ref={it => (flatListRef.current = it)}
              data={chatMessage}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              extraData={chatMessage}
              renderItem={item => renderItemMessage(item)}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={0.1}
              removeClippedSubviews={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{
                marginBottom: 0,
              }}
            />
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <ActivityIndicator size={35} color={Config.Colors.textColor} />
            </View>
          )}
        </View>

        <View
          style={{
            width: widthToDp(100),
            // position: 'absolute',
            justifyContent: 'center',
            alignItems: 'flex-end',
            bottom: 0,
            flexDirection: 'row',
            alignSelf: 'center',
            gap: 3,
            zIndex: 9999,
            backgroundColor: Config.Colors.bodyBg,
            height: '9%',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: Config.Colors.themeColor,
              width: widthToDp(11),
              height: heightToDp(5.5),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
            }}
            onPress={() => setOpenModal(true)}
          >
            <Image
              source={Icons.camera_icon}
              tintColor={'#fff'}
              style={{ width: widthToDp(5), height: widthToDp(5) }}
            />
          </TouchableOpacity>
          <CustomInputBox
            commonWidth={widthToDp(75)}
            placeholder={t(Config.todayNotesSreenText?.message)}
            keyboardType={'default'}
            autoComplete={'cc-csc'}
            commmonBorderRadius={100}
            // errorMessage={errorMessage?.subject ? errorMessage?.subject : ''}
            borderColor={Config.Colors.themeColor}
            onChangeText={text => setMessage(text)}
            inputValue={message}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Config.Colors.themeColor,
              width: widthToDp(11),
              height: heightToDp(5.5),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
            }}
            disabled={message ? false : true}
            onPress={() => sendMessage()}
          >
            <Image
              source={Icons.send_icon}
              tintColor={'#fff'}
              style={{ width: widthToDp(5), height: widthToDp(5) }}
            />
          </TouchableOpacity>
        </View>

        <View>
          <CustomModal
            modalVisible={openModal}
            onRequestClose={() => setOpenModal(!openModal)}
            alignItems="flex-end"
            justifyContent="flex-end"
            disableOnPress={true}
            showHeader={false}
          >
            <View
              style={{
                width: widthToDp(100),
                height: heightToDp(15),
                backgroundColor: '#fff',
                borderRadius: widthToDp(2),
                paddingLeft: widthToDp(5),
                paddingRight: widthToDp(5),
                paddingBottom: widthToDp(5),
              }}
            >
              <View style={{ width: '100%' }}>
                <View>
                  <Text
                    style={{
                      fontSize: widthToDp(5),
                      fontFamily: Config.fontFamilys.Poppins_Bold,
                    }}
                  >
                    {t(Config.todayNotesSreenText?.photos)}
                  </Text>
                </View>
                <View style={{ gap: widthToDp(2), marginTop: widthToDp(3) }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', gap: widthToDp(2) }}
                    onPress={() => uploadDoc()}
                  >
                    <Image
                      source={Icons?.gallery_icon}
                      style={{ width: widthToDp(4), height: heightToDp(2) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: widthToDp(3.5),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {t(Config.todayNotesSreenText?.from_photos)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', gap: widthToDp(2) }}
                    onPress={() => uploadDoc('openCamera')}
                  >
                    <Image
                      source={Icons?.camera_icon}
                      style={{ width: widthToDp(4), height: heightToDp(2) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: widthToDp(3.5),
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {t(Config.todayNotesSreenText?.take_picture)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CustomModal>
          {fullImage ? (
            <CustomModal
              modalVisible={fullImage}
              onRequestClose={() => setFullImage(!fullImage)}
              backgroundColor="#000"
              transparent={false}
              showHeader={true}
              headerText=""
            >
              <CustomImageVIew
                handleFullImage={() => setFullImage(!fullImage)}
                imagePath={imagePath}
              />
            </CustomModal>
          ) : null}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // width:widthToDp(90),
    // backgroundColor:'#000'
  },
  body: {
    marginTop: 10,
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: '#000',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: widthToDp(90),
    margin: 10,
    padding: 10,
  },
  boxContainer: {
    alignSelf: 'center',
    // bottom: 10
  },
  boxContainerIner: {
    marginBottom: widthToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2),
  },
});
export default React.memo(TodayNotes);
