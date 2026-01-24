import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';
import * as Config from '../helpers/Config';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedModal from './AnimatedModal';

interface BottomSheetProps {
  children: ReactNode;
}

interface BottomSheetRef {
  isActive: () => boolean;
  scrollTo: (position: number) => void;
}

const BottomSheet = ({ children }: BottomSheetProps) => {
  const ref = React.useRef<BottomSheetRef>(null);

  const onPress = React.useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-400);
    }
  }, []);
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <TouchableOpacity style={styles.button} onPress={onPress} />
        <View style={styles.container}>
          <AnimatedModal ref={ref}>{children}</AnimatedModal>
        </View>
      </GestureHandlerRootView>
    </View>
  );
};
const styles = StyleSheet.create({
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
    bottom: 10,
  },
  boxContainerIner: {
    marginBottom: widthToDp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomImg: {
    width: widthToDp(10),
    alignItems: 'center',
    borderRadius: 20,
  },
  addButtonBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: widthToDp(16),
    height: heightToDp(8),
    borderRadius: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthToDp(100),
    height: 100,
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'white',
    opacity: 0.6,
  },
});
export default React.memo(BottomSheet);
