import { StyleSheet, Text, View, Platform, ScrollView, Linking } from "react-native";

import React, { useState, useEffect } from "react";
import { Trip } from "@/types";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { formatDateFrontEnd } from "@/utils";
import moment from "moment";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import call from "react-native-phone-call";
import { TravelApiCall } from "@/services/ApiService";
import { Toast } from "toastify-react-native";

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
  const trip = JSON.parse(Array.isArray(params.trip) ? params.trip[0] : params.trip);

  const daysLeftCount = moment(trip.Start_date).diff(moment(), "days");

  const [activityResults, setActivityResults] = useState([
    { poi: { name: "", phone: "", url: "" }, address: { freeformAddress: "" } },
    { poi: { name: "", phone: "", url: "" }, address: { freeformAddress: "" } },
    { poi: { name: "", phone: "", url: "" }, address: { freeformAddress: "" } },
  ]);

  useEffect(() => {
    fetch(`https://api.tomtom.com/search/2/poiSearch/.json?lat=${trip.Latitude}&lon=${trip.Longitude}&categorySet=7320,7374,7332,9902,9379,9927,7342,7318,9362&view=Unified&relatedPois=all&key=${process.env.EXPO_PUBLIC_TOMTOM_API_KEY}&limit=15&openingHours=nextSevenDays`)
      .then((response) => response.json())
      .then((json) => {
        setActivityResults(json.results);
      });
  }, []);

  const navigateToDocuments = () => {
    router.push({
      pathname: "/TripDetails",
      params: { trip: JSON.stringify(trip) },
    });
  };

  const triggerCall = (phoneNumber: string) => {
    const args = {
      number: phoneNumber,
      prompt: true,
    };

    call(args).catch(console.error);
  };

  const openLink = (url: string) => {
    Linking.openURL("https://" + url).catch((err) => console.error("Failed to open URL:", err));
  };

  const openAddress = (address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    if (!url) {
      return;
    }
    Linking.openURL(url).catch((err: any) => console.error("An error occurred", err));
  };

  const addPOIToTrip = async (data: any) => {
    try {
      await TravelApiCall("/itinerary", "POST", {
        tripId: trip.id,
        poi_id: data.poi.id,
        phone: data.poi.phone ?? null,
        url: data.poi.url ?? null,
        address: data.address.freeformAddress ?? null,
      });
      // tripCreated();
      console.log("Activity Added Successfully!");
      Toast.success("Activity Added Successfully!");
    } catch (error) {
      console.log("Failed to add activity. Please try again later.");
      Toast.error("Failed to add activity. Please try again later.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.topBar}>
        <Text style={styles.tripTitle}>{trip.Title ? trip.Title : trip.Location}</Text>
        <Text>{trip.Title !== trip.Location && trip.Location}</Text>
        <Text>
          {formatDateFrontEnd(trip.Start_date)} - {formatDateFrontEnd(trip.End_date)}
        </Text>
      </View>
      <View style={styles.daysLeftCountGroup}>
        <Text style={styles.daysLeftCount}>{daysLeftCount}</Text>
        <Text>Days Away</Text>
      </View>
      <View style={styles.tripButtonGroup}>
        <View style={styles.tripButton}>
          <Button mode="contained" onPress={() => navigateToDocuments}>
            Lodging
          </Button>
        </View>
        <View style={styles.tripButton}>
          <Button mode="contained" onPress={() => navigateToDocuments}>
            Documents
          </Button>
        </View>
        <View style={styles.tripButton}>
          <Button mode="contained" onPress={() => navigateToDocuments}>
            Cultural Norms
          </Button>
        </View>
        <View style={styles.tripButton}>
          <Button mode="contained" onPress={() => navigateToDocuments}>
            Phrase Book
          </Button>
        </View>
      </View>
      <View style={styles.recommendationSection}>
        <Text style={styles.sectionHeader}>Activities</Text>
        <ScrollView horizontal={true} style={styles.recommendationBlocks}>
          {activityResults.map((activity: ActivityRecommendation, index: number) => (
            <View style={styles.recommendationBlock} key={index}>
              <View style={styles.recommendationBlockHeader}>
                <Text style={styles.recommendationBlockHeaderText} numberOfLines={2}>
                  {activity.poi.name}
                </Text>
                <View>
                  <TabBarIcon
                    name="add"
                    onPress={() => {
                      addPOIToTrip(activity);
                    }}
                  />
                </View>
              </View>
              <View style={styles.recommendationButtons}>
                {activity.poi.phone && (
                  <TabBarIcon
                    name="phone"
                    onPress={() => {
                      triggerCall(activity.poi.phone);
                    }}
                  />
                )}
                {activity.poi.url && (
                  <TabBarIcon
                    name="link"
                    onPress={() => {
                      openLink(activity.poi.url);
                    }}
                  />
                )}
                {activity.address.freeformAddress && (
                  <TabBarIcon
                    name="location-on"
                    onPress={() => {
                      openAddress(activity.address.freeformAddress);
                    }}
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    margin: 10,
  },
  tripTitle: {
    fontSize: 36,
    fontWeight: "bold",
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
  },
  daysLeftCountGroup: {
    alignItems: "center",
    margin: 10,
  },
  daysLeftCount: {
    fontSize: 76,
    fontWeight: "bold",
  },
  tripButtonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  tripButton: {
    margin: 5,
    width: "45%",
  },
  recommendationSection: {
    margin: 10,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recommendationBlocks: {
    flexDirection: "row",
  },
  recommendationBlock: {
    width: 200,
    height: 125,
    margin: 5,
    padding: 20,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    justifyContent: "space-between",
  },
  recommendationBlockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationBlockHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 20,
    width: "75%",
  },
  recommendationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
