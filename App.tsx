import React, { useEffect } from "react"
import { Platform, StatusBar, Text, View } from "react-native"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { NavigationScreenProps } from "react-navigation"
import * as Font from "expo-font"
import { Asset } from 'expo-asset'

import DebugConfig from "./config/debug-config"
import { AppWithNavigationState } from "./navigation/redux-navigation"
import configureStore from "./redux/create-store"
import { startup, checkLocationPermissionAsync } from "./redux/startup"
import { Root } from "native-base";
// import SplashScreen from 'react-native-splash-screen'
import {colors} from "./theme";

// useScreens()

export const { store, persistor } = configureStore();

type State = {
  isLoadingComplete: boolean
}

interface DispatchProps {
  startup: () => void
}

interface MyProps extends NavigationScreenProps {
  skipLoadingScreen: boolean
}

type Props = MyProps & DispatchProps

class App extends React.Component<Props, State> {
  state = {
    isLoadingComplete: false
  };
  
  componentDidMount() {
    this.loadResourcesAsync();
    // setTimeout(() => SplashScreen.hide() , 2000);
    store.dispatch(startup());
    //@ts-ignore (let's discuss adding a permission screen before authLanding page.)
    store.dispatch(checkLocationPermissionAsync())
  }
  
  render() {
    if (!this.state.isLoadingComplete) return null;
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Text> Loading... </Text>}>
          <View style={{ flex: 1 }}>
            {
              Platform.OS === "ios"
                ? <StatusBar barStyle="light-content" />
                : <StatusBar barStyle={"light-content"} translucent backgroundColor={colors.purple} />
            }
            <Root>
              <AppWithNavigationState />
            </Root>
          </View>
        </PersistGate>
      </Provider>
    )
  }
  
  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        // require('./assets/land-bk.png'),
        // require('./assets/app-logo.png'),
        // require('./assets/google-logo.png'),
        // require('./assets/facebook-logo.png'),
      ]),
      Font.loadAsync({
        "Gibson-Bold": require("./assets/fonts/gibson-bold.ttf"),
        "Gibson-Regular": require("./assets/fonts/Gibson-Regular.ttf"),
        "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
        // "Roboto": require('native-base/Fonts/Roboto.ttf'),
        // "Roboto_medium": require('native-base/Fonts/Roboto_medium.ttf'),
        "Rockwell": require('./assets/fonts/rockwell.ttf'),
      }),
    ]);
    
    this.setState({ isLoadingComplete: true })
  };
  
  // _handleLoadingError = (error: any) => {
  //   // In this case, you might want to report the error to your error
  //   // reporting service, for example Sentry
  //   console.warn(error)
  // };
  
  // _handleFinishLoading = () => {
  //   this.setState({ isLoadingComplete: true })
  // }
}

// allow reactotron overlay for fast design in dev mode
//@ts-ignore
export default DebugConfig.useReactotron ? console.tron.overlay(App) : App
