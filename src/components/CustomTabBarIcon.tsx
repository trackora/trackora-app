// CustomTabBarIcon.js
import React from 'react';
import { Image } from 'react-native';
import * as Config from '../helpers/Config'
const CustomTabBarIcon = ({ focused, iconSource }) => {
    return (
        <>
            {iconSource ?
                <Image
                    source={iconSource}
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: focused ? Config.Colors.themeColor : Config.Colors.bottomColor, // Change the tint color as needed
                    }}
                />
                : null}
        </>
    )
};

export default CustomTabBarIcon;
