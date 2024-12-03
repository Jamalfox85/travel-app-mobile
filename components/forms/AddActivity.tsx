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
import Dropdown from "react-native-input-select";
import { Trip, Activity } from "@/types";

interface SearchResult {
  description: string;
  place_id: string;
}
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DateDropdownOption {
  label: string;
  value: string;
  [key: string]: any;
}

export default function AddActivity({
  trip,
  activityAdded,
}: {
  trip: Trip;
  activityAdded: () => void;
}) {
  const [activity, setActivity] = useState<SearchResult | null>();
  const [activitySearchResults, setActivitySearchResults] = useState<any>([]);
  useState<Coordinates>({ latitude: 0, longitude: 0 });

  const [selectedDate, setSelectedDate] = useState<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      activity: "",
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

  const photoDetails = async (photo_reference: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );
    return response.url;
  };

  const onFormSubmit = async (data: any) => {
    if (!activity) {
      Toast.error("Please select an activity.");
      return;
    }
    const details = await locationDetails(activity?.place_id);
    if (!details.photos || details.photos.length === 0) {
      Toast.error("No photos available for this place.");
      return;
    }
    const photoUri = await photoDetails(details.photos[0].photo_reference);
    try {
      await TravelApiCall("/itinerary", "POST", {
        tripId: trip.ID,
        title: activity.description,
        date: moment(selectedDate).format("YYYY-MM-DD"),
        url: details?.website,
        phone: details?.formatted_phone_number,
        address: details?.formattedAddress,
        // description: details.editorial_summary.overview -- Api doesn't currently accept this field, add it in when I decide to add description field to itinerary_items table
        isCustom: false,
        photoUri: photoUri || "",
        rating: parseInt(details?.rating),
        price: details?.price_level,
      });
      activityAdded();
      Toast.success("Activity Added Successfully!");
    } catch (error) {
      Toast.error("Failed to add activity. Please try again later.");
    }
  };

  const fetchSearchActivities = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 3) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();
        setActivitySearchResults(data.predictions);
      } else {
        setActivitySearchResults([]);
      }
    }, 1000),
    []
  );

  const start = moment(trip.Start_date);
  const end = moment(trip.End_date);
  const numTripDays = end.diff(start, "days") + 1;

  const tripDates: DateDropdownOption[] = [];
  for (let i = 0; i < numTripDays; i++) {
    let momentDate = moment(start).add(i, "day");
    let date = momentDate.format("dddd MMMM D, YYYY");
    let value = momentDate.format("YYYY-MM-DD");

    tripDates.push({
      label: date,
      value: value,
    });
  }
  // Add Unassigned Tab
  tripDates.unshift({
    label: "Unassigned",
    value: "0001-01-01", // Generic date format, go returns this string as the default null date value
  });

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text>Search</Text>
        {!activity ? (
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
                  fetchSearchActivities(text);
                }}
                value={value}
                label={"Activity"}
                mode={"outlined"}
              />
            )}
            name="activity"
          />
        ) : (
          <View style={styles.selectedActivity}>
            <Text variant="titleLarge">{activity.description}</Text>
            <Button onPress={() => setActivity(null)}>
              <Icon source="close" color={MD3Colors.primary50} size={30} />
            </Button>
          </View>
        )}

        {activitySearchResults.length > 0 && !activity && (
          <View style={styles.searchResults}>
            {activitySearchResults.map((result: any, index: number) => (
              <TouchableRipple key={index} rippleColor="rgba(0, 0, 0, .32)">
                <List.Item
                  title={result.description}
                  onPress={() => {
                    setActivity(result);
                  }}
                />
              </TouchableRipple>
            ))}
          </View>
        )}
        {errors.activity && <Text>This is required.</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text className="mb-4">Activity Date</Text>
        <Dropdown
          placeholder="Select A Date"
          options={tripDates}
          selectedValue={selectedDate}
          onValueChange={(value) => {
            setSelectedDate(value);
          }}
          primaryColor={"purple"}
        />
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
  selectedActivity: {
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
