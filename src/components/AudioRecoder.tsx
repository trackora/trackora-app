import React from 'react';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from 'react-native';
import Button from '../components/Button';
import RNFS from 'react-native-fs';
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#455A64',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleTxt: {
    marginTop: 100,
    color: 'white',
    fontSize: 28,
  },
  viewRecorder: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  recordBtnWrapper: {
    flexDirection: 'row',
  },
  viewPlayer: {
    marginTop: 60,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    marginTop: 28,
    marginHorizontal: 28,
    alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4,
    width: 0,
  },
  playStatusTxt: {
    marginTop: 8,
    color: '#ccc',
  },
  playBtnWrapper: {
    flexDirection: 'row',
    marginTop: 40,
  },
  btn: {
    borderColor: 'white',
    borderWidth: 1,
  },
  txt: {
    color: 'white',
    fontSize: 14,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  txtRecordCounter: {
    marginTop: 32,
    color: 'white',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
  txtCounter: {
    marginTop: 12,
    color: 'white',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
});
 
const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);
 
const AudioRecoder: React.FC = () => {
  const path = Platform.select({
    ios: undefined,
    android: `${RNFS.DocumentDirectoryPath}/hello.mp3`.replace(/:/g, '-'),
  });
  const screenWidth = Dimensions.get('screen').width;
  const [recordSecs, setRecordSecs] = React.useState(0);
  const [recordTime, setRecordTime] = React.useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = React.useState(0);
  const [currentDurationSec, setCurrentDurationSec] = React.useState(0);
  const [playTime, setPlayTime] = React.useState('00:00:00');
  const [duration, setDuration] = React.useState('00:00:00');
 
  let playWidth =
    (currentPositionSec / currentDurationSec) * (screenWidth - 56);
  if (!playWidth) {
    playWidth = 0;
  }
 
  const onStatusPress = (e: GestureResponderEvent) => {
    const touchX = e.nativeEvent.locationX;
 
    const currentPlayWidth =
      (currentPositionSec / currentDurationSec) * (screenWidth - 56);
 
    const currentPosition = Math.round(currentPositionSec);
 
    if (currentPlayWidth && currentPlayWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      audioRecorderPlayer.seekToPlayer(addSecs);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      audioRecorderPlayer.seekToPlayer(subSecs);
    }
  };
 
  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
 
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          // permissions granted
        } else {
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
 
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };
 
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
 
    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(
        audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      );
    });
    console.log(`uri: ${uri}`);
  };
 
  const onPauseRecord = async () => {
    try {
      const r = await audioRecorderPlayer.pauseRecorder();
      console.log(r);
    } catch (err) {
      console.log('pauseRecord', err);
    }
  };
 
  const onResumeRecord = async () => {
    await audioRecorderPlayer.resumeRecorder();
  };
 
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };
 
  const onStartPlay = async () => {
    try {
      const msg = await audioRecorderPlayer.startPlayer(path);
      const volume = await audioRecorderPlayer.setVolume(1.0);
      console.log(`path: ${msg}`, `volume: ${volume}`);
 
      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };
 
  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };
 
  const onResumePlay = async () => {
    await audioRecorderPlayer.resumePlayer();
  };
 
  const onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleTxt}>Audio Recorder Player</Text>
      <Text style={styles.txtRecordCounter}>{recordTime}</Text>
      <View style={styles.viewRecorder}>
        <View style={styles.recordBtnWrapper}>
          <Button style={styles.btn} onPress={onStartRecord} textStyle={styles.txt}>
            Record
          </Button>
          <Button
            style={[styles.btn, { marginLeft: 12 }]}
            onPress={onPauseRecord}
            textStyle={styles.txt}
          >
            Pause
          </Button>
          <Button
            style={[styles.btn, { marginLeft: 12 }]}
            onPress={onResumeRecord}
            textStyle={styles.txt}
          >
            Resume
          </Button>
          <Button
            style={[styles.btn, { marginLeft: 12 }]}
            onPress={onStopRecord}
            textStyle={styles.txt}
          >
            Stop
          </Button>
        </View>
      </View>
      <View style={styles.viewPlayer}>
        <TouchableOpacity style={styles.viewBarWrapper} onPress={onStatusPress}>
          <View style={styles.viewBar}>
            <View style={[styles.viewBarPlay, { width: playWidth }]} />
          </View>
        </TouchableOpacity>
        <Text style={styles.txtCounter}>
          {playTime} / {duration}
        </Text>
        <View style={styles.playBtnWrapper}>
          <Button style={styles.btn} onPress={onStartPlay} textStyle={styles.txt}>
            Play
          </Button>
          <Button
            style={[styles.btn, { marginLeft: 12 }]}
            onPress={onPausePlay}
            textStyle={styles.txt}
          >
            Pause
          </Button>
          <Button
            style={[styles.btn, { marginLeft: 12 }]}
            onPress={onResumePlay}
            textStyle={styles.txt}
          >
            Resume
          </Button>
          <Button
            style={[styles.btn, { marginLeft: 12 }]}
            onPress={onStopPlay}
            textStyle={styles.txt}
          >
            Stop
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
 
export default AudioRecoder;