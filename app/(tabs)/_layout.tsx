import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
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
    </>
  );
}
