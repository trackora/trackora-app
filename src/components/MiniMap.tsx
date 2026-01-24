import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Platform, PermissionsAndroid } from 'react-native'
import React, { useRef } from 'react'
import * as Icons from '../helpers/Icons';
import * as Config from '../helpers/Config';
import * as Constants from '../helpers/Constants';
import { Header_2 } from './Header';
import Geolocation from 'react-native-geolocation-service';

import { heightToDp, widthToDp } from '../helpers/Responsive';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { CustomInput, CustomInputBox, CustomLinearButton } from './CustomElements';
import LoadingSpinner from '../animated/LoadingSpinner';

const MiniMap = ({ handleLocation }) => {
    const mapRef = useRef(null);
    const [liveLocation, setLiveLocation] = React.useState(null);
    const [mapLoading, setMapLoading] = React.useState(false);
    const [locationName, setLocationName] = React.useState('')
    const [radiusValue, setRadiusValue] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState(null)
    const getCurrentLocation = event => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                        PermissionsAndroid.PERMISSIONS.INTERNET,
                        {
                            title: 'Location Permission',
                            message: 'This app requires access to your location.',
                            buttonPositive: 'OK',
                            buttonNegative: 'Cancel',
                        },
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } catch (error) {
                    console.error('Error requesting location permission:', error);
                    return false;
                }
            } else {
                try {

                    const auth = await Geolocation.requestAuthorization('whenInUse');
                    if (auth === 'granted') {
                        return auth;
                    }
                } catch (error) {
                    console.error('Error requesting location permission:', error);
                    return false;
                }
            }
        };

        // Usage example
        requestLocationPermission().then(hasLocationPermission => {
            if (hasLocationPermission) {
                Geolocation.getCurrentPosition(
                    async position => {
                        mapRef?.current?.animateToRegion({
                            latitude: position?.coords.latitude,
                            longitude: position?.coords.longitude,
                            latitudeDelta: 0.000,
                            longitudeDelta: 0.000,
                        });
                        setTimeout(() => {
                            setLiveLocation(position?.coords);
                            setMapLoading(false)
                        }, 5000);
                    },
                    error => {
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
                // }
            } else {
                // Location permission is denied
                // Handle accordingly
            }
        });
    };
    // React.useEffect(()=>{
    //     getCurrentLocation();
    // },[])
    useFocusEffect(
        React.useCallback(() => {
            getCurrentLocation();
        }, [])
    );
    const handleAddLocation = (liveLocation, radiusValue) => {
        if (locationName == '' && radiusValue === '') {
            setErrorMessage((prv) => ({ ...prv, locationName: 'Required' }))
            setErrorMessage((prv) => ({ ...prv, radiusValue: 'Required' }))
        } else if (locationName === null) {
            setErrorMessage((prv) => ({ ...prv, locationName: 'Required' }))
        }
        else if (radiusValue == '') {
            setErrorMessage((prv) => ({ ...prv, radiusValue: 'Required' }))
        } else {
            handleLocation(liveLocation, radiusValue)
        }
    }
    const onDragable = async (event) => {
        Geolocation.getCurrentPosition
        setLiveLocation({
            latitude: event?.nativeEvent?.coordinate?.latitude,
            longitude: event?.nativeEvent?.coordinate?.longitude
        })
        await fetchAddress(event?.nativeEvent?.coordinate?.latitude, event?.nativeEvent?.coordinate?.longitude)
    }
    const onRegionChangeComplete = (position) => {
        setLiveLocation(position);
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
    return (
        <View style={{ alignItems: 'center' }}>
            <Header_2
                leftImage={Icons.arrow_back}
                commonWidth={widthToDp(12)}
                commonHeight={widthToDp(10)}
                leftText={"Add Branch"}
                animated={true}
                onPressLeft={() => handleLocation()}
                onPressRight={() => mapRefrace()}
                svg={true}
                rightImage={<LoadingSpinner commonWidth={widthToDp(15)} commonHeigth={widthToDp(7)} isLoading={mapLoading} />}
            />
            <View style={{
                width: widthToDp(90),
                marginTop: 10,
                paddingBottom: 10,
                // backgroundColor: Config.Colors.defaultColor,
                borderRadius: 10,
                alignItems: 'center'
            }}>
                <View style={{ padding: 10, alignSelf: 'flex-start' }}>
                    <Text
                        style={{
                            color: Config.Colors.black,
                            fontSize: widthToDp(3)
                        }}>Tell us Your company address set your GeoFence radius</Text>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'column', gap: 20 }}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={[styles.map]}
                        region={liveLocation ?
                            {
                                ...liveLocation,
                                latitudeDelta: 0.009,
                                longitudeDelta: 0.009,
                            }
                            : null
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
                    // onRegionChangeComplete={onRegionChangeComplete}
                    >
                        {liveLocation ?
                            <Circle
                                center={{
                                    latitude: liveLocation?.latitude,
                                    longitude: liveLocation.longitude,
                                    latitudeDelta: 0.000,
                                    longitudeDelta: 0.000,
                                }}
                                radius={Number(radiusValue)}
                                strokeWidth={2}
                                strokeColor="#3399ff"
                                fillColor="#80bfff"
                            />
                            : null}
                        {liveLocation ?
                            <Marker
                                key={1}
                                draggable
                                coordinate={liveLocation}
                                description={`Latitude: ${liveLocation?.latitude}, Longitude: ${liveLocation.longitude}`}
                                pinColor={Config.Colors.themeColor}
                                onDragEnd={(e) => onDragable(e)}
                            />
                            : null}
                    </MapView>
                    <View style={{ flexDirection: 'column', gap: 20 }}>
                    <CustomInput
                            backgroundColor={Config.Colors.defaultColor}
                            placeholder={'Branch Location'}
                            keyboardType={'default'}
                            autoCapitalize={'none'}
                            autoComplete={'given-name'}
                            bgColor={Config.Colors.inputField}
                            value={locationName}
                            countryCodeStatus={true}
                            onChangeText={(text) => {
                                setLocationName(text);
                                setErrorMessage(null);
                            }}
                            //   value={empformInputs?.empName}
                            commonWidth={widthToDp(90)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            leftImage={Icons?.branch_icon}
                            multiline={true}
                            numberOfLines={10}
                            errorMessage={errorMessage?.locationName ? errorMessage?.locationName : ''}
                            borderColor={errorMessage?.locationName ? Config.Colors.errorFieldBorder : Config.Colors.borderColor}
                        />
                        <CustomInput
                            backgroundColor={Config.Colors.defaultColor}
                            placeholder={'Radius'}
                            keyboardType={'number-pad'}
                            autoCapitalize={'none'}
                            autoComplete={'given-name'}
                            bgColor={Config.Colors.inputField}
                            countryCodeStatus={true}
                            value={radiusValue}
                            onChangeText={(text) => {
                                setRadiusValue(text);
                                setErrorMessage(null);
                            }}
                            //   value={empformInputs?.empName}
                            commonWidth={widthToDp(90)}
                            commonHeight={widthToDp(15)}
                            textAlignVertical="center"
                            leftImage={Icons?.branch_icon}
                            multiline={true}
                            numberOfLines={10}
                            errorMessage={errorMessage?.radiusValue ? errorMessage?.radiusValue : ''}
                            borderColor={errorMessage?.radiusValue ? Config.Colors.errorFieldBorder : Config.Colors.borderColor}
                        />



                        {/* <CustomInputBox
                            commonWidth={widthToDp(80)}
                            commonHeight={widthToDp(15)}
                            onChangeText={(text) => {
                                setLocationName(text);
                                setErrorMessage(null);
                            }}
                            inputValue={locationName}
                            placeholder={'Branch Location'}
                            keyboardType={'default'}
                            autoCapitalize={'none'}
                            autoComplete={'given-name'}
                            leftImage={Icons?.location_icon}
                            tintColor={"#ed6d74"}
                            multiline={true}
                            numberOfLines={10}
                            errorMessage={errorMessage?.locationName ? errorMessage?.locationName: ''}
                            borderColor={errorMessage?.locationName ? Config.Colors.errorFieldBorder : Config.Colors.borderColor}
                        />
                        <CustomInputBox
                            commonWidth={widthToDp(80)}
                            commonHeight={widthToDp(10)}
                            onChangeText={(text) => {
                                setRadiusValue(text);
                                setErrorMessage(null);
                            }}
                            inputValue={radiusValue}
                            placeholder={'Radius'}
                            keyboardType={'number-pad'}
                            autoCapitalize={'none'}
                            autoComplete={'given-name'}
                            leftImage={Icons?.branch_icon}
                            tintColor={"#ed6d74"}
                            errorMessage={errorMessage?.radiusValue ? errorMessage?.radiusValue: ''}
                            borderColor={errorMessage?.radiusValue ? Config.Colors.errorFieldBorder : Config.Colors.borderColor}
                        /> */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <CustomLinearButton
                                commonWidth={widthToDp(40)}
                                text={"Add Location"}
                                onPress={() => handleAddLocation(liveLocation, radiusValue)}
                                color={Config.Colors.defaultColor}
                            />
                        </View>
                    </View>
                </View>
            </View>
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
        height: widthToDp(85),
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
export default MiniMap