// react
import React, { useEffect } from "react"

// third-parties
import {
  Platform, StatusBar, Text, View, Image, ImageStyle
} from "react-native"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { NavigationScreenProps } from "react-navigation"
import * as Font from "expo-font"
import { Asset } from 'expo-asset'
import SplashScreen from 'react-native-splash-screen'
import { Root } from "native-base";

// redux
import DebugConfig from "./config/debug-config"
import { AppWithNavigationState } from "./navigation/redux-navigation"
import configureStore from "./redux/create-store"
import { startup, checkLocationPermissionAsync } from "./redux/startup"

// styles
import {colors} from "./theme";
import {Layout} from "./constants";
import { images } from "./theme";

// useScreens()

export const { store, persistor } = configureStore();

type State = {
  isLoadingComplete: boolean
  onAnimationEnd: boolean
  hideSPlash: boolean
}

interface DispatchProps {
  startup: () => void
}

interface MyProps extends NavigationScreenProps {
  skipLoadingScreen: boolean
}

type Props = MyProps & DispatchProps

const APP_LOGO: ImageStyle = {
  // height: '100%',
  // width: '40%',
};


class App extends React.Component<Props, State> {
  state = {
    isLoadingComplete: false,
    onAnimationEnd: false,
    hideSPlash: false
  };
  
  componentDidMount() {
    this.loadResourcesAsync();
    setTimeout(() => SplashScreen.hide() , 2000);
    store.dispatch(startup());
    //@ts-ignore (let's discuss adding a permission screen before authLanding page.)
    store.dispatch(checkLocationPermissionAsync())
  }
  
  render() {
    const { onAnimationEnd, hideSPlash } = this.state
    // if (!this.state.isLoadingComplete) return null;
    if (!this.state.isLoadingComplete) return null;
    
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Text> Loading... </Text>}>
          <View style={{ flex: 1 }}>
            {
              Platform.OS === "ios"
                ?
                <StatusBar
                  barStyle="dark-content"
                />
                :
                <StatusBar
                  barStyle={"dark-content"}
                  translucent
                  backgroundColor={colors.companyGreenTwo}
                />
            }
            
            {/*{*/}
            {/*  !hideSPlash && (<Animatable.View*/}
            {/*    animation={'zoomInLeft'}*/}
            {/*    delay={2000}*/}
            {/*    duration={5000}*/}
            {/*    style={{*/}
            {/*      backgroundColor: colors.white,*/}
            {/*      width: Layout.window.width,*/}
            {/*      height: Layout.window.height,*/}
            {/*      alignItems: 'center',*/}
            {/*      justifyContent: 'center',*/}
            {/*    }}*/}
            {/*    useNativeDriver*/}
            {/*    onAnimationEnd={() => this.setState({*/}
            {/*      onAnimationEnd: true,*/}
            {/*      hideSPlash: true,*/}
            {/*    })}*/}
            {/*  >*/}
            {/*    <Image*/}
            {/*      style={APP_LOGO}*/}
            {/*      source={images.appLogo}*/}
            {/*      resizeMethod={'auto'}*/}
            {/*      resizeMode='cover'*/}
            {/*    />*/}
            {/*  </Animatable.View>)*/}
            {/*}*/}
            
            
            {/*{*/}
            {/*  onAnimationEnd && (*/}
            {/*    <Root>*/}
            {/*      <AppWithNavigationState />*/}
            {/*    </Root>*/}
            {/*  )*/}
            {/*}*/}
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
        require('./assets/individualIcon.png'),
        require('./assets/doctorsIcon.png'),
        require('./assets/companyIcon.png'),
        require('./assets/landingBKG.png'),
      ]),
      Font.loadAsync({
        "Gibson-Bold": require("./assets/fonts/gibson-bold.ttf"),
        "Gibson-Regular": require("./assets/fonts/Gibson-Regular.ttf"),
        "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
        "Rockwell": require('./assets/fonts/rockwell.ttf'),
        "Poppins-Light": require('./assets/fonts/Poppins-Light.ttf'),
        "Poppins-Medium": require('./assets/fonts/Poppins-Medium.ttf'),
        "Poppins-Regular": require('./assets/fonts/Poppins-Regular.ttf'),
        "Montserrat-Bold": require('./assets/fonts/Montserrat-Bold.otf'),
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
