import * as React from "react"
import { Image } from "react-native"
import {
  StackNavigatorConfig,
  TabNavigatorConfig,
  DrawerNavigatorConfig,
  BottomTabNavigatorConfig
} from "react-navigation"

// import { Icon } from "../components/icon"
import { Icon } from "native-base"
import { images } from "../theme";
import {Layout} from "../constants";

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
      if (routeName === 'home') {
        image = images.globe;
      } if (routeName === 'search') {
        image = images.search;
      } if (routeName === 'contactUs') {
        image = images.contactUs;
      } if (routeName === 'profile') {
        image = images.profile;
      }
      
      return <Image
        source={image}
        resizeMethod={'auto'}
        resizeMode='cover'
        style={{
          tintColor
        }}
      />
      
    },
  }),
  tabBarOptions: {
    activeTintColor: '#3a203b',
    inactiveTintColor: '#566176',
    style: {
      backgroundColor: '#fff'
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
