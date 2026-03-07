import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import * as Icons from '../helpers/Icons';
import * as Config from '../helpers/Config';
import Geolocation from 'react-native-geolocation-service';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  MapViewProps,
  Region,
} from 'react-native-maps';
import { CustomInputBox, CustomLinearButton } from './CustomElements';
import CustomModal from './CustomModal';
import { SvgCalender } from '../helpers/Svg';
import { toLocaleDateString } from '../helpers/utils';

/* ===================== TYPES ===================== */

type LatLng = {
  latitude: number;
  longitude: number;
  locationName?: string;
};

type ViewPointDetails = {
  attend_date?: string;
  label?: string;
  latitude?: number;
  longitude?: number;
};

type CustomMapProps = {
  handleLocation?: (loc: LatLng | LatLng[]) => void;
  defaultlocation?: LatLng | LatLng[];
  filterData?: (date: string) => void;
};

/* ===================== COMPONENT ===================== */

const CustomMap: React.FC<CustomMapProps> = ({
  handleLocation,
  defaultlocation,
  filterData,
}) => {
  const mapRef = useRef<MapView | null>(null);

  const [liveLocation, setLiveLocation] = React.useState<
    LatLng | LatLng[] | undefined
  >(defaultlocation);
  const [locationName, setLocationName] = React.useState<string>('');
  const [radiusValue, setRadiusValue] = React.useState<string>('');
  const [viewPointDetails, setViewPointDetails] =
    React.useState<ViewPointDetails | null>(null);
  const [mapModal, setMapModal] = React.useState<boolean>(false);
  const [dateModal, setDateModal] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  /* ===================== HELPERS ===================== */

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAP_APIKEY}`,
      );
      const data = await response.json();

      if (data?.results?.length > 0) {
        setLocationName(data.results[0].formatted_address);
        setLiveLocation(prev =>
          prev && !Array.isArray(prev)
            ? { ...prev, locationName: data.results[0].formatted_address }
            : prev,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDragable = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLiveLocation({ latitude, longitude });
    await fetchAddress(latitude, longitude);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    setDateModal(false);
    if (date && filterData) {
      filterData(toLocaleDateString(date).customDate);
      setSelectedDate(date);
    }
  };

  const handleViewData = (item: ViewPointDetails) => {
    setViewPointDetails(item);
    setMapModal(true);
  };

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    if (!defaultlocation) {
      Geolocation.getCurrentPosition(position => {
        setLiveLocation(position.coords);
      });
    }
  }, [defaultlocation]);

  /* ===================== RENDER HELPERS ===================== */

  const renderMarker = (data: ViewPointDetails, index: number) => {
    if (!data?.latitude || !data?.longitude) return null;

    return (
      <Marker
        key={index}
        draggable
        coordinate={{
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
        }}
        pinColor={Config.Colors.themeColor}
        onDragEnd={onDragable}
        onPress={() => handleViewData(data)}
      />
    );
  };

  const region: Region | undefined =
    liveLocation && !Array.isArray(liveLocation)
      ? {
          latitude: liveLocation.latitude,
          longitude: liveLocation.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }
      : undefined;

  /* ===================== JSX ===================== */

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: widthToDp(90),
          marginTop: 10,
          paddingBottom: 10,
          backgroundColor: Config.Colors.defaultColor,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <View style={{ padding: 10 }}>
          <Text style={{ color: Config.Colors.black }}>
            {locationName}
          </Text>

          {filterData && (
            <TouchableOpacity onPress={() => setDateModal(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <SvgCalender
                  width={widthToDp(6)}
                  height={heightToDp(2.5)}
                />
                <Text style={{ color: Config.Colors.black }}>
                  {toLocaleDateString(selectedDate).day_name},{' '}
                  {toLocaleDateString(selectedDate).month_name.slice(0, 3)}{' '}
                  {toLocaleDateString(selectedDate).day}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation
        >
          {liveLocation && !Array.isArray(liveLocation) && (
            <>
              <Circle
                center={liveLocation}
                radius={Number(radiusValue) || 0}
                strokeWidth={2}
                strokeColor="#3399ff"
                fillColor="#80bfff"
              />
              <Marker
                draggable
                coordinate={liveLocation}
                pinColor={Config.Colors.themeColor}
                onDragEnd={onDragable}
              />
            </>
          )}

          {Array.isArray(liveLocation) &&
            liveLocation.map(renderMarker)}
        </MapView>
      </View>

      {mapModal && (
        <CustomModal
          modalVisible={mapModal}
          onRequestClose={() => setMapModal(false)}
          disableOnPress
          animationType="slide"
        >
          <View
            style={{
              width: widthToDp(90),
              backgroundColor: Config.Colors.bodyBg,
              borderRadius: 6,
              padding: widthToDp(5),
            }}
          >
            <Text>{viewPointDetails?.attend_date}</Text>
            <Text>{viewPointDetails?.label}</Text>
          </View>
        </CustomModal>
      )}

      {dateModal && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  map: {
    height: heightToDp(80),
    width: widthToDp(90),
    borderRadius: 10,
  },
});

export default CustomMap;
