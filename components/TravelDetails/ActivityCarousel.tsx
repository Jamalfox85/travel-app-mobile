import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import RecommendationBlock from "./RecommendationBlock";

const ActivityCarousel = ({
  carouselHeader,
  activities,
}: {
  carouselHeader: string;
  activities: any[];
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{carouselHeader}</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {activities &&
          activities.map((activity, index) => (
            <RecommendationBlock key={index} recommendation={activity} />
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllButton: {
    fontSize: 16,
    color: "blue",
  },
  carousel: {
    paddingHorizontal: 10,
  },
  card: {
    width: 150,
    height: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 16,
  },
});

export default ActivityCarousel;
