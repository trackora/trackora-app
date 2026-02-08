import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import * as Icons from '../helpers/Icons';
import * as Config from '../helpers/Config';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { CustomInput, CustomLinearButton } from './CustomElements';
import LoadingSpinner from '../animated/LoadingSpinner';
import { Header_2 } from './Header';
import Geolocation from 'react-native-geolocation-service';
 
const CustomInputAny = CustomInput as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;
 
type BranchLocation = {
  latitude: number;
  longitude: number;
  locationName?: string;
};
 
type ErrorState = {
  locationName?: string;
  radiusValue?: string;
};
 
type MiniMapProps = {
  handleLocation: (location?: BranchLocation | null, radius?: string) => void;
  onSubmitBtn?: (location?: BranchLocation | null, radius?: string) => void;
  defaultlocation?: BranchLocation | null;
};
 
const MiniMap: React.FC<MiniMapProps> = ({ handleLocation, onSubmitBtn, defaultlocation }) => {
  const mapRef = useRef<MapView | null>(null);
  const [liveLocation, setLiveLocation] =
    React.useState<BranchLocation | null>(null);
  const [mapLoading, setMapLoading] = React.useState(false);
  const [locationName, setLocationName] = React.useState('');
  const [radiusValue, setRadiusValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<ErrorState>({});
 
  const getCurrentLocation = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.INTERNET,
          ]);
          return Object.values(granted).every(
            status => status === PermissionsAndroid.RESULTS.GRANTED,
          );
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return false;
        }
      } else {
        try {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          return auth === 'granted';
        } catch (error) {
          console.error('Error requesting location permission:', error);
          return false;
        }
      }
    };
 
    requestLocationPermission().then(hasLocationPermission => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          async position => {
            mapRef?.current?.animateToRegion({
              latitude: position?.coords.latitude,
              longitude: position?.coords.longitude,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
            });
            setTimeout(() => {
              setLiveLocation(position?.coords);
              setMapLoading(false);
            }, 5000);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
  };
 
  useFocusEffect(
    React.useCallback(() => {
      getCurrentLocation();
    }, []),
  );
 
  const handleAddLocation = (
    location: BranchLocation | null,
    radius: string,
  ) => {
    if (locationName === '' && radius === '') {
      setErrorMessage(prev => ({
        ...prev,
        locationName: 'Required',
        radiusValue: 'Required',
      }));
    } else if (!locationName) {
      setErrorMessage(prev => ({ ...prev, locationName: 'Required' }));
    } else if (!radius) {
      setErrorMessage(prev => ({ ...prev, radiusValue: 'Required' }));
    } else {
      handleLocation(location, radius);
    }
  };
 
  const onDragable = async (event: any) => {
    setLiveLocation({
      latitude: event?.nativeEvent?.coordinate?.latitude,
      longitude: event?.nativeEvent?.coordinate?.longitude,
    });
    await fetchAddress(
      event?.nativeEvent?.coordinate?.latitude,
      event?.nativeEvent?.coordinate?.longitude,
    );
  };
 
  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAP_APIKEY}`,
      );
      const data = await response.json();
      if (data?.results?.length > 0) {
        setLiveLocation(prev => ({
          ...(prev ?? { latitude, longitude }),
          locationName: data?.results[0].formatted_address,
        }));
        setLocationName(data?.results[0].formatted_address);
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  const mapRefrace = () => {
    setMapLoading(true);
    getCurrentLocation();
  };
 
  return (
    <View style={{ alignItems: 'center' }}>
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={widthToDp(10)}
        leftText="Add Branch"
        animated={true}
        onPressLeft={() => handleLocation()}
        onPressRight={mapRefrace}
        svg={true}
        rightImage={
          <LoadingSpinner
            commonWidth={widthToDp(15)}
            commonHeigth={widthToDp(7)}
            isLoading={mapLoading}
          />
        }
      />
      <View
        style={{
          width: widthToDp(90),
          marginTop: 10,
          paddingBottom: 10,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <View style={{ padding: 10, alignSelf: 'flex-start' }}>
          <Text
            style={{
              color: Config.Colors.black,
              fontSize: widthToDp(3),
            }}
          >
            Tell us Your company address set your GeoFence radius
          </Text>
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'column', gap: 20 }}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={[styles.map]}
            region={
              liveLocation
                ? {
                    latitude: liveLocation.latitude,
                    longitude: liveLocation.longitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009,
                  }
                : undefined
            }
            loadingEnabled
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={true}
            showsCompass={true}
            pitchEnabled={true}
            scrollDuringRotateOrZoomEnabled={true}
            zoomControlEnabled={false}
            showsIndoors={true}
          >
            {liveLocation ? (
              <Circle
                center={{
                  latitude: liveLocation?.latitude,
                  longitude: liveLocation.longitude,
                }}
                radius={Number(radiusValue)}
                strokeWidth={2}
                strokeColor="#3399ff"
                fillColor="#80bfff"
              />
            ) : null}
            {liveLocation ? (
              <Marker
                key={1}
                draggable
                coordinate={{
                  latitude: liveLocation.latitude,
                  longitude: liveLocation.longitude,
                }}
                description={`Latitude: ${liveLocation?.latitude}, Longitude: ${liveLocation.longitude}`}
                pinColor={Config.Colors.themeColor}
                onDragEnd={onDragable}
              />
            ) : null}
          </MapView>
 
          <View style={{ flexDirection: 'column', gap: 20 }}>
            <CustomInputAny
              backgroundColor={Config.Colors.defaultColor}
              placeholder="Branch Location"
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="given-name"
              bgColor={Config.Colors.inputField}
              value={locationName}
              countryCodeStatus={true}
              onChangeText={(text: string) => {
                setLocationName(text);
                setErrorMessage({});
              }}
              commonWidth={widthToDp(90)}
              commonHeight={widthToDp(15)}
              textAlignVertical="center"
              leftImage={Icons?.branch_icon}
              multiline={true}
              numberOfLines={10}
              errorMessage={errorMessage?.locationName ?? ''}
              borderColor={
                errorMessage?.locationName
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.borderColor
              }
              lable=""
              countryCode=""
            />
            <CustomInputAny
              backgroundColor={Config.Colors.defaultColor}
              placeholder="Radius"
              keyboardType="number-pad"
              autoCapitalize="none"
              autoComplete="given-name"
              bgColor={Config.Colors.inputField}
              countryCodeStatus={true}
              value={radiusValue}
              onChangeText={(text: string) => {
                setRadiusValue(text);
                setErrorMessage({});
              }}
              commonWidth={widthToDp(90)}
              commonHeight={widthToDp(15)}
              textAlignVertical="center"
              leftImage={Icons?.branch_icon}
              multiline={true}
              numberOfLines={10}
              errorMessage={errorMessage?.radiusValue ?? ''}
              borderColor={
                errorMessage?.radiusValue
                  ? Config.Colors.errorFieldBorder
                  : Config.Colors.borderColor
              }
              lable=""
              countryCode=""
            />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <CustomLinearButtonAny
                commonWidth={widthToDp(40)}
                text="Add Location"
                onPress={() => handleAddLocation(liveLocation, radiusValue)}
                color={Config.Colors.defaultColor}
                Icons={null}
                tintColor={Config.Colors.defaultColor}
                IconsRigth={null}
                padding={0}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Config.Colors.defaultColor,
  },
  map: {
    height: widthToDp(85),
    width: widthToDp(90),
    zIndex: 0,
    borderRadius: 100,
  },
  punchContainer: {
    width: widthToDp(50),
    position: 'absolute',
    bottom: widthToDp(1),
  },
  linearGradient: {
    width: widthToDp(50),
    backgroundColor: '#000',
    height: heightToDp(25),
    borderRadius: widthToDp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: widthToDp(4),
    fontFamily: 'Poppins',
    margin: widthToDp(1),
    color: '#ffffff',
  },
  btnImage: {
    resizeMode: 'contain',
    width: widthToDp(20),
    marginBottom: 10,
  },
});
 
export default MiniMap;