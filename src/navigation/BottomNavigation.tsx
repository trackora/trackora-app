import * as Icons from '../helpers/Icons.js';
import * as Config from '../helpers/Config.js';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBarIcon from '../components/CustomTabBarIcon';
import Settings from '../screens/admin/Settings.js';
import Home from '../screens/admin/Home.js';
import Profile from '../screens/user/Profile.js';
import Menu from '../screens/user/Menu.js';
import PunchScreen from '../screens/user/PunchScreen.js';
import { heightToDp, widthToDp } from '../helpers/Responsive.js';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../screens/user/(home)/HomeScreen.jsx';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      // tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        tabBarActiveTintColor: Config.Colors.themeColor,
        tabBarInactiveTintColor: Config.Colors.bottomColor,
        tabBarStyle: {
          height: heightToDp(8),
          // paddingVertical: 10,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: widthToDp(3),
          fontFamily: Config.fontFamilys.Poppins_SemiBold,
        },
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="markattendance"
    >
      <Tab.Screen
        name="profile"
        options={{
          tabBarLabel: t(Config.adminBottomStackText?.home),
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconSource={Icons?.home_icon} // Replace with your image path
            />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="markattendance"
        options={{
          tabBarLabel: t(Config.bottomTabsText?.attendance),
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconSource={Icons?.fingerprint_scan} // Replace with your image path not uri
            />
          ),
        }}
        component={PunchScreen}
      />

      <Tab.Screen
        name="Menu"
        options={{
          tabBarLabel: t(Config.bottomTabsText?.menu),
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconSource={Icons?.menu_icon} // Replace with your image path
            />
          ),
        }}
        component={Menu}
      />
    </Tab.Navigator>
  );
};
const AdminBottomTabs = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        tabBarActiveTintColor: Config.Colors.themeColor,
        tabBarInactiveTintColor: Config.Colors.themeColor,
        tabBarStyle: {
          height: heightToDp(6.5),
        },
        tabBarLabelStyle: {
          fontSize: widthToDp(3),
          fontFamily: Config.fontFamilys.Poppins_SemiBold,
        },
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="home"
    >
      <Tab.Screen
        name="home"
        options={{
          tabBarLabel: t(Config.bottomTabsText?.home),
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconSource={Icons?.home_icon} // Replace with your image path not uri
            />
          ),
        }}
        initialParams={{ name: t(Config.bottomTabsText?.home) }}
        component={Home}
      />
      <Tab.Screen
        name="settings"
        options={{
          tabBarLabel: t(Config.adminBottomStackText?.settings),
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconSource={Icons?.settings_icon} // Replace with your image path
            />
          ),
        }}
        initialParams={{ name: Config.adminBottomStackText?.settings }}
        component={Settings}
      />
    </Tab.Navigator>
  );
};

export { BottomTabs, AdminBottomTabs };
