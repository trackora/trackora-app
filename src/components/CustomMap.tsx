import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef } from 'react'
import * as Icons from '../helpers/Icons';
import * as Config from '../helpers/Config';
import * as Constants from '../helpers/Constants';
import { Header_2 } from './Header';
import Geolocation from 'react-native-geolocation-service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightToDp, widthToDp } from '../helpers/Responsive';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { CustomInputBox, CustomLinearButton } from './CustomElements';
import LoadingSpinner from '../animated/LoadingSpinner';
import CustomModal from './CustomModal';
import { SvgCalender } from '../helpers/Svg';
import { toLocaleDateString } from '../helpers/utils';

const CustomMap = ({ handleLocation, defaultlocation, filterData }) => {
    const mapRef = useRef(null);
    const [liveLocation, setLiveLocation] = React.useState(defaultlocation);
    const [mapLoading, setMapLoading] = React.useState(false);
    const [locationName, setLocationName] = React.useState('')
    const [radiusValue, setRadiusValue] = React.useState('');
    const [viewPointDetails, setViewPointDetails] = React.useState(null);
    const [mapModal, setMapModal] = React.useState(false);
    const [dateModal, setDateModal] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState(new Date())
    const onDragable = async (event) => {
        setLiveLocation({
            latitude: event?.nativeEvent?.coordinate?.latitude,
            longitude: event?.nativeEvent?.coordinate?.longitude
        })
        await fetchAddress(event?.nativeEvent?.coordinate?.latitude, event?.nativeEvent?.coordinate?.longitude)
    }
    const onRegionChangeComplete = (position) => {
        setLiveLocation(position);
    }
    const handleDateChange = (event, selectedDate) => {
        setDateModal(false)
        if (selectedDate) {
            filterData(toLocaleDateString(selectedDate).customDate)
            setSelectedDate(selectedDate);
        }
    }
    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAP_APIKEY}`);
            const data = await response.json();
            if (data?.results.length > 0) {
                setLiveLocation((prv) => ({ ...prv, locationName: data?.results[0].formatted_address }))
                setLocationName(data?.results[0].formatted_address)
            }
        } catch (error) {
            console.error(error);
        }
    };
    const mapRefrace = () => {
        setMapLoading(true)
        getCurrentLocation();
    }

    const handleViewData = (item) => {
        setMapModal(true)
        setViewPointDetails(item)
    }
    useEffect(() => {
        Geolocation.getCurrentPosition((event) => {
            if (defaultlocation === undefined) {
                console.log(event)
                setLiveLocation(event?.coords)
            }
        })
    }, [defaultlocation])
    console.log("defaultlocation", defaultlocation)
    const renderMarker = (data, index) => {
        if (data?.latitude) {
            return (
                <Marker
                    key={index}
                    draggable
                    coordinate={{
                        accuracy: 20,
                        altitude: 174.5,
                        altitudeAccuracy: 1.258298635482788,
                        heading: 0,
                        latitude: Number(data?.latitude),
                        longitude: Number(data?.longitude),
                        speed: 0,
                    }}
                    description={`Latitude: ${data?.latitude}, Longitude: ${data?.longitude}`}
                    pinColor={Config.Colors.themeColor}
                    onDragEnd={(e) => onDragable(e)}
                    onPress={() => handleViewData(data)}
                />
            )
        }
    }
    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ width: widthToDp(90), marginTop: 10, paddingBottom: 10, backgroundColor: Config.Colors.defaultColor, borderRadius: 10, alignItems: 'center' }}>
                <View style={{ padding: 10, alignSelf: 'center' }}>
                    <Text
                        style={{ color: Config.Colors.black, fontSize: widthToDp(3) }}>{liveLocation?.locationName}</Text>
                    {filterData ?
                        <TouchableOpacity onPress={() => setDateModal(true)}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <SvgCalender source={Icons.calendar_icon} style={{ width: widthToDp(6), height: heightToDp(2.5), tintColor: Config.Colors.themeColor }} />
                                <Text style={{ fontSize: widthToDp(3.5), color: Config.Colors.black }}>{toLocaleDateString(selectedDate).day_name}, {(toLocaleDateString(selectedDate).month_name).slice(0, 3)} {toLocaleDateString(selectedDate).day}</Text>
                            </View>
                        </TouchableOpacity>
                        : null}
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'column', gap: 20 }}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={liveLocation ? !Array.isArray(liveLocation) ?
                            {
                                ...liveLocation,
                                latitudeDelta: 0.009,
                                longitudeDelta: 0.009,
                            }
                            : {
                                accuracy: 20,
                                altitude: 174.5,
                                altitudeAccuracy: 1.258298635482788,
                                heading: 0,
                                latitude: Number(liveLocation[0]?.latitude),
                                longitude: Number(liveLocation[0]?.longitude),
                                speed: 0,
                                latitudeDelta: 0.009,
                                longitudeDelta: 0.009,
                            } : undefined
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
                        {liveLocation ?
                            <>
                                {!Array.isArray(liveLocation) ?
                                    <Circle
                                        center={{
                                            latitude: liveLocation?.latitude,
                                            longitude: liveLocation?.longitude,
                                            latitudeDelta: 0.000,
                                            longitudeDelta: 0.000,
                                        }}
                                        radius={Number(radiusValue)}
                                        strokeWidth={2}
                                        strokeColor="#3399ff"
                                        fillColor="#80bfff"
                                    />
                                    : null}
                                {!Array.isArray(liveLocation) ?
                                    <Marker key={1} draggable coordinate={liveLocation} description={`Latitude: ${liveLocation?.latitude}, Longitude: ${liveLocation?.longitude}`} pinColor={Config.Colors.themeColor} onDragEnd={(e) => onDragable(e)} />
                                    : null}
                                {Array.isArray(liveLocation) ?
                                    liveLocation?.map(renderMarker)
                                    : null}
                            </>
                            : null}
                    </MapView>
                </View>
            </View>
            {mapModal ?
                <CustomModal
                    modalVisible={mapModal}
                    onRequestClose={() => setMapModal(!mapModal)}
                    alignItems='center'
                    justifyContent='center'
                    disableOnPress={true}
                    showHeader={true}
                    animationType="slide"
                >
                    <View style={{width: widthToDp(90),backgroundColor: Config.Colors.bodyBg,borderRadius: 6,paddingTop: widthToDp(5),paddingBottom: widthToDp(5)}}>
                        {/* <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}> */}
                        <View style={{ backgroundColor: Config.Colors.bodyBg, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_2 }}>Date</Text>
                            <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_1 }}>{viewPointDetails?.attend_date}</Text>
                        </View>
                        <View style={{ backgroundColor: Config.Colors.bodyBg, padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_2 }}>Address</Text>
                            <Text style={{ fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.textColor.textColor_1, textAlign: 'justify' }}>{viewPointDetails?.label}</Text>
                        </View>
                    </View>
                    {/* </KeyboardAvoidingView> */}
                </CustomModal>
                : null}

            {dateModal ? (
                <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} negativeButton={{ label: 'Cancel', textColor: Config.Colors.errorText, }}positiveButton={{ label: 'Confirm', textColor: Config.Colors.themeColor, }}/>
            ) : null}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center',
        alignItems: 'center',
        backgroundColor: Config.Colors.defaultColor
    },
    map: {
        // flex:1,
        height: heightToDp(80),
        width: widthToDp(90),
        zIndex: 0,
        borderRadius: 100
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
        justifyContent: "center",
        alignItems: 'center'
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
        marginBottom: 10
    }
});
export default CustomMap