import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import React, { useRef } from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/store';
import {
  handleCamera,
  requestBackgroundPermission,
  toLocaleDateString,
} from '../../helpers/utils';
import { apiPostService } from '../../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import { CustomInputBox } from '../../components/CustomElements';
import { NotFound_result } from '../../helpers/Svg';
import { SvgXml } from 'react-native-svg';
import CustomModal from '../../components/CustomModal';
import CustomImageVIew from './CustomImageVIew';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AudioRecoder from '../../components/AudioRecoder';
import AudioPlayer from '../../components/AudioPlayer';
import { TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isApiSuccess } from '../../helpers/Validation';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
const Chat = ({ navigation, route }) => {
  const path = Platform.select({
    ios: 'hello.m4a',
    android: `${RNFS.DocumentDirectoryPath}/hello.mp3`.replace(/:/g, '-'),
  });
  // android: `${RNFS.DocumentDirectoryPath}/${toLocaleDateString().timestamp}.mp3`.replace(/:/g, '-')
  const [chatMessage, setChatMessage] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const getTokenData = useAppSelector(state => state.login);
  const [fullImage, setFullImage] = React.useState(false);
  const [imagePath, setImagePath] = React.useState('');
  const [pageLoader, setPageLoader] = React.useState(false);
  const [startRecding, setStartRecding] = React.useState(false);
  const [recordingPath, setRecordingPath] = React.useState(null);
  const [pauseRecoding, setPauseRecoding] = React.useState(false);
  const [playRecoding, setPlayRecoding] = React.useState(false);
  const [imageLoader, setImageLoader] = React.useState(false);
  const [voiceLoader, setVoiceLoader] = React.useState(false);
  const [base64, setBase64] = React.useState('');
  const [recordSecs, setRecordSecs] = React.useState(0);
  const { t } = useTranslation();
  const [currentDirPath, setCurrentDirPath] = React.useState(
    RNFS.DocumentDirectoryPath,
  );

  const flatListRef = useRef(null);

  // Go back to previous route
  const goBackScreen = () => {
    navigation.goBack();
  };

  // Setting the path of the image
  const handelFullImage = img => {
    setFullImage(true);
    setImagePath(img);
  };

  // For showing the chat list
  const getMessage = async () => {
    setPageLoader(true);
    const apiData = await apiPostService(Constants?.chat_list_api, {});
    // console.log("chat list response====>>", apiData?.data);
    if (isApiSuccess(apiData)) {
      setPageLoader(false);
      return setChatMessage(apiData?.data?.result.data);
    }
  };

  // For sending message to the chat
  const sendMessage = async () => {
    let chatBodyData = {
      message: message,
    };
    let chatApiRes = await apiPostService(
      Constants?.chat_send_api,
      chatBodyData,
    );
    if (isApiSuccess(chatApiRes)) {
      // console.log("chatApiRes", chatApiRes);
      handleScrollToEnd();
      await getMessage();
      setMessage('');
    }
  };

  // For submitting the message
  const handleSubmitImage = async base64 => {
    let bodyData = {
      base64: base64,
    };
    if (bodyData) {
      let apiData = await apiPostService(
        Constants?.base64_to_file_api,
        bodyData,
      );
      // console.log("apiData-----1", apiData);
      if (isApiSuccess(apiData)) {
        let chatBodyData = {
          message: '',
          attachment_filename: apiData?.data?.response?.fileName,
        };
        let chatApiRes = await apiPostService(
          Constants?.chat_send_api,
          chatBodyData,
        );
        if (isApiSuccess(chatApiRes)) {
          // console.log("chatApiRes", chatApiRes);
          setFullImage(false);
          setImageLoader(false);
          getMessage();
          setMessage('');
          setBase64('');
          handleScrollToEnd();
        }
        // apiData?.data?.response;
        // Location,fileName,uploadPath
      }
    }
  };

  // For uploading document
  const uploadDoc = async type => {
    setImageLoader(true);
    const mediaData = await handleCamera('photo', type);
    setOpenModal(false);
    if (mediaData?.data) {
      handelFullImage(`data:image/jpeg;base64,${mediaData?.data}`);
      setBase64(`data:image/jpeg;base64,${mediaData?.data}`);
      setImageLoader(false);
    }
  };

  // This module is not developed, under development
  const onStartRecord = async () => {
    Alert.alert('Info', 'Under Development');
    // setStartRecding(true)
    // onStopRecord();
    // if (Platform.OS === 'android') {
    //   try {
    //     const grants = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       {
    //         title: t(Config.branchesText?.location_permission),
    //         message: t(Config.branchesText?.permission_message),
    //         buttonNeutral: t(Config.chatScrenText?.ask_me_later),
    //         buttonNegative: t(Config.branchesText?.cancel),
    //         buttonPositive: t(Config.branchesText?.ok)
    //       },
    //     );

    //     // console.log('write external stroage', grants);
    //     const audioSet = {
    //       AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    //       AudioSourceAndroid: AudioSourceAndroidType.MIC,
    //       AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    //       AVNumberOfChannelsKeyIOS: 2,
    //       AVFormatIDKeyIOS: AVEncodingOption.aac,
    //       OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    //     };

    //     if (
    //       grants === "granted"
    //     ) {
    //       // console.log('permissions granted');

    //       // console.log('audioSet', audioSet);

    //       const uri = await audioRecorderPlayer.startRecorder(
    //         path,
    //         audioSet,
    //       );
    //       // console.log(`uri-1: ${uri}`)
    //       // audioRecorderPlayer.addRecordBackListener((e) => {
    //       // console.log('record-back', e);
    //       // setRecordSecs(e.currentPosition);
    //       // setRecordTime(audioRecorderPlayer.mmssss(
    //       //   Math.floor(e.currentPosition),
    //       // ))
    //       // });
    //       if (uri) {
    //         const base64String = await RNFS.readFile(`${uri}`, 'base64')
    //           .then(res => {
    //             return res;
    //           });
    //         // console.log("data---", base64String)
    //         if (base64String) {
    //           // console.log(`uri-2: ${uri}`);
    //           setStartRecding(true)
    //           setRecordingPath({ base64String: base64String })
    //         } else {
    //           onStopRecord();
    //         }
    //       }
    //     } else {
    //       // console.log('All required permissions not granted');

    //       return;
    //     }
    //   } catch (err) {
    //     console.warn(err);

    //     return;
    //   }
    // }
  };

  const onRecodingSubmit = async () => {
    // console.log("onRecodingSubmit", recordingPath)
    setVoiceLoader(true);
    let bodyData = {
      base64: `data:audio/mpeg;base64,${recordingPath?.base64String}`,
    };
    if (bodyData && recordingPath?.base64String) {
      // console.log("first")
      let apiData = await apiPostService(
        Constants?.base64_to_file_api,
        bodyData,
      );
      // console.log("apiData-----1", apiData);
      if (isApiSuccess(apiData)) {
        let chatBodyData = {
          message: '',
          attachment_filename: apiData?.data?.response.fileName,
        };
        let chatApiRes = await apiPostService(
          Constants?.chat_send_api,
          chatBodyData,
        );
        if (isApiSuccess(chatApiRes)) {
          setVoiceLoader(false);
          // console.log("chatApiRes", chatApiRes);
          onStopRecord();
          getMessage();
        }
      }
    }
  };

  const handleVoiceRecoder = async type => {
    switch (type) {
      case 'startRecorder':
        setStartRecding(true);
        const mp3Path = `${RNFS.DocumentDirectoryPath}/${
          toLocaleDateString().timestamp
        }.mp3`.replace(/:/g, '-');
        // const path = `${RNFS.DocumentDirectoryPath}/myRecording.aac`;
        // console.log("path", mp3Path)
        const resStart = await audioRecorderPlayer.startRecorder(mp3Path);
        // const result = await audioRecorderPlayer.startPlayer(`file:////data/user/0/com.trackora_app.tlp/files/1709541982722.mp3`);
        // console.log("resStart", resStart);
        setRecordingPath(resStart);
        break;
      case 'stopRecorder':
        setStartRecding(false);
        const resStop = await audioRecorderPlayer.stopRecorder();
        // console.log(resStop);
        break;
      default:
        break;
    }
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setStartRecding(false);
    setRecordingPath(null);
  };
  const onPauseRecord = async type => {
    // console.log("onPauseRecord", type)
    if (type === 'Pause') {
      setPauseRecoding(true);
      try {
        const r = await audioRecorderPlayer.pauseRecorder();
        // console.log(r);
      } catch (err) {
        console.log('pauseRecord', err);
      }
    } else {
      setPauseRecoding(false);
      await audioRecorderPlayer.resumeRecorder();
    }
  };

  const handleRecodingPlay = async (type, path) => {
    // console.log("handleRecodingPlay", 11)
    if (type === 'Play') {
      setPlayRecoding(true);
      try {
        const msg = await audioRecorderPlayer.startPlayer(path);
        const volume = await audioRecorderPlayer.setVolume(1.0);
        // console.log(`path: ${msg}`, `volume: ${volume}`);

        audioRecorderPlayer.addPlayBackListener(e => {
          // console.log('playBackListener', e);
          // setCurrentPositionSec( e.currentPosition)
          // setCurrentDurationSec(e.duration)
          // setPlayTime(audioRecorderPlayer.mmssss(
          //   Math.floor(e.currentPosition),
          // ))
          // setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)))
        });
      } catch (err) {
        // console.log('startPlayer error', err);
      }
    } else {
      setPlayRecoding(false);
      // console.log("resultStop");
      await audioRecorderPlayer.pausePlayer();
      audioRecorderPlayer.removePlayBackListener();
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
      <TouchableOpacity
        style={{ width: '100%' }}
        key={index}
        onPress={() => Keyboard.dismiss()}
      >
        {item?.user_id === item?.created_by ? (
          <View style={{ alignItems: 'flex-end', paddingRight: 10, gap: 10 }}>
            <View style={{ padding: 10 }}>
              {item?.message ? (
                <View
                  style={{
                    backgroundColor: Config.Colors.backgroundColors.bg_3,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}
                  >
                     <Text
                      style={{
                        color: Config.Colors.textColor.textColor_2,
                        alignSelf: 'flex-end',
                        textAlign: 'right',
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {item?.message}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Config.Colors.textColor.textColor_1,
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {toLocaleDateString(item?.created_at).customValTimeString}
                    </Text>
                   
                  </View>
                </View>
              ) : null}
              {/* {item?.attachment_filename != "" ?
                <Image source={{ uri: `${item?.attachment_filename}` }}
                  style={{ width: widthToDp(50), height: widthToDp(50), resizeMode: 'contain' }}
                />
                : null} */}
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'flex-end', paddingRight: 10, gap: 10 }}>
            <View style={{ padding: 10 }}>
              {item?.message ? (
                <View
                  style={{
                    backgroundColor: Config.Colors.backgroundColors.bg_3,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Text
                      style={{
                        color: Config.Colors.textColor.textColor_1,
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {toLocaleDateString(item?.created_at).customValTimeString}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Config.Colors.textColor.textColor_2,
                        alignSelf: 'flex-end',
                        textAlign: 'right',
                        fontFamily: Config.fontFamilys.Poppins_Medium,
                      }}
                    >
                      {item?.message}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
            {item?.attachment_filename?.includes('mp3') ? (
              <TouchableOpacity
                style={{
                  borderRadius: 2,
                  borderColor: Config.Colors.black,
                  width: widthToDp(50),
                  height: widthToDp(30),
                  // backgroundColor: "#000",
                }}
              >
                {/* <Image source={{ uri: `${item?.attachment_filename}` }}
                  style={{ width: widthToDp(50), height: widthToDp(30), resizeMode: 'cover' }}
                /> */}
                <AudioPlayer
                  path={`${item?.attachment_filename}`}
                  handleRecoding={() => handleRecodingPlay('Play', path)}
                />
              </TouchableOpacity>
            ) : item?.attachment_filename !== '' ? (
              <TouchableOpacity
                onPress={() => handelFullImage(`${item?.attachment_filename}`)}
                style={{
                  borderRadius: 10,
                  borderColor: Config.Colors.black,
                  width: widthToDp(50),
                  height: widthToDp(30),
                  backgroundColor: '#000',
                }}
              >
                <Image
                  source={{ uri: `${item?.attachment_filename}` }}
                  style={{
                    width: widthToDp(50),
                    height: widthToDp(30),
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}
                  onLoad={() => setImageLoader(true)}
                  onLoadStart={() => setImageLoader(true)}
                  onLoadEnd={() => setImageLoader(false)}
                />

                {imageLoader ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <ActivityIndicator
                      size={35}
                      color={Config.Colors.textColor.textColor_1}
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItemDateMessage = ({ item, index }) => {
    return (
      <View key={index}>
        <View style={{ paddingBottom: 10, paddingTop: 10 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 10,
              paddingTop: 10,
              borderBlockColor: Config.Colors.borderColor,
              borderBottomWidth: 3,
              backgroundColor: Config.Colors.cyan_blue,
            }}
          >
            <Text
              style={{
                color: Config.Colors.textColor.textColor_2,
                fontFamily: Config.fontFamilys.Poppins_Medium,
              }}
            >
              {item?.date}
            </Text>
          </View>
        </View>
        {item?.dataDetail ? (
          <FlatList
            data={item?.dataDetail}
            extraData={item?.dataDetail}
            renderItem={item => renderItemMessage(item)}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        ) : null}
      </View>
    );
  };
  const handleScrollToEnd = () => {
    console.log('first');
    // flatListRef.current?.scrollToEnd({ animated: true })
    flatListRef?.current?.scrollToEnd({ animated: true });
  };
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={t(Config.homeScreenTabText?.chat_us)}
        animated={true}
        onPressLeft={goBackScreen}
        //   rightImage={Icons.bell_icon}
        //   onPressRight={()=>onPressBtn('notification')}
        tintColorRight={Config.Colors.defaultColor}
      />
      <View style={{ flex: 1, backgroundColor: Config.Colors.defaultColor }}>
        <View style={{ flex: 3.6 / 4, position: 'relative' }}>
          {chatMessage?.length ? (
            <FlatList
              refreshing={pageLoader}
              onRefresh={() => getMessage()}
              ref={it => (flatListRef.current = it)}
              data={chatMessage}
              onContentSizeChange={handleScrollToEnd}
              extraData={chatMessage}
              renderItem={item => renderItemDateMessage(item)}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={0.1}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={false}
              // style={{
              //   marginBottom: 0
              // }}
              contentContainerStyle={{
                paddingBottom: 50,
                // backgroundColor:'#000'
              }}
              automaticallyAdjustKeyboardInsets={true}
              // keyboardShouldPersistTaps={'always'}
            />
          ) : pageLoader ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={35} color={Config.Colors.textColor.textColor_1} />
            </View>
          ) : (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SvgXml xml={NotFound_result} />
            </View>
          )}
        </View>

        <View
          style={{
            width: widthToDp(100),
            position: 'absolute',
            justifyContent: 'center',
            bottom: 0,
            flexDirection: 'row',
            gap: 3,
            // zIndex: 9999,
            backgroundColor: Config.Colors.bodyBg,
            // height: widthToDp(25)
          }}
        >
          {!startRecding ? (
            <>
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
                commonHeight={widthToDp(15)}
                placeholder={t(Config.todayNotesSreenText?.message)}
                keyboardType={'default'}
                autoComplete={'cc-csc'}
                commmonBorderRadius={100}
                // commonBackgroundColor={"#000"}
                // errorMessage={errorMessage?.subject ? errorMessage?.subject : ''}
                borderColor={Config.Colors.themeColor}
                onChangeText={text => setMessage(text)}
                inputValue={message}
                onFocusFunction={handleScrollToEnd}
              />
              {message ? (
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
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: Config.Colors.themeColor,
                    width: widthToDp(11),
                    height: heightToDp(5.5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                  }}
                  onLongPress={onStartRecord}
                >
                  <Image
                    source={Icons.mic_icon}
                    tintColor={'#fff'}
                    style={{ width: widthToDp(5), height: widthToDp(5) }}
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: Config.Colors.themeColor,
                  width: widthToDp(11),
                  height: heightToDp(5.5),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}
                onPress={() => onStopRecord()}
              >
                <Image
                  source={Icons.bin}
                  tintColor={'#fff'}
                  style={{ width: widthToDp(5), height: widthToDp(5) }}
                />
              </TouchableOpacity>
              {voiceLoader ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <ActivityIndicator
                    size={35}
                    color={Config.Colors.themeColor}
                  />
                </View>
              ) : null}

              {pauseRecoding ? (
                <>
                  {playRecoding ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Config.Colors.themeColor,
                        width: widthToDp(11),
                        height: heightToDp(5.5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                      }}
                      onPress={() => handleRecodingPlay('Pause', path)}
                    >
                      <Image
                        source={Icons.pause_icon}
                        tintColor={Config.Colors.defaultColor}
                        style={{ width: widthToDp(5), height: widthToDp(5) }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Config.Colors.themeColor,
                        width: widthToDp(11),
                        height: heightToDp(5.5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                      }}
                      onPress={() => handleRecodingPlay('Play', path)}
                    >
                      <Image
                        source={Icons.play_icon}
                        tintColor={Config.Colors.defaultColor}
                        style={{ width: widthToDp(5), height: widthToDp(5) }}
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : null}

              {!pauseRecoding ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: Config.Colors.themeColor,
                    width: widthToDp(11),
                    height: heightToDp(5.5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                  }}
                  onPress={() => onPauseRecord('Pause')}
                >
                  <Image
                    source={Icons.pause_icon}
                    tintColor={Config.Colors.red}
                    style={{ width: widthToDp(5), height: widthToDp(5) }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: Config.Colors.themeColor,
                    width: widthToDp(11),
                    height: heightToDp(5.5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                  }}
                  onPress={() => onPauseRecord('Resume')}
                >
                  <Image
                    source={Icons.mic_icon}
                    tintColor={Config.Colors.red}
                    style={{ width: widthToDp(5), height: widthToDp(5) }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: Config.Colors.themeColor,
                  width: widthToDp(11),
                  height: heightToDp(5.5),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}
                disabled={recordingPath ? false : true}
                onPress={() => onRecodingSubmit()}
              >
                <Image
                  source={Icons.send_icon}
                  tintColor={'#fff'}
                  style={{ width: widthToDp(5), height: widthToDp(5) }}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View>
        {openModal ? (
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
                      color: Config.Colors.black,
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
                    onPress={() => uploadDoc('openPicker')}
                  >
                    <Image
                      source={Icons?.gallery_icon}
                      style={{ width: widthToDp(4), height: heightToDp(2) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: Config.Colors.black,
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
                        color: Config.Colors.black,
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
        ) : null}
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
              imageLoader={imageLoader}
              handleFullImage={() => setFullImage(!fullImage)}
              imagePath={imagePath}
              handleSubmit={() => handleSubmitImage(base64)}
              base64={base64}
            />
          </CustomModal>
        ) : null}
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
export default React.memo(Chat);
