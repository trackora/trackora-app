import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import Notes from '../../assets/NotesData.json';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import CustomModal from '../../components/CustomModal';
const AllNotes = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const renderNotes = ({ item }) => {
    return (
      <View>
        {/* <Text>{item.text}</Text> */}
        <TouchableOpacity onPress={() => setSelectedImage(item.image.url)}>
          <Image
            style={{ width: widthToDp(25), height: heightToDp(10) }}
            source={{ uri: item.image.url }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={Notes}
        renderItem={renderNotes}
        keyExtractor={(item, index) => index.toString()}
      />
      <CustomModal
        modalVisible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        style={{}}
      >
        <View style={styles.ModalView}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <TouchableOpacity onPress={() => setSelectedImage(null)}>
              <Image
                style={{ width: widthToDp(77), height: heightToDp(48) }}
                source={{ uri: selectedImage }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  ModalView: {
    backgroundColor: '#fff',
    height: heightToDp(50),
    width: widthToDp(80),
    // borderRadius: 5,
  },
});

export default React.memo(AllNotes);
