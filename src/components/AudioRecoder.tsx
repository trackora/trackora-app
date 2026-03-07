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
  const [currentDurationSec, setCurrentDurationSec] = React.useState(1);
  const [playTime, setPlayTime] = React.useState('00:00:00');
  const [duration, setDuration] = React.useState('00:00:00');

  const playWidth =
    currentDurationSec > 0
      ? (currentPositionSec / currentDurationSec) * (screenWidth - 56)
      : 0;

  const onStatusPress = (e: GestureResponderEvent) => {
    const touchX = e.nativeEvent.locationX;
    const currentPlayWidth =
      (currentPositionSec / currentDurationSec) * (screenWidth - 56);
    const currentPosition = Math.round(currentPositionSec);

    if (currentPlayWidth < touchX) {
      audioRecorderPlayer.seekToPlayer(currentPosition + 1000);
    } else {
      audioRecorderPlayer.seekToPlayer(
        Math.max(currentPosition - 1000, 0),
      );
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

        const granted = Object.values(grants).every(
          g => g === PermissionsAndroid.RESULTS.GRANTED,
        );

        if (!granted) return;
      } catch {
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

    await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(
        audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      );
    });
  };

  const onStopRecord = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
  };

  const onStartPlay = async () => {
    await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);

    audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration || 1);
      setPlayTime(audioRecorderPlayer.mmssss(e.currentPosition));
      setDuration(audioRecorderPlayer.mmssss(e.duration));
    });
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
          <Button style={styles.btn as any} onPress={onStartRecord} textStyle={styles.txt as any}>
            Record
          </Button>
          <Button style={styles.btn as any} onPress={onStopRecord} textStyle={styles.txt as any}>
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
          <Button style={styles.btn as any} onPress={onStartPlay} textStyle={styles.txt as any}>
            Play
          </Button>
          <Button style={styles.btn as any} onPress={onStopPlay} textStyle={styles.txt as any}>
            Stop
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AudioRecoder;
