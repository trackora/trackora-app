import React, { memo, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { heightToDp, widthToDp } from "../helpers/Responsive";
import * as Config from "../helpers/Config";
import * as Icons from "../helpers/Icons";
import { Header_2 } from "../components/Header";
import { useTranslation } from "react-i18next";
import {
  CustomInputBox,
  CustomLinearButton,
} from "../components/CustomElements";
import Geolocation from "react-native-geolocation-service";
import MiniMap from "./MiniMap";
import CustomModal from "./CustomModal";
import { apiPostService } from "../helpers/services";
import * as Constants from "../helpers/Constants";

const CustomInputAny = CustomInputBox as React.ComponentType<any>;
const CustomLinearButtonAny = CustomLinearButton as React.ComponentType<any>;

type BranchLocation = {
  latitude: number;
  longitude: number;
  locationName?: string;
};

type FormInputs = {
  branchName: string;
  radius: string;
  location: BranchLocation | null;
  id?: number | string;
};

type ErrorState = {
  branchName?: string;
  radius?: string;
  location?: string;
};

type AlertData = {
  statusText: string;
  time: string;
  confirm: () => void;
  cancel: () => void;
};

type AddBranchFormProps = {
  handleModal: (open: boolean) => void;
  editInputs?: Partial<FormInputs>;
  getBranchData?: () => void;
};

export const AddBranchForm = memo(
  ({ handleModal, editInputs, getBranchData }: AddBranchFormProps) => {
    const initialInput: FormInputs = {
      branchName: "",
      radius: "",
      location: null,
    };
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<ErrorState>({});
    const [openMapModal, setOpenMapModal] = useState(false);
    const [formInputs, setFormInputs] = useState<FormInputs>(initialInput);
    const [liveLocation, setLiveLocation] = useState<BranchLocation | null>(
      null,
    );
    const [mapLoading, setMapLoading] = useState(false);
    const mapRef = useRef<any>(null);
    const [alertdata, setAlertdata] = useState<AlertData | null>(null);

    useEffect(() => {
      setFormInputs({ ...initialInput, ...(editInputs ?? {}) });
    }, [editInputs]);

    const onSubmit = async () => {
      if (
        formInputs.branchName === "" &&
        formInputs.radius === "" &&
        formInputs.location === null
      ) {
        setErrorMessage((prev) => ({
          ...prev,
          branchName: t(Config.otherText?.required),
          radius: t(Config.otherText?.required),
          location: t(Config.otherText?.required),
        }));
      } else if (formInputs.radius === "") {
        setErrorMessage((prev) => ({
          ...prev,
          radius: t(Config.otherText?.required),
        }));
      } else if (formInputs.location == null) {
        setErrorMessage((prev) => ({
          ...prev,
          location: t(Config.otherText?.required),
        }));
      } else if (formInputs.branchName === "") {
        setErrorMessage((prev) => ({
          ...prev,
          branchName: t(Config.otherText?.required),
        }));
      } else {
        let apiData;
        const bodyData = {
          location: {
            latitude: formInputs?.location?.latitude,
            longitude: formInputs?.location?.longitude,
            name: formInputs?.location?.locationName,
          },
          branchName: formInputs.branchName,
          radius: formInputs.radius,
          ...(formInputs?.id ? { branch_id: formInputs.id } : {}),
        };

        if (formInputs?.id) {
          apiData = await apiPostService(
            Constants?.update_branch_api,
            bodyData,
          );
        } else {
          apiData = await apiPostService(Constants?.add_branch_api, bodyData);
        }

        if (apiData?.data?.status === "success") {
          getBranchData?.();
          handleModal(false);
          setAlertdata({
            statusText: apiData?.data?.message,
            time: "",
            confirm: () => handleModal(false),
            cancel: () => handleModal(false),
          });
        } else {
          console.log("Not Found");
        }
      }
    };

    const handleOnChange = (name: "branchName" | "radius", value: string) => {
      setFormInputs((prev) => ({ ...prev, [name]: value }));
      setErrorMessage({});
    };

    const handleLocation = (
      location?: BranchLocation | null,
      radius?: string,
    ) => {
      if (!location) {
        setOpenMapModal(true);
        return;
      }
      setOpenMapModal(false);
      setFormInputs((prev) => ({
        ...prev,
        radius: radius ?? prev.radius,
        location,
      }));
      setErrorMessage({});
    };

    const handleBack = () => {
      handleModal(false);
      setErrorMessage({});
    };

    const getCurrentLocation = () => {
      const requestLocationPermission = async () => {
        if (Platform.OS === "android") {
          try {
            const granted = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
              PermissionsAndroid.PERMISSIONS.INTERNET,
            ]);
            return Object.values(granted).every(
              (status) => status === PermissionsAndroid.RESULTS.GRANTED,
            );
          } catch (error) {
            console.error("Error requesting location permission:", error);
            return false;
          }
        } else {
          try {
            const auth = await Geolocation.requestAuthorization("whenInUse");
            return auth === "granted";
          } catch (error) {
            console.error("Error requesting location permission:", error);
            return false;
          }
        }
      };

      requestLocationPermission().then((hasLocationPermission) => {
        if (hasLocationPermission) {
          Geolocation.getCurrentPosition(
            async (position) => {
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

    useEffect(() => {
      getCurrentLocation();
    }, []);

    return (
      <>
        <ScrollView
          style={{
            width: widthToDp(100),
            height: heightToDp(100),
            backgroundColor: Config.Colors.bodyBg,
            borderRadius: widthToDp(2),
            paddingBottom: widthToDp(10),
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Header_2
              leftImage={Icons.arrow_back}
              commonWidth={widthToDp(12)}
              commonHeight={heightToDp(5)}
              leftText={t(Config.branchesText?.add_branch)}
              animated={true}
              onPressLeft={handleBack}
            />
            <View
              style={{
                width: widthToDp(90),
                marginTop: 10,
                borderRadius: 10,
                alignItems: "center",
                paddingBottom: 60,
              }}
            >
              <View style={{ padding: 10, alignSelf: "flex-start" }}>
                <Text
                  style={{
                    color: Config.Colors.black,
                    fontSize: widthToDp(4.5),
                  }}
                >
                  {t(Config.branchesText?.branch_info)}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <CustomInputAny
                  backgroundColor={Config.Colors.defaultColor}
                  placeholder={t(Config.branchesText?.branch_name)}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoComplete="given-name"
                  bgColor={Config.Colors.inputField}
                  countryCodeStatus={true}
                  onChangeText={(text: string) =>
                    handleOnChange("branchName", text)
                  }
                  value={formInputs?.branchName}
                  commonWidth={widthToDp(90)}
                  commonHeight={widthToDp(15)}
                  textAlignVertical="center"
                  leftImage={Icons?.branch_icon}
                  errorMessage={errorMessage?.branchName ?? ""}
                  borderColor={
                    errorMessage?.branchName
                      ? Config.Colors.errorFieldBorder
                      : Config.Colors.borderColor
                  }
                  onSubmitEditing={() => {}}
                  lable=""
                  countryCode=""
                />
                <TouchableOpacity onPress={() => handleLocation()}>
                  <CustomInputAny
                    backgroundColor={Config.Colors.defaultColor}
                    placeholder={t(Config.branchesText?.branch_location)}
                    keyboardType="default"
                    autoCapitalize="none"
                    autoComplete="given-name"
                    bgColor={Config.Colors.inputField}
                    countryCodeStatus={true}
                    onChangeText={() => {}}
                    value={formInputs?.location?.locationName}
                    editable={false}
                    commonWidth={widthToDp(90)}
                    commonHeight={widthToDp(15)}
                    textAlignVertical="center"
                    numberOfLines={10}
                    multiline={true}
                    leftImage={Icons?.location_icon}
                    errorMessage={errorMessage?.location ?? ""}
                    borderColor={
                      errorMessage?.location
                        ? Config.Colors.errorFieldBorder
                        : Config.Colors.borderColor
                    }
                    onSubmitEditing={() => {}}
                    lable=""
                    countryCode=""
                  />
                </TouchableOpacity>
                <CustomInputAny
                  backgroundColor={Config.Colors.defaultColor}
                  placeholder={t(Config.branchesText?.radius)}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoComplete="given-name"
                  bgColor={Config.Colors.inputField}
                  countryCodeStatus={true}
                  onChangeText={(text: string) =>
                    handleOnChange("radius", text)
                  }
                  value={formInputs?.radius}
                  commonWidth={widthToDp(90)}
                  commonHeight={widthToDp(15)}
                  textAlignVertical="center"
                  numberOfLines={10}
                  multiline={true}
                  leftImage={Icons?.branch_icon}
                  errorMessage={errorMessage?.radius ?? ""}
                  borderColor={
                    errorMessage?.radius
                      ? Config.Colors.errorFieldBorder
                      : Config.Colors.borderColor
                  }
                  onSubmitEditing={() => {}}
                  lable=""
                  countryCode=""
                />
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <CustomLinearButtonAny
                    commonWidth={widthToDp(40)}
                    text={t(Config.otherText?.submit)}
                    onPress={onSubmit}
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
        </ScrollView>
        {openMapModal ? (
          <CustomModal
            modalVisible={openMapModal}
            onRequestClose={() => setOpenMapModal(!openMapModal)}
            alignItems="center"
            justifyContent="center"
            disableOnPress={false}
            animationType="slide"
          >
            <ScrollView
              style={{
                width: widthToDp(100),
                height: heightToDp(100),
                backgroundColor: Config.Colors.bodyBg,
                borderRadius: widthToDp(2),
                paddingBottom: widthToDp(10),
              }}
            >
              <MiniMap handleLocation={handleLocation} />
            </ScrollView>
          </CustomModal>
        ) : null}
      </>
    );
  },
);
