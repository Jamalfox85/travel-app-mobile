import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState, useEffect } from "react";
import ToastManager, { Toast } from "toastify-react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { View, Platform, Button, Text } from "react-native";

import { TravelApiCall } from "@/services/ApiService";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "717474575408-6kf0b7lpogcvjpm0p8qbi6d0342gss0h.apps.googleusercontent.com",
    redirectUri: Platform.select({
      ios: "com.jamalfox.travelapp:/oauth2redirect",
    }),
  });

  const authUserFromInternalDB = async (googleUserInfo: any) => {
    try {
      await TravelApiCall("/users", "POST", {
        firstName: googleUserInfo.given_name,
        lastName: googleUserInfo.family_name,
        email: googleUserInfo.email,
      });
      Toast.success("Log in Successful!");
    } catch (error) {
      Toast.error("Error during login.");
    }
  };

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const fetchUserDetails = async () => {
        try {
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${
                  response?.authentication?.accessToken ?? ""
                }`,
              },
            }
          );
          const userInfo = await res.json();
          setUserInfo(userInfo);
          authUserFromInternalDB(userInfo);
          // Send this info to your backend to create or update the user
          // saveUserToDatabase(userInfo);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [response]);

  return (
    <>
      {!userInfo ? (
        <View className="border my-auto h-[85vh] m-8 p-8">
          <View className="mt-auto">
            <Button title="Sign in with Google" onPress={() => promptAsync()} />
          </View>
        </View>
      ) : (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? "home" : "home"} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="trips"
            options={{
              title: "Trips",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "airplanemode-active" : "airplanemode-active"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "travel-explore" : "travel-explore"}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      )}
    </>
  );
}
