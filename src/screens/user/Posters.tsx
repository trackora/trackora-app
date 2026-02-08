// import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native'
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator, DrawerLayoutAndroid } from 'react-native';
import React from 'react'
import RNFS from 'react-native-fs'
import { Header_1, Header_2, Header_3 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { SvgCalender } from '../../helpers/Svg';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { useSelector } from 'react-redux';
import CustomMenu from '../../components/CustomMenu';
import poster from '../../assets/json/posterList.json'
import LoadingSpinner from '../../animated/LoadingSpinner';
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';
import { apiPostService } from '../../helpers/services';
import imagesData from '../../assets/json/ImagesURL.json'
import { useTranslation } from 'react-i18next';

const Posters = ({ navigation }) => {
  const [editPicture, setEditPicture] = React.useState(false);
  const [posterData, setPosterData] = React.useState(poster?.posterType);
  const [loading, setLoading] = React.useState(false)
  const [postType, setPosterType] = React.useState([]);
  const {t} = useTranslation();
  const onPressBtn = (item) => {
    setEditPicture(!editPicture);
    setPosterData(item)
  }
  const goBackScreen = () => {
    navigation.goBack();
  }
  const handleImageData = () => {

  }
  const getPosterType = async () => {
    let bodyData = {
    }
    const apiData = await apiPostService(Constants?.poster_type_api, bodyData);
    if (apiData?.data?.result.data) {
      setPosterType(apiData?.data?.result.data)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      getPosterType();
    }, [])
  );
  const renderItem = ({ item, index }) => {
    if (item.status) {
      return (
        <CustomMenu
          commonWidth={widthToDp(90)}
          tintColor2={Config.Colors.black}
          commonHeight={heightToDp(10)}
          item={item}
          onPress={(text) => onPressBtn(text)}
          bottomImg={Icons.arrow_forward}
          style={styles}
        />)
    }
  }

  // const openPhotoEditor = async (imageUrl) => {
  //   setLoading(true);
  //   try {
  //     const localImagePath = RNFS.DocumentDirectoryPath + '/editedPhoto.jpg';
  //     // Download the image to the local directory
  //     const downloadResult = await RNFS.downloadFile({
  //       fromUrl: imageUrl,
  //       toFile: localImagePath,
  //     }).promise;
  //     if (downloadResult.statusCode === 200) {
  //       // Image downloaded successfully, open photo editor
  //       setLoading(false);
  //       const result = await PhotoEditor.Edit({
  //         path: localImagePath,
  //         onDone: async () => {
  //           const editedImageBase64 = await RNFS.readFile(localImagePath, 'base64');
  //           const options = {
  //             message: 'Edited photo message',
  //             url: `data:image/jpeg;base64,${editedImageBase64}`,
  //           };

  //           Share.open(options)
  //             .then((res) => {
  //               console.log(res);
  //             })
  //             .catch((err) => {
  //               return err
  //             });
  //           // await Share.open({
  //           //   url: localImagePath,
  //           //   type: 'image/jpeg',
  //           // });
  //         },
  //         onCancel: () => {
  //           console.log('Photo editor canceled');
  //         },
  //       });
  //     } else {
  //       console.error('Failed to download image:', downloadResult);
  //     }
  //   } catch (error) {
  //     console.error('Error opening photo editor:', error);
  //   }
  // };
  // console.log(openPhotoEditor)

  const share = async (imageURL) => {
    // setLoading(true);
    try {
      const response = await fetch(imageURL);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        const croppedImagebase64String = (typeof dataUrl === 'string' ? dataUrl : '').split(',')[1];

        // PESDK.openEditor(require(""))
        const options = {
          message: 'Hello message',
          url: `data:image/jpeg;base64,${croppedImagebase64String}`,
        };
        Share.open(options)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            return err
          });
      };

      reader.readAsDataURL(blob);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };
  const renderImages = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Image
        style={{ width: widthToDp(90), height: heightToDp(30) }}
        source={{ uri: item }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.shareButton} onPress={() => {}} disabled={loading ? true : false}>
          <Text style={{ color: Config.Colors.defaultColor, textAlign: "center", fontSize: 20 }}>{t(Config.posterScreenText?.edit)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={() => share(item)} disabled={loading && true}>
          <Text style={{ color: Config.Colors.defaultColor, textAlign: "center", fontSize: 20 }}>{t(Config.posterScreenText?.share)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={Config?.yourActivityArray[0]?.otherArray[0]?.title}
        animated={true}
        onPressLeft={goBackScreen}
      />


      <View style={styles.body}>
        <View style={styles?.boxContainerIner}>
          {/* <FlatList
            data={posterData}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
            // style={{height:heightToDp(70)}}
            showsVerticalScrollIndicator={false}
          /> */}

          <FlatList
            data={imagesData.Images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImages}
          />
          <View style={styles.loadingContainer}>
            {loading && (
              <ActivityIndicator size="large" color={Config.Colors.themeColor} />
            )}
          </View>
        </View>
      </View>
      <LoadingSpinner />
    </View >
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    marginTop: 10,
  },
  text: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    color: '#000'
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: widthToDp(90),
    margin: 10,
    padding: 10
  },
  boxContainer: {
    alignSelf: 'center',
    bottom: 10
  },
  boxContainerIner: {
    marginBottom: widthToDp(30),
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 1
  },
  bottomImg: {
    backgroundColor: Config.Colors.bodyBg,
    width: widthToDp(10),
    height: heightToDp(5),
    alignItems: 'center',
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    padding: widthToDp(2)
  },
  shareButton: {
    backgroundColor: Config.Colors.themeColor,
    padding: heightToDp(1),
    marginTop: heightToDp(1),
    width: widthToDp(44)
  },
  loadingContainer: {
    position: "absolute",
    width: widthToDp(100),
    height: heightToDp(100),
    justifyContent: "center",
    alignItems: "center",
    // zIndex: 2 
  }
})
export default React.memo(Posters);