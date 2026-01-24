import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useCallback } from 'react';
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useSelector } from 'react-redux';
import CustomMenu from '../../components/CustomMenu';
import CustomModal from '../../components/CustomModal';

const AttendanceLeaveDetails = ({ navigation }) => {
  const onPressBtn = text => {
    switch (text) {
      case 'view_attendance':
        navigation.navigate('attendance');
        break;
      case 'reqLeave':
        navigation.navigate('requestleave');
        break;
      case 'documents':
        navigation.navigate('documents');
        break;
      case 'holidayList':
        navigation.navigate('holiday-list');
        break;
      default:
        break;
    }
  };
  const renderItem = useCallback(({ item, index }) => {
    if (item.status) {
      return (
        <CustomMenu
          commonWidth={widthToDp(90)}
          tintColor2={Config.Colors.black}
          commonHeight={heightToDp(10)}
          item={item}
          onPress={text => onPressBtn(text)}
          bottomImg={Icons.arrow_forward}
          style={styles}
        />
      );
    }
  }, []);
  const goBackScreen = () => navigation.goBack();
  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={Config?.yourActivityArray[0].title}
        animated={true}
        onPressLeft={goBackScreen}
      />
      <View style={styles.body}>
        <View style={styles?.boxContainerIner}>
          <FlatList
            data={Config?.LeaveAttendanceArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.Colors.bodyBg,
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
    bottom: 10,
  },
  boxContainerIner: {
    marginBottom: widthToDp(30),
    justifyContent: 'center',
    alignItems: 'center',
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
export default React.memo(AttendanceLeaveDetails);
