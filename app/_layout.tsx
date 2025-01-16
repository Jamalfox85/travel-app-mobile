import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Button } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Platform } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [userInfo, setUserInfo] = useState(null);
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "717474575408-6kf0b7lpogcvjpm0p8qbi6d0342gss0h.apps.googleusercontent.com",
  //   redirectUri: Platform.select({
  //     ios: "com.jamalfox.travelapp:/oauth2redirect",
  //   }),
  // });
  // console.log("user info: ", response);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="TripDetails" />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <Button title="Sign in with Google" onPress={() => promptAsync()} /> */}
      <PortalHost />
    </ThemeProvider>
  );
}
