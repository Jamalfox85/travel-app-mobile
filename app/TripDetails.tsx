import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Trip } from "@/types";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { formatDateFrontEnd } from "@/utils";
import moment from "moment";

export default function TripDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const trip = JSON.parse(Array.isArray(params.trip) ? params.trip[0] : params.trip);

  const daysLeftCount = moment(trip.Start_date).diff(moment(), "days");

  const [activityResults, setActivityResults] = useState([]);

  // useEffect(() => {
  //   fetch(`https://api.tomtom.com/search/2/poiSearch/pizza.json?lat=37.337&lon=-121.89&categorySet=7320, 7374, 7332, 9902, 9379, 9927, 7342, 7318, 9362&view=Unified&relatedPois=all&key=${process.env.EXPO_PUBLIC_TOMTOM_API_KEY}&limit=15&openingHours=nextSevenDays`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       setActivityResults(json.results);
  //     });
  // }, []);

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

  const navigateToDocuments = () => {
    router.push({
      pathname: "/TripDetails",
      params: { trip: JSON.stringify(trip) },
    });
  };
  return (
    <View>
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
        <View style={styles.recommendationBlocks}>
          {activityResults.map((activity: ActivityRecommendation) => (
            <View style={styles.recommendationBlock}>
              <View style={styles.sectionBlockHeader}>
                <Text>{activity.poi.name}</Text>
              </View>
              <Text>{activity.poi.phone}</Text>
              <Text>{activity.poi.url}</Text>
              <Text>{activity.address.freeformAddress}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
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
  },
  recommendationBlocks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  recommendationBlock: {
    width: "45%",
    margin: 5,
    padding: 10,
    backgroundColor: "lightgrey",
  },
  sectionBlockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
