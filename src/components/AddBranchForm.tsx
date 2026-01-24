import React, { memo, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, PermissionsAndroid } from "react-native";
import { heightToDp, widthToDp } from "../helpers/Responsive";
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';
import { Header_2 } from "../components/Header";
import { useTranslation } from "react-i18next";
import { CustomInput, CustomLinearButton } from "../components/CustomElements";
import Geolocation from 'react-native-geolocation-service';
import MiniMap from "./MiniMap";
import AltertBox from "./AltertBox";
export const AddBranchForm = memo(({ handleModal, editInputs }) => {
    let initialInput = { branchName: "", radius: "", location: null }
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState(null)
    const [openMapModal, setOpenMapModal] = useState(false)
    const [formInputs, setFormInputs] = useState(initialInput);
    const [liveLocation, setLiveLocation] = React.useState(null);
    useEffect(() => {
        setFormInputs(editInputs ?? initialInput)
    }, [])
    const onSubmit = async () => {
        if (formInputs.branchName === '' && formInputs.radius === '' && formInputs.location === null) {
            setErrorMessage((prv) => ({ ...prv, branchName: t(Config.otherText?.required) }))
            setErrorMessage((prv) => ({ ...prv, radius: t(Config.otherText?.required) }))
            setErrorMessage((prv) => ({ ...prv, location: t(Config.otherText?.required) }))
        } else if (formInputs.radius === '') {
            setErrorMessage((prv) => ({ ...prv, radius: t(Config.otherText?.required) }))
        }
        else if (formInputs.location == null) {
            setErrorMessage((prv) => ({ ...prv, location: t(Config.otherText?.required) }))
        }
        else if (formInputs.branchName === '') {
            setErrorMessage((prv) => ({ ...prv, branchName: t(Config.otherText?.required) }))
        }
        else {
            let bodyData = {};
            let apiData;
            if (formInputs?.id) {
                bodyData = {
                    location: {
                        latitude: formInputs?.location?.latitude,
                        longitude: formInputs?.location?.longitude,
                        name: formInputs?.location?.locationName
                    },
                    branchName: formInputs.branchName,
                    radius: formInputs.radius,
                    branch_id: formInputs.id
                }
                apiData = await apiPostService(Constants?.update_branch_api, bodyData);
            } else {

                bodyData = {
                    location: {
                        latitude: formInputs?.location?.latitude,
                        longitude: formInputs?.location?.longitude,
                        name: formInputs?.location?.locationName
                    },
                    branchName: formInputs.branchName,
                    radius: formInputs.radius
                }

                apiData = await apiPostService(Constants?.add_branch_api, bodyData);
            }

            if (apiData?.data?.status == "success") {
                getBranchData();
                handleModal(false);
                setAlertdata({
                    statusText: apiData?.data?.message,
                    time: "",
                    confirm: () => handleModal(false),
                    cancel: () => handleModal(false),
                });

            } else {
                console.log("Not Found")
            }
        }
    }
    const handleOnChange = (name, value) => {
        setFormInputs((prv) => ({ ...prv, [name]: value }))
        setErrorMessage(null)
    }
    const handleLocation = (location, radius) => {

        setOpenMapModal(!openMapModal)
        setFormInputs((prv) => ({ ...prv, radius: radius, location: location }))
        setErrorMessage(null)
    }
    const handleBack = () => {
        handleModal(false);
        setErrorMessage(null)
    }

    const getCurrentLocation = event => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                        PermissionsAndroid.PERMISSIONS.INTERNET,
                        {
                            title: t(Config.branchesText?.location_permission),
                            message: t(Config.branchesText?.permission_message),
                            buttonPositive: t(Config.branchesText?.ok),
                            buttonNegative: t(Config.branchesText?.cancel),
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
    useEffect(() => { getCurrentLocation }, [])
    return (
        <>
            <ScrollView style={{
                width: widthToDp(100),
                height: heightToDp(100),
                backgroundColor: Config.Colors.bodyBg,
                borderRadius: widthToDp(2),
                paddingBottom: widthToDp(10),

            }}>
                <View style={{ alignItems: 'center' }}>

                    <Header_2
                        leftImage={Icons.arrow_back}
                        commonWidth={widthToDp(12)}
                        commonHeight={heightToDp(5)}
                        leftText={t(Config.branchesText?.add_branch)}
                        animated={true}
                        onPressLeft={handleBack}
                    />
                    <View style={{
                        width: widthToDp(90),
                        // height: widthToDp(75),
                        marginTop: 10,
                        // backgroundColor: Config.Colors.defaultColor,
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingBottom: 60
                    }}>
                        <View style={{ padding: 10, alignSelf: 'flex-start' }}>
                            <Text
                                style={{
                                    color: Config.Colors.black,
                                    fontSize: widthToDp(4.5)
                                }}>{t(Config.branchesText?.branch_info)}</Text>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'column', gap: 20 }}>
                            <CustomInput backgroundColor={Config.Colors.defaultColor} placeholder={t(Config.branchesText?.branch_name)} keyboardType={'default'} autoCapitalize={'none'} autoComplete={'given-name'} bgColor={Config.Colors.inputField} countryCodeStatus={true} onChangeText={(text) => handleOnChange("branchName", text)} value={formInputs?.branchName} commonWidth={widthToDp(90)} commonHeight={widthToDp(15)} textAlignVertical="center" leftImage={Icons?.branch_icon} errorMessage={errorMessage?.locationName ? errorMessage?.branchName : ''} borderColor={errorMessage?.branchName ? Config.Colors.errorFieldBorder : Config.Colors.borderColor} onSubmitEditing={(e) => console.log("e", e)}
                            />
                            <TouchableOpacity onPress={() => handleLocation()}>
                                <CustomInput backgroundColor={Config.Colors.defaultColor} placeholder={t(Config.branchesText?.branch_location)} keyboardType={'default'} autoCapitalize={'none'}
                                    autoComplete={'given-name'}
                                    bgColor={Config.Colors.inputField}
                                    countryCodeStatus={true}
                                    onChangeText={(text) => handleOnChange("location", text)}
                                    value={formInputs?.location?.locationName}
                                    editable={false}
                                    commonWidth={widthToDp(90)}
                                    commonHeight={widthToDp(15)}
                                    textAlignVertical="center"
                                    numberOfLines={10}
                                    multiline={true}
                                    leftImage={Icons?.location_icon}
                                    errorMessage={errorMessage?.location ? errorMessage?.location : ''}
                                    borderColor={errorMessage?.location ? Config.Colors.errorFieldBorder : Config.Colors.borderColor}
                                    onSubmitEditing={(e) => console.log("e", e)}
                                />

                            </TouchableOpacity>
                            <CustomInput backgroundColor={Config.Colors.defaultColor} placeholder={t(Config.branchesText?.radius)} keyboardType={'default'} autoCapitalize={'none'} autoComplete={'given-name'} bgColor={Config.Colors.inputField} countryCodeStatus={true} onChangeText={(text) => handleOnChange("radius", text)} value={formInputs?.radius} commonWidth={widthToDp(90)} commonHeight={widthToDp(15)} textAlignVertical="center" numberOfLines={10} multiline={true} leftImage={Icons?.branch_icon} errorMessage={errorMessage?.radius ? errorMessage?.radius : ''} borderColor={errorMessage?.radius ? Config.Colors.errorFieldBorder : Config.Colors.borderColor} onSubmitEditing={(e) => console.log("e", e)}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <CustomLinearButton
                                    commonWidth={widthToDp(40)}
                                    text={t(Config.otherText?.submit)}
                                    onPress={onSubmit}
                                    color={Config.Colors.defaultColor}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {openMapModal ?
                <CustomModal modalVisible={openMapModal} onRequestClose={() => setOpenMapModal(!openMapModal)} alignItems='center' justifyContent='center' disableOnPress={false} showHeader={true} animationType="slide">
                    <ScrollView style={{ width: widthToDp(100), height: heightToDp(100), backgroundColor: Config.Colors.bodyBg, borderRadius: widthToDp(2), paddingBottom: widthToDp(10), }}>
                        <MiniMap handleLocation={handleLocation} onSubmitBtn={getLocationRadius} defaultlocation={liveLocation} />
                    </ScrollView>
                </CustomModal>
                : null}
        </>
    )
})
