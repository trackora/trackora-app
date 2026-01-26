import React, { useState } from 'react';
import { SafeAreaView, Button } from 'react-native';
import Sound from 'react-native-sound';
 
type AudioPlayerProps = {
  path: string;
};
 
const AudioPlayer: React.FC<AudioPlayerProps> = ({ path }) => {
  Sound.setCategory('Playback', true);
 
  const [sound, setSound] = useState<Sound | null>(null);
  const [isLoop, setIsLoop] = useState(false);
 
  const handlePlayer = (type: 'play' | 'pause' | 'stop') => {
    const whoosh = new Sound(path, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      whoosh.setVolume(1.0);
 
      if (type === 'play') {
        console.log(
          'duration in seconds: ' +
            whoosh.getDuration() +
            ' number of channels: ' +
            whoosh.getNumberOfChannels(),
        );
        whoosh.play(success => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
        whoosh.setPan(1);
      } else if (type === 'stop') {
        whoosh.stop(success => {
          if (success) {
            console.log('successfully finished stop');
          } else {
            console.log('stop failed due to audio decoding errors');
          }
        });
      } else if (type === 'pause') {
        whoosh.pause(success => {
          if (success) {
            console.log('successfully finished pause');
          } else {
            console.log('pause failed due to audio decoding errors');
          }
        });
      }
 
      setSound(whoosh);
    });
  };
 
  const _toggleLoop = (value: boolean) => {
    if (!sound) return;
    sound.setNumberOfLoops(value ? -1 : 0);
    setIsLoop(value);
  };
 
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
      }}
    >
      <Button title="Play" onPress={() => handlePlayer('play')} />
      <Button title="Pause" onPress={() => handlePlayer('pause')} />
      <Button title="Stop" onPress={() => handlePlayer('stop')} />
    </SafeAreaView>
  );
};
 
export default AudioPlayer;