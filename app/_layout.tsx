import '../theme/unistyles'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import Constants from 'expo-constants'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useFonts } from 'expo-font'
import * as NavigationBar from 'expo-navigation-bar'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import type { AppStateStatus } from 'react-native'
import { AppState, Platform, StyleSheet } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'
import { SWRConfig } from 'swr'

import { Text } from '~/components'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(app)',
}

function DrizzleStudio() {
  useDrizzleStudio(expoDb)
  return null
}

SplashScreen.preventAutoHideAsync()
  .catch(console.error)

function AnimatedSplashScreen(props: { children: React.ReactNode }) {
  const animation = useSharedValue(1)
  const [isAppReady, setAppReady] = useState(false)
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false)

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync()
      // do other load stuff
    }
    catch {
      // handle errors
    }
    finally {
      setAppReady(true)
      animation.value = withTiming(
        0,
        { duration: 1000 },
        (finished) => {
          if (finished) {
            runOnJS(setAnimationComplete)(true)
          }
        },
      )
    }
  }, [])

  const imageContainerBackgroundColor = UnistylesRuntime.colorScheme === 'dark'
    ? Platform.select({
      ios: Constants.expoConfig!.ios!.splash!.dark!.backgroundColor,
      android: Constants.expoConfig!.android!.splash!.dark!.backgroundColor,
    })
    : Platform.select({
      ios: Constants.expoConfig!.ios!.splash!.backgroundColor,
      android: Constants.expoConfig!.android!.splash!.backgroundColor,
    })

  const imageResizeMode = Platform.select({
    ios: Constants.expoConfig!.ios!.splash!.resizeMode,
    android: Constants.expoConfig!.android!.splash!.resizeMode,
  }) as 'cover' | 'contain'

  const imageContainerStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: imageContainerBackgroundColor,
    opacity: animation.value,
  }))

  const imageStyle = useAnimatedStyle(() => ({
    width: '100%',
    height: '100%',
    resizeMode: imageResizeMode ?? 'cover',
  }))

  const sourceModuleId = UnistylesRuntime.colorScheme === 'dark' ? require('../assets/splash-dark.png') : require('../assets/splash.png')

  return (
    <Animated.View style={{ flex: 1 }}>
      {isAppReady && props.children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={imageContainerStyle}
        >
          <Animated.Image
            style={imageStyle}
            source={sourceModuleId}
            onLoad={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </Animated.View>
  )
}

function App() {
  const { success, error } = useMigrations(db, migrations)
  const { theme } = useStyles()

  useEffect(() => {
    if (Platform.OS === 'android') {
      void NavigationBar.setPositionAsync('absolute')
      void NavigationBar.setBackgroundColorAsync(theme.colors.gray2)
      void NavigationBar.setButtonStyleAsync(UnistylesRuntime.colorScheme === 'light' ? 'dark' : 'light')
    }
  }, [theme.colors.gray2])

  const [fontLoaded, loadFontError] = useFonts({
    'SNPro-Black': ('./font/sn-pro/SNPro-Black.otf'),
    'SNPro-BlackItalic': ('./font/sn-pro/SNPro-BlackItalic.otf'),
    'SNPro-Bold': ('./font/sn-pro/SNPro-Bold.otf'),
    'SNPro-BoldItalic': ('./font/sn-pro/SNPro-BoldItalic.otf'),
    'SNPro-Heavy': ('./font/sn-pro/SNPro-Heavy.otf'),
    'SNPro-HeavyItalic': ('./font/sn-pro/SNPro-HeavyItalic.otf'),
    'SNPro-Light': ('./font/sn-pro/SNPro-Light.otf'),
    'SNPro-LightItalic': ('./font/sn-pro/SNPro-LightItalic.otf'),
    'SNPro-Medium': ('./font/sn-pro/SNPro-Medium.otf'),
    'SNPro-MediumItalic': ('./font/sn-pro/SNPro-MediumItalic.otf'),
    'SNPro-Regular': ('./font/sn-pro/SNPro-Regular.otf'),
    'SNPro-RegularItalic': ('./font/sn-pro/SNPro-RegularItalic.otf'),
    'SNPro-Semibold': ('./font/sn-pro/SNPro-Semibold.otf'),
    'SNPro-SemiboldItalic': ('./font/sn-pro/SNPro-SemiboldItalic.otf'),
    'SNPro-Thin': ('./font/sn-pro/SNPro-Thin.otf'),
    'SNPro-ThinItalic': ('./font/sn-pro/SNPro-ThinItalic.otf'),
  })

  useEffect(() => {
    if (fontLoaded || loadFontError) {
      SplashScreen.hideAsync()
        .catch(console.error)
    }
  }, [fontLoaded, loadFontError])

  if (!fontLoaded && !loadFontError) {
    return null
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    )
  }

  if (!success) {
    return (
      <SafeAreaView>
        <Text>Migration is in progress...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => true,
        initFocus(callback) {
          let appState = AppState.currentState

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /* If it's resuming from background or inactive mode to active one */
            if (/inactive|background/.test(appState) && nextAppState === 'active') {
              callback()
            }
            appState = nextAppState
          }

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener('change', onAppStateChange)

          return () => {
            subscription.remove()
          }
        },
      }}
    >
      <ThemeProvider
        value={UnistylesRuntime.colorScheme === 'light' ? DefaultTheme : DarkTheme}
      >
        {__DEV__ && <DrizzleStudio />}
        <Slot />
      </ThemeProvider>
    </SWRConfig>
  )
}

export default function RootLayout() {
  return (
    <AnimatedSplashScreen>
      <App />
    </AnimatedSplashScreen>
  )
}
