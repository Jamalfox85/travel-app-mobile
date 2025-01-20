import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Trip } from "@/types";
import { formatDateFrontEnd } from "@/utils";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setTrip } from "@/store/tripSlice";

export default function TripRecord({ trip }: { trip: Trip }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const navigateToDetails = () => {
    dispatch(setTrip({ trip: trip }));
    router.push({
      pathname: "/TripDetails",
      params: { trip: JSON.stringify(trip) },
    });
  };
  return (
    <TouchableOpacity onPress={navigateToDetails}>
      {trip.Photo_uri && (
        <ImageBackground
          source={{ uri: trip.Photo_uri }}
          style={styles.bgImg}
        />
      )}
      <View
        style={[
          styles.tripWrapper,
          trip.Photo_uri ? styles.tripWrapperWithBGImage : null,
        ]}
      >
        <ThemedText
          style={[styles.tripTitle, trip.Photo_uri ? { color: "white" } : null]}
        >
          {trip.Title ? trip.Title : trip.Location}
        </ThemedText>

        {trip.Title && trip.Title !== trip.Location && (
          <ThemedText style={trip.Photo_uri ? { color: "white" } : null}>
            {trip.Location}
          </ThemedText>
        )}

        <ThemedText style={trip.Photo_uri ? { color: "white" } : null}>
          {formatDateFrontEnd(trip.Start_date)} •{" "}
          {formatDateFrontEnd(trip.End_date)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    resizeMode: "cover",
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  tripWrapper: {
    borderWidth: 2,
    borderColor: "lightgray",
    borderRadius: 10,
    padding: 20,
    height: 200,
    flex: 1,
  },
  tripWrapperWithBGImage: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
