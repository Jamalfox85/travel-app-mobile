import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Linking,
} from "react-native";

import React, { useState, useEffect } from "react";
import { Trip } from "@/types";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { formatDateFrontEnd } from "@/utils";
import moment from "moment";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { TravelApiCall } from "@/services/ApiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scroll } from "lucide-react-native";
import Details from "@/components/TravelDetails/Details";
import Itinerary from "@/components/TravelDetails/Itinerary";
import Explore from "@/components/TravelDetails/Explore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddActivityDrawer from "@/components/drawers/AddActivityDrawer";
import ToastManager, { Toast } from "toastify-react-native";
import AddAccommodationDrawer from "@/components/drawers/AddAccommodationDrawer";

interface ActivityRecommendation {
  poi: {
    name: string;
    phone: string;
    url: string;
  };
  address: {
    freeformAddress: string;
  };
}

export default function TripDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const trip = JSON.parse(
    Array.isArray(params.trip) ? params.trip[0] : params.trip
  );

  const [activityResults, setActivityResults] = useState([]);
  const [restaurantResults, setRestaurantResults] = useState([]);

  // useEffect(() => {
  //   fetch(`https://api.tomtom.com/search/2/poiSearch/.json?lat=${trip.Latitude}&lon=${trip.Longitude}&categorySet=7320,7374,7332,9902,9379,9927,7342,7318,9362&view=Unified&relatedPois=all&key=${process.env.EXPO_PUBLIC_TOMTOM_API_KEY}&limit=15&openingHours=nextSevenDays`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       setActivityResults(json.results);
  //     });

  //   const radius = 15000; // meters
  //   fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}&type=restaurant&location=${trip.Latitude},${trip.Longitude}&radius=${radius}`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       setRestaurantResults(json.results);
  //     });

  //   console.log("restaurantResults", restaurantResults);
  // }, []);

  const navigateToDocuments = () => {
    router.push({
      pathname: "/TripDetails",
      params: { trip: JSON.stringify(trip) },
    });
  };

  const addPOIToTrip = async (data: any) => {
    try {
      await TravelApiCall("/itinerary", "POST", {
        tripId: trip.ID,
        title: data.poi.name,
        poi_id: data.id,
        phone: data.poi.phone ?? null,
        url: data.poi.url ?? null,
        address: data.address.freeformAddress ?? null,
      });
      Toast.success("Activity Added Successfully!");
    } catch (error) {
      Toast.error("Failed to add activity. Please try again later.");
    }
  };

  const condition = true;

  const tabs = [
    { name: "Details", component: Details },
    { name: "Itinerary", component: Itinerary },
    { name: "Explore", component: Explore },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [addActivityModalVisible, setAddActivityModalVisible] = useState(false);
  const [addAccommodationModalVisibile, setAddAccommodationModalVisible] =
    useState(false);

  return (
    <ScrollView className="flex-1 p-6">
      <ToastManager />
      <View className="flex-1 justify-center items-end mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button mode="contained">
              <Ionicons size={16} name="add-outline" className="mr-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            insets={contentInsets}
            className="w-80 bg-white border-0 mt-[100px]"
          >
            <View className="mb-2">
              <Button
                mode="contained"
                onPress={() => {
                  setAddActivityModalVisible(true);
                }}
              >
                New Activity
              </Button>
            </View>
            <View>
              <Button
                mode="contained"
                onPress={() => {
                  setAddAccommodationModalVisible(true);
                }}
              >
                New Accommodation
              </Button>
            </View>
          </PopoverContent>
        </Popover>
      </View>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row w-full mb-4">
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.name}
              className={`flex-1  ${
                tab.name == activeTab && "border-b-2 border-purple-700"
              }`}
            >
              <Text
                className={`text-center mb-2 ${
                  tab.name == activeTab
                    ? "text-purple-700 font-bold"
                    : "text-gray-500"
                }`}
              >
                {tab.name}
              </Text>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, index) => (
          <TabsContent key={index} value={tab.name}>
            {tab.component && <tab.component trip={trip} />}
          </TabsContent>
        ))}
      </Tabs>
      <AddActivityDrawer
        trip={trip}
        isOpen={addActivityModalVisible}
        updateVisibility={(state) => setAddActivityModalVisible(state)}
      />
      <AddAccommodationDrawer
        trip={trip}
        isOpen={addAccommodationModalVisibile}
        updateVisibility={(state) => setAddAccommodationModalVisible(state)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
