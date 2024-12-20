import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { Button } from "react-native-paper";
import { formatDateFrontEnd } from "@/utils";
import { Trip } from "@/types";
import React from "react";
import moment from "moment";

export default function Details({ trip }: { trip: Trip }) {
  const daysLeftCount = moment(trip.Start_date).diff(moment(), "days");

  return (
    <View>
      <View style={styles.topBar}>
        <Text style={styles.tripTitle}>
          {trip.Title ? trip.Title : trip.Location}
        </Text>
        <Text>{trip.Title !== trip.Location && trip.Location}</Text>
        <Text>
          {formatDateFrontEnd(trip.Start_date)} -{" "}
          {formatDateFrontEnd(trip.End_date)}
        </Text>
      </View>
      <View style={styles.daysLeftCountGroup}>
        <Text style={styles.daysLeftCount}>{daysLeftCount}</Text>
        <Text>Days Away</Text>
      </View>
      {/* <View style={styles.tripButtonGroup}>
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
      </View> */}
      {/* <View style={styles.recommendationSection}>
        <Text style={styles.sectionHeader}>Activities</Text>
        <ScrollView horizontal={true} style={styles.recommendationBlocks}>
          {activityResults.map(
            (activity: ActivityRecommendation, index: number) => (
              <View style={styles.recommendationBlock} key={index}>
                <View style={styles.recommendationBlockHeader}>
                  <Text
                    style={styles.recommendationBlockHeaderText}
                    numberOfLines={2}
                  >
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
            )
          )}
        </ScrollView>
      </View> */}
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
