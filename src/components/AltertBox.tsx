import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import CustomModal from './CustomModal';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import * as Config from '../helpers/Config';
import { useSelector } from 'react-redux';
 
type AltertBoxProps = {
  isModalVisible: boolean;
  onRequestClose: () => void;
  imageIcon: any;
  confirm: () => void;
  cancel: () => void;
  textMessage?: { text1?: string; text2?: string };
  btnLeftText?: string;
  btnRightText?: string;
  loader?: boolean;
};
 
const AltertBox: React.FC<AltertBoxProps> = ({
  isModalVisible,
  onRequestClose,
  imageIcon,
  confirm,
  cancel,
  textMessage,
  btnLeftText = 'Confirm',
  btnRightText = 'Cancel',
  loader = false,
}) => {
  useSelector((state: any) => state.login);
 
  return (
    <CustomModal
      transparent={true}
      modalVisible={isModalVisible}
      onRequestClose={onRequestClose}
      alignItems="center"
      justifyContent="center"
    >
      {loader ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 9999999999999,
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
 
      <View
        style={{
          backgroundColor: Config.Colors.defaultColor,
          width: widthToDp(80),
          borderRadius: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            height: heightToDp(6),
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              top: -30,
              width: widthToDp(20),
              height: heightToDp(10),
              borderRadius: 100,
              backgroundColor: Config.Colors.themeColor,
            }}
          >
            <Image
              source={imageIcon}
              style={{
                height: 55,
                width: 55,
                alignSelf: 'center',
                tintColor: Config.Colors.defaultColor,
              }}
            />
          </View>
        </View>
 
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <Text
            style={{
              fontFamily: Config.fontFamilys.Poppins_Bold,
              fontSize: widthToDp(3.5),
              color: Config.Colors.black,
            }}
          >
            {textMessage?.text1}
          </Text>
          <Text
            style={{
              fontFamily: Config.fontFamilys.Poppins_Bold,
              fontSize: widthToDp(3.5),
              color: Config.Colors.black,
            }}
          >
            {textMessage?.text2}
          </Text>
        </View>
 
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 15,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Config.Colors.successField,
              width: '45%',
              height: heightToDp(5),
              borderRadius: 10,
              elevation: 1,
            }}
            onPress={confirm}
          >
            <Text
              style={{
                fontFamily: Config.fontFamilys.Poppins_Bold,
                color: Config.Colors.black,
              }}
            >
              {btnLeftText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Config.Colors.errorField,
              width: '45%',
              height: heightToDp(5),
              borderRadius: 10,
              elevation: 1,
            }}
            onPress={cancel}
          >
            <Text
              style={{
                fontFamily: Config.fontFamilys.Poppins_Bold,
                color: Config.Colors.black,
              }}
            >
              {btnRightText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};
 
export default AltertBox;