import { StyleSheet, Text, Touchable, View } from "react-native";
import React from "react";
import ActivityCarousel from "./ActivityCarousel";
import ArticleGroup from "./ArticleGroup";
import { TouchableOpacity, Linking } from "react-native";
import { Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";

export default function Explore() {
  const trip = useSelector((state: RootState) => state.trip) as {
    trip: any;
  };
  console.log("trip: ", trip);

  const [activityResults, setActivityResults] = useState([]);
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  useEffect(() => {
    fetch(
      `https://api.tomtom.com/search/2/poiSearch/.json?lat=${trip.trip.Latitude}&lon=${trip.trip.Longitude}&categorySet=7320,7374,7332,9902,9379,9927,7342,7318,9362&view=Unified&relatedPois=all&key=${process.env.EXPO_PUBLIC_TOMTOM_API_KEY}&limit=15&openingHours=nextSevenDays`
    )
      .then((response) => response.json())
      .then((json) => {
        setActivityResults(json.results);
      });

    fetch(
      `https://api.tomtom.com/search/2/poiSearch/.json?lat=${trip.trip.Latitude}&lon=${trip.trip.Longitude}&categorySet=7315&view=Unified&relatedPois=all&key=${process.env.EXPO_PUBLIC_TOMTOM_API_KEY}&limit=15&openingHours=nextSevenDays`
    )
      .then((response) => response.json())
      .then((json) => {
        setRestaurantResults(json.results);
      });

    fetch(
      `http://api.mediastack.com/v1/news?access_key=13a74c9f2c7792a9b9701d418b325591&countries=fr&limit=10`
    )
      .then((response) => response.json())
      .then((json) => {
        setNewsResults(json.data);
      });
  }, []);

  return (
    <View>
      <ActivityCarousel
        carouselHeader="Activities"
        activities={activityResults}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>See More</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="contained" style={styles.button}>
            Restaurants
          </Button>
          <Button mode="contained" style={styles.button}>
            Attractions
          </Button>
          <Button mode="contained" style={styles.button}>
            Museums
          </Button>
          <Button mode="contained" style={styles.button}>
            Parks
          </Button>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Travel Info</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            className="items-center"
            onPress={() =>
              Linking.openURL(
                `https://en.wikivoyage.org/wiki/${
                  trip.trip.Location.split(",")[0]
                }`
              )
            }
          >
            <Text className="text-xl mb-2">Info</Text>
            <Ionicons
              size={30}
              name="information-circle-outline"
              className="mr-2"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() =>
              Linking.openURL(
                `https://en.wikivoyage.org/wiki/${
                  trip.trip.Location.split(",")[0]
                }#Districts`
              )
            }
          >
            <Text className="text-xl mb-2">Districts</Text>
            <Ionicons size={30} name="business-outline" className="mr-2" />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() =>
              Linking.openURL(
                `https://en.wikivoyage.org/wiki/${
                  trip.trip.Location.split(",")[0]
                }#Get_around`
              )
            }
          >
            <Text className="text-xl mb-2">Transport</Text>
            <Ionicons size={30} name="bus-outline" className="mr-2" />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() =>
              Linking.openURL(
                `https://en.wikivoyage.org/wiki/${
                  trip.trip.Location.split(",")[0]
                }#Understand`
              )
            }
          >
            <Text className="text-xl mb-2">Understand</Text>
            <Ionicons size={30} name="chatbubbles-outline" className="mr-2" />
          </TouchableOpacity>
        </View>
      </View>
      <ActivityCarousel
        carouselHeader="Restaurants"
        activities={restaurantResults}
      />
      <ArticleGroup newsResults={newsResults} />
    </View>
  );
}

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
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    marginVertical: 5,
  },
});
