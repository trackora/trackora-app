declare module "*";

// Modules that use CommonJS default export
declare module "react-native-fs" {
  const RNFS: any;
  export default RNFS;
}

declare module "react-native-geolocation-service" {
  const Geolocation: any;
  export default Geolocation;
}

declare module "react-native-sound" {
  const Sound: any;
  export default Sound;
}
