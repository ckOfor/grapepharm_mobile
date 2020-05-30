import * as React from "react"
import {Image, ImageBackground, TouchableOpacity, View} from "react-native"
import {
  StackNavigatorConfig,
  TabNavigatorConfig,
  DrawerNavigatorConfig,
  BottomTabNavigatorConfig
} from "react-navigation"

import {colors, images} from "../theme";

/**
 * The default stack navigator config for this app.
 */
export const DEFAULT_STACK_NAVIGATOR_CONFIG: StackNavigatorConfig = {
  headerMode: "screen",
  defaultNavigationOptions: {
    header: null,
    gesturesEnabled: false,
    headerTitleAllowFontScaling: false,
  },
}

/**
 * The default stack navigator config for this app.
 */
export const DEFAULT_BOTTOM_NAVIGATION: BottomTabNavigatorConfig = {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let image: any
      if (routeName === 'landing') {
        image = focused ? images.homeIconTrue : images.homeFalse;
      } if (routeName === 'records') {
        image = focused ? images.recordsIconTrue : images.records;
      } if (routeName === 'cart') {
        image = focused ? images.cartIconTrue : images.cartIcon;
      } if (routeName === 'notifications') {
        image = focused ? images.notificationIconTrue : images.notifications
      } if (routeName === 'account') {
        image = focused ? images.accountIconTrue : images.accountIcon
      }
      
      return focused
        ?
        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            top: -25,
            backgroundColor: colors.AuthBG,
            borderRadius: 30,
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              right: 15,
              top: -13,
            }}
    
            source={image}
            resizeMethod={'auto'}
            resizeMode='cover'
          />
        </TouchableOpacity>
      
      :
        <Image
          source={image}
          resizeMethod={'auto'}
          resizeMode='cover'
        />
      
    },
  }),
  tabBarOptions: {
    activeTintColor: '#3a203b',
    inactiveTintColor: '#566176',
    style: {
      backgroundColor: '#fff',
      borderColor: 'red'
    },
    showLabel: false,
  },
}

/**
 * The default tab navigator config for this app.
 */
export const DEFAULT_TAB_NAVIGATOR_CONFIG: TabNavigatorConfig = {}

/**
 * The default drawer navigator config for this app.
 */
export const DEFAULT_DRAWER_NAVIGATOR_CONFIG: DrawerNavigatorConfig = {
  hideStatusBar: false,
  // drawerBackgroundColor: colors.background,
  style: {
    // paddingTop: 40,
    borderTopWidth: 1
  },
  contentOptions: {
    // inactiveTintColor: colors.white,
    // activeTintColor: colors.palette.primaryPink,
    // activeBackgroundColor: colors.background,
    // inactiveBackgroundColor: colors.background,
    
    labelStyle: {
      // fontSize: 23,
      // fontFamily: fonts.dinLight,
      textTransform: "capitalize",
      // marginVertical: 10,
      // paddingVertical: 10,
      // borderBottomWidth: 1,
      // borderBottomColor: colors.dustyGray,
      // width: "90%"
    }
  }
}
