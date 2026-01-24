import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  PermissionsAndroid,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useTranslation } from 'react-i18next';

import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import * as Constants from '../../helpers/Constants';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { apiPostService } from '../../helpers/services';
import { login } from '../../redux/slices/login.slice';
import { isApiSuccess } from '../../helpers/Validation';

const ContactUs = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const mapRef = useRef(null);

  const { data: tokenData } = useSelector(state => state.login);

  const [mapType, setMapType] = useState('standard');
  const [mapLocation, setMapLocation] = useState({
    latitude: 19.140255162349007,
    longitude: 72.85484531393793,
  });
  const [loading, setLoading] = useState(true);

  const contactDetails = tokenData?.contactUsData?.data || null;

  /**
   * Fetch contact-us data from API and update redux + local map state
   */
  const fetchContactUsDetails = async () => {
    try {
      setLoading(true);
      const bodyData = { slug: 'contact-us', lang: 'en' };
      const apiResponse = await apiPostService(
        Constants.get_content_api,
        bodyData,
      );
      if (isApiSuccess(apiResponse) && apiResponse?.data?.data) {
        const details = apiResponse.data.data;

        // update redux
        dispatch(login({ ...tokenData, contactUsData: apiResponse.data }));

        // update map location if API provides valid coords
        if (details.latitude && details.longitude) {
          setMapLocation({
            latitude: parseFloat(details.latitude),
            longitude: parseFloat(details.longitude),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching contact us details:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request current device location (optional, not mandatory here)
   */
  const requestCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t(Config.branchesText?.location_permission),
            message: t(Config.branchesText?.permission_message),
            buttonPositive: t(Config.branchesText?.ok),
            buttonNegative: t(Config.branchesText?.cancel),
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => setMapLocation(position.coords),
            error => console.error(error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
      } else {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          Geolocation.getCurrentPosition(pos => setMapLocation(pos.coords));
        }
      }
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  // fetch API once on mount + focus
  useFocusEffect(
    useCallback(() => {
      fetchContactUsDetails();
    }, []),
  );

  useEffect(() => {
    fetchContactUsDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText={t(Config.contactScreenText?.contact_us)}
        animated
        onPressLeft={() => navigation.goBack()}
      />

      {/* Map Section */}
      <MapView.Animated
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          ...mapLocation,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        mapType={mapType}
        loadingEnabled
      >
        <Marker
          coordinate={mapLocation}
          description={`${t(Config.punchScreenText?.latitude)}: ${
            mapLocation.latitude
          }, 
                        ${t(Config.punchScreenText?.longitude)}: ${
            mapLocation.longitude
          }`}
          pinColor="orange"
        />
      </MapView.Animated>

      {/* Contact Details Section */}
      <View style={styles.bottomSheet}>
        {loading ? (
          <ActivityIndicator size={55} color={Config.Colors.themeColor} />
        ) : contactDetails ? (
          <ScrollView style={{ bottom: widthToDp(10) }}>
            <View style={styles.body}>
              <View style={styles.cardContainer}>
                <ContactRow
                  icon={Icons.phone_call_icon}
                  label={t(Config.contactScreenText?.contact_us_at)}
                  value={contactDetails.mobile_no_1}
                />
                <ContactRow
                  icon={Icons.email_icon}
                  label={t(Config.holidayListText?.email)}
                  value={contactDetails.email}
                />
                <ContactRow
                  icon={Icons.address_icon}
                  label={t(Config.myProfileText?.address)}
                  value={contactDetails.address}
                  multiline
                />
                <SocialRow
                  facebook={contactDetails.facebook_url}
                  instagram={contactDetails.instagram_url}
                  website={contactDetails.website}
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.errorText}>
            {t('No contact details available')}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * Reusable component: Single contact row
 */
const ContactRow = ({ icon, label, value, multiline }) => (
  <View style={styles.row}>
    <Image source={icon} style={styles.rowIcon} resizeMode="contain" />
    <View>
      <Text style={styles.text1}>{label}:</Text>
      <Text style={[styles.text2, multiline && { paddingRight: 10 }]}>
        {value}
      </Text>
    </View>
  </View>
);

/**
 * Reusable component: Social links row
 */
const SocialRow = ({ facebook, instagram, website }) => (
  <View
    style={[
      styles.row,
      { borderBottomWidth: 0, justifyContent: 'space-between' },
    ]}
  >
    <SocialIcon icon={Icons.facebook_icon} url={facebook} />
    <SocialIcon icon={Icons.instagram_icon} url={instagram} />
    <SocialIcon icon={Icons.internet_icon} url={website} />
  </View>
);

const SocialIcon = ({ icon, url }) => (
  <TouchableOpacity
    style={styles.socialButton}
    onPress={() => Linking.openURL(url || '#')}
  >
    <Image source={icon} style={styles.socialIcon} resizeMode="contain" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: heightToDp(70), width: widthToDp(100), zIndex: 0 },
  bottomSheet: {
    position: 'absolute',
    bottom: widthToDp(2),
    alignItems: 'center',
    width: widthToDp(100),
  },
  cardContainer: {
    width: widthToDp(88),
    backgroundColor: Config.Colors.defaultColor,
    borderRadius: 50,
  },
  body: { marginTop: widthToDp(3), alignItems: 'center' },
  row: {
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    gap: widthToDp(5),
    paddingVertical: widthToDp(3.5),
    paddingHorizontal: widthToDp(6),
    alignItems: 'center',
  },
  rowIcon: { width: widthToDp(6.5), height: heightToDp(4) },
  text1: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    fontSize: widthToDp(3),
    color: Config.Colors.black,
  },
  text2: {
    fontFamily: Config.fontFamilys.Poppins_Light,
    fontSize: widthToDp(2.5),
    color: Config.Colors.black,
  },
  socialButton: {
    justifyContent: 'center',
    backgroundColor: Config.Colors.themeColor,
    padding: widthToDp(2),
    borderRadius: widthToDp(2),
  },
  socialIcon: {
    width: widthToDp(6.5),
    height: heightToDp(4),
    tintColor: Config.Colors.defaultColor,
  },
  errorText: {
    fontSize: widthToDp(3),
    color: Config.Colors.error || 'red',
    marginTop: 10,
  },
});

export default React.memo(ContactUs);
