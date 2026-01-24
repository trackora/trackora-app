import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Alert, Button, Switch } from 'react-native';
import Sound from 'react-native-sound';

const AudioPlayer = ({ path }) => {
  Sound.setCategory('Playback', true); // true = mixWithOthers
  const [sound, setSound] = useState(null);
  const [isLoop, setIsLoop] = useState(false);


  const handlePlayer = (type) => {
    var whoosh = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      whoosh.setVolume(1.0);

      if (type === "play") {
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        // Play the sound with an onEnd callback
        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
        whoosh.setPan(1);
        // whoosh.setNumberOfLoops(-1);

      } else if (type === "stop") {
        whoosh.stop((success) => {
          // whoosh.play();
          if (success) {
            console.log('successfully finished stop');
          } else {
            console.log('stop failed due to audio decoding errors');
          }
        });
      }else if (type === "pause") {
        whoosh.pause((success)=>{
          if (success) {
            console.log('successfully finished pause');
          } else {
            console.log('pause failed due to audio decoding errors');
          }

        });
      }
      // loaded successfully

    });
  };

  const _pause = () => {
    sound.pause();
  };

  const _stop = () => {
    sound.stop();
  };





  const _toggleLoop = (value) => {
    if (value) {
      sound.setNumberOfLoops(-1); // loop infinite
    } else {
      sound.setNumberOfLoops(0); // no loop
    }

    setIsLoop(value);
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
      <Button title={'Play'} onPress={()=>handlePlayer("play")} />
      <Button title={'Pause'} onPress={()=>handlePlayer("pause")} />
      <Button title={'Stop'} onPress={()=>handlePlayer("stop")} />
      {/* <Switch onValueChange={(value) => _toggleLoop(value)} value={isLoop} /> */}
    </SafeAreaView>
  );
}

export default AudioPlayer;
