import React from 'react';

import { View, Pressable, Dimensions, StyleSheet } from 'react-native'
import CustomTabBarIcon from '../components/CustomTabBarIcon';
import { heightToDp } from '../helpers/Responsive';

const { width } = Dimensions.get('window')

const CustomTabBar = ({ state, descriptors, navigation, tabBarIcon }) => {
    return (
        <View style={styles.mainContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <View key={index} style={[styles.mainItemContainer, { borderRightWidth: label == "notes" ? 3 : 0 }]}>
                        <Pressable
                            onPress={onPress}
                            style={{ backgroundColor: isFocused ? "#030D16" : "transparent", borderRadius: 20, }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 15 }}>
                                {/* <NavigationIcon route={label} isFocused={isFocused}/> */}
                            </View>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        backgroundColor: "#182028",
        // borderRadius: 25,
    },
    mainItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: heightToDp(8),
        borderRadius: 1,
        borderColor: "#333B42",
        width:'100%'
    },
})


export default CustomTabBar; 
