import React, { ReactNode, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';

/* ===================== TYPES ===================== */

interface CustomModalProps {
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  modalVisible?: boolean;
  onRequestClose: () => void | boolean;
  disableOnPress?: boolean;
  children: ReactNode;
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  backgroundColor?: string;

  /* 🔥 IMPORTANT: allow screen props (NO UI CHANGE) */
  showHeader?: boolean;
  headerText?: string;
}

/* ===================== COMPONENT ===================== */

const CustomModal: React.FC<CustomModalProps> = ({
  animationType = 'fade',
  transparent = true,
  modalVisible = true,
  onRequestClose,
  disableOnPress = false,
  children,
  alignItems = 'center',
  justifyContent = 'center',
  backgroundColor = 'rgba(0,0,0,0.5)',

  // accepted but intentionally unused (backward compatibility)
  showHeader,
  headerText,
}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onRequestClose();
        return true; // 🔥 REQUIRED for Android
      },
    );

    return () => backHandler.remove();
  }, [onRequestClose]);

  return (
    <View style={styles.container}>
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        {disableOnPress ? (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems,
              justifyContent,
              backgroundColor,
            }}
            activeOpacity={1}
            onPressOut={() => onRequestClose()}
          >
            <View>
              <TouchableWithoutFeedback>
                <View>{children}</View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems,
              justifyContent,
              backgroundColor,
            }}
          >
            {children}
          </View>
        )}
      </Modal>
    </View>
  );
};

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomModal;
