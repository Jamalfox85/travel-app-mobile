import { useState, useEffect } from "react";
import { Image, StyleSheet, Modal, View, Text } from "react-native";
import { Button } from "react-native-paper";
import ToastManager, { Toast } from "toastify-react-native";
import moment from "moment";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Trip } from "@/types";
import { TravelApiCall } from "@/services/ApiService";

import TripRecord from "@/components/Home/TripRecord";
import CreateTripDrawer from "@/components/drawers/CreateTripDrawer";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";

export default function HomeScreen() {
  const userId = useSelector((state: RootState) => state.auth.userId);

  const [tripData, setTripData] = useState<Trip[]>([]);
  const [createTripModalVisible, setCreateTripModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await TravelApiCall(`/trips/${userId}`);
        setTripData(data);
      } catch (error) {
        Toast.error("Failed to fetch trip data. Please try again later.");
      }
    };

    fetchData();
  }, [userId]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/index-bg.jpg")}
          style={styles.bgImg}
        />
      }
    >
      <View style={styles.titleContainer}>
        <ToastManager />
        <Text>{userId}</Text>
        <ThemedText type="title">My Trips</ThemedText>
        {process.env.TRAVEL_API_BASE_URL}
        <Button
          mode="contained"
          onPress={() => setCreateTripModalVisible(true)}
        >
          Add Trip
        </Button>
      </View>
      <View style={styles.contentContainer}>
        <ThemedText type="subtitle">Upcoming Trips</ThemedText>
        {tripData &&
          tripData
            .filter((trip) => moment(trip.End_date) >= moment())
            .map((trip, index) => <TripRecord key={index} trip={trip} />)}
      </View>
      <View style={styles.contentContainer}>
        <ThemedText type="subtitle">Past Trips</ThemedText>
        {tripData &&
          tripData
            .filter((trip) => moment(trip.End_date) < moment())
            .map((trip, index) => <TripRecord key={index} trip={trip} />)}
      </View>

      <CreateTripDrawer
        isOpen={createTripModalVisible}
        updateVisibility={(state) => setCreateTripModalVisible(state)}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  bgImg: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
