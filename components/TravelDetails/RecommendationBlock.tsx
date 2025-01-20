import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";

const RecommendationBlock = ({ recommendation }: { recommendation: any }) => {
  //   console.log("recommendation: ", recommendation);
  return (
    <View style={styles.card}>
      <View className="flex-row">
        <Text style={styles.title}>{recommendation.poi?.name}</Text>
        {/* <View className="flex-row items-center">
          <Text>4.5</Text>
          <Ionicons
            size={16}
            name="star-outline"
            className="mr-2 text-yellow"
          />
        </View> */}
      </View>
      {recommendation.poi?.url && (
        <TouchableOpacity
          onPress={() => Linking.openURL(recommendation.poi?.url)}
        >
          <Text style={styles.link}>Visit Site</Text>
        </TouchableOpacity>
      )}
      {recommendation.poi?.phone && (
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${recommendation.poi?.phone}`)}
        >
          <Text style={styles.link}>Call: {recommendation.poi?.phone}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: 175,
    height: 125,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginRight: "auto",
    width: "75%",
  },
  link: {
    color: "#1E90FF",
    marginBottom: 5,
  },
  rating: {
    alignSelf: "flex-start",
  },
});

export default RecommendationBlock;
