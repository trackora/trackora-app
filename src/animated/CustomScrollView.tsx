import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Animated } from 'react-native';

interface Item {
  key: string;
  title: string;
}

const FixedHeaderSearchFlatList = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const HEADER_MAX_HEIGHT = 100; // Adjust this according to your header height

  // Interpolate scrollY for header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, 5],
    extrapolate: 'clamp',
  });

  const data = Array.from({ length: 50 }, (_, i) => ({
    key: `${i}`,
    title: `Item ${i}`,
  }));

  const renderItem = ({ item }: { item: Item }) => (
    <View
      style={{
        height: 50,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          backgroundColor: 'blue', // Your header background color
          zIndex: 1000, // Ensure the header stays above content
          alignItems: 'center', // Adjust alignment as needed
          justifyContent: 'center', // Adjust alignment as needed
        }}
      >
        {/* Your header content */}
        <Text style={{ color: 'white', fontSize: 20 }}>Header</Text>
        {/* Your search input */}
        <TextInput
          style={{
            height: 40,
            width: '90%',
            backgroundColor: 'white',
            marginTop: 5,
            paddingHorizontal: 10,
          }}
          placeholder="Search..."
        />
      </Animated.View>
      <FlatList
        style={{ flex: 1, marginTop: HEADER_MAX_HEIGHT }}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        scrollEventThrottle={16} // Adjust as needed
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      />
    </View>
  );
};

export default FixedHeaderSearchFlatList;
