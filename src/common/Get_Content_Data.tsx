import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import { Header_2 } from '../components/Header';
import * as Icons from '../helpers/Icons';
import * as Config from '../helpers/Config';
import * as Constants from '../helpers/Constants';
import RenderHTML from 'react-native-render-html';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { apiPostService } from '../helpers/services';
import { useFocusEffect } from '@react-navigation/native';
import { login } from '../redux/slices/login.slice';
import { useTranslation } from 'react-i18next';

const Get_Content_Data = ({ slug, dataStoreKey, headerText, navigation }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.login?.data?.[dataStoreKey]?.data);
  const getTokenData = useSelector(state => state.login);
  const { width } = useWindowDimensions();

  const goBackScreen = () => {
    navigation.goBack();
  };

  const fetchContentData = async () => {
    try {
      const bodyData = { slug, lang: 'en' };
      const apiData = await apiPostService(Constants.get_content_api, bodyData);
      const updatedStore = {
        ...getTokenData.data,
        [dataStoreKey]: apiData?.data,
      };
      dispatch(login(updatedStore));
    } catch (error) {
      console.log(`Error fetching Content data with slug ${slug}:`, error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchContentData();
    }, []),
  );

  React.useEffect(() => {
    fetchContentData();
  }, []);

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={headerText}
        animated={true}
        onPressLeft={goBackScreen}
      />

      <ScrollView style={{ marginBottom: 10 }}>
        <View style={styles.body}>
          <View style={styles?.boxContainerIner}>
            <Text
              style={{
                textAlign: 'justify',
                fontFamily: Config.fontFamilys.Poppins_Bold,
                color: Config.Colors.black,
              }}
            >
              {data?.title}
            </Text>
            {data?.description && (
              <RenderHTML
                style={{ textAlign: 'justify', color: Config.Colors.black }}
                contentWidth={width}
                source={{ html: data?.description }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainerIner: {
    width: widthToDp(90),
    minHeight: heightToDp(8),
    backgroundColor: Config.Colors.defaultColor,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignContent: 'center',

    padding: widthToDp(4),
  },
  body: {
    marginTop: widthToDp(3),
    width: widthToDp(100),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.1,
  },
});

export default React.memo(Get_Content_Data);
