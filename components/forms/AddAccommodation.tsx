import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  TextInput,
  Button,
  List,
  TouchableRipple,
  Text,
  Icon,
  MD3Colors,
  RadioButton,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import debounce from "lodash.debounce";
import { start } from "repl";
import moment from "moment";
import { Toast } from "toastify-react-native";
import { TravelApiCall } from "@/services/ApiService";
import { Trip } from "@/types";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function CreateTrip({
  activityAdded,
  trip,
}: {
  activityAdded: () => void;
  trip: Trip;
}) {
  const [location, setLocation] = useState<any>();
  const [locationSearchResults, setLocationSearchResults] = useState<any>([]);
  const [startDate, setStartDate] = useState(moment(trip.Start_date).toDate());
  const [endDate, setEndDate] = useState(moment(trip.End_date).toDate());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      title: "",
    },
  });

  const locationDetails = async (place_id: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );
    const data = await response.json();
    return data.result;
  };

  const onFormSubmit = async (data: any) => {
    const details = await locationDetails(location?.place_id);
    try {
      await TravelApiCall("/accommodations", "POST", {
        tripId: trip.ID,
        title: location.structured_formatting.main_text,
        address: details.formatted_address,
        url: details?.website,
        phone: details?.formatted_phone_number,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });
      activityAdded();
      Toast.success("Trip Created Successfully!");
    } catch (error) {
      Toast.error("Failed to create trip. Please try again later.");
    }
  };

  const fetchSearchLocations = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 3) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=lodging&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}&location=${trip.Latitude},${trip.Longitude}&radius=50000`
        );
        const data = await response.json();
        setLocationSearchResults(data.predictions);
      } else {
        setLocationSearchResults([]);
      }
    }, 1000),
    []
  );

  const onStartDateChange = (event: any, selectedDate: any) => {
    selectedDate > endDate && setEndDate(selectedDate);
    setStartDate(selectedDate);
  };
  const onEndDateChange = (event: any, selectedDate: any) => {
    selectedDate < startDate && setStartDate(selectedDate);
    setEndDate(selectedDate);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text>Location</Text>
        {!location ? (
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  fetchSearchLocations(text);
                }}
                value={value}
                label={"Location"}
                mode={"outlined"}
              />
            )}
            name="location"
          />
        ) : (
          <View style={styles.selectedLocation}>
            <Text variant="titleLarge">
              {location.structured_formatting.main_text}
            </Text>
            <Button onPress={() => setLocation(null)}>
              <Icon source="close" color={MD3Colors.primary50} size={30} />
            </Button>
          </View>
        )}

        {locationSearchResults.length > 0 && !location && (
          <View style={styles.searchResults}>
            {locationSearchResults.map((result: any, index: number) => (
              <TouchableRipple key={index} rippleColor="rgba(0, 0, 0, .32)">
                <List.Item
                  title={result.description}
                  onPress={() => {
                    setLocation(result);
                  }}
                />
              </TouchableRipple>
            ))}
          </View>
        )}
        {errors.location && <Text>This is required.</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text>Trip Dates</Text>
        <View style={styles.datesContainer}>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
            minimumDate={moment(trip.Start_date).toDate()}
            maximumDate={moment(trip.End_date).toDate()}
          />
          <Text> - </Text>
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            minimumDate={moment(trip.Start_date).toDate()}
            maximumDate={moment(trip.End_date).toDate()}
          />
        </View>
      </View>

      <Button mode="contained" onPress={handleSubmit(onFormSubmit)}>
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  searchResults: {
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 10,
  },
  selectedLocation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageOption: {
    width: 100,
    height: 100,
  },
  activeImageOption: {
    borderWidth: 10,
    borderColor: MD3Colors.primary50,
  },
  datesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
