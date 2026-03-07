import { View, Image, Animated, Easing, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import * as Icons from '../helpers/Icons';
import { widthToDp } from '../helpers/Responsive';

const LoadingSpinner = ({
  commonWidth = widthToDp(10),
  commonHeigth = widthToDp(10),
  isLoading = false,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data)
    const fetchData = async () => {
      // Simulating a delay of 3 seconds
      setTimeout(() => {
        //   setIsLoading(false);
      }, 3000);
    };

    // Call the fetchData function
    fetchData();

    // Start the rotation animation
    startRotationAnimation();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Animated.View
          style={[styles.loadingContainer, { transform: [{ rotate: spin }] }]}
        >
          {/* Add your custom loading spinner content here */}
          {/* <Text>Loading...</Text> */}
          <Image
            source={Icons.loading_icon}
            style={{ width: commonWidth, height: commonHeigth }}
            resizeMode="contain"
          />
        </Animated.View>
      ) : (
        <View>
          <Image
            source={Icons.loading_icon}
            style={{ width: commonWidth, height: commonHeigth }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {},
});

export default LoadingSpinner;
