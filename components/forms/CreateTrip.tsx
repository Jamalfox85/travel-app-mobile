import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Button, List, TouchableRipple, Text, Icon, MD3Colors, RadioButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import debounce from "lodash.debounce";
import { GOOGLE_PLACES_API_KEY } from "@env";
import { start } from "repl";
import moment from "moment";
import { Toast } from "toastify-react-native";
import { TravelApiCall } from "@/services/ApiService";

interface SearchResult {
  description: string;
  place_id: string;
}

export default function CreateTrip({ tripCreated }: { tripCreated: () => void }) {
  const [location, setLocation] = useState<SearchResult | null>();
  const [locationSearchResults, setLocationSearchResults] = useState<any>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [photoOptions, setPhotoOptions] = useState<any>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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

  const onFormSubmit = async (data: any) => {
    try {
      await TravelApiCall("/trips", "POST", {
        title: data.title,
        location: data.location,
        userId: 1,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
        place_id: location?.place_id,
        photo_uri: selectedPhoto,
      });
      tripCreated();
      Toast.success("Trip Created Successfully!");
    } catch (error) {
      Toast.error("Failed to create trip. Please try again later.");
    }
  };

  const fetchSearchLocations = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 3) {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`);
        const data = await response.json();
        setLocationSearchResults(data.predictions);
      } else {
        setLocationSearchResults([]);
      }
    }, 500),
    []
  );

  const fetchPhotoOptions = async (placeId: string) => {
    const placeDetailsResponse = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_PLACES_API_KEY}`);
    const placeDetailsData = await placeDetailsResponse.json();
    const photoReferenceIds = await placeDetailsData.result?.photos.map((photo: any) => photo.photo_reference);

    const photoOptions = await Promise.all(
      photoReferenceIds.map(async (photoReference: string) => {
        const placePhotosResponse = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`);
        return placePhotosResponse.url;
      })
    );
    setPhotoOptions(photoOptions);
  };

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
            <Text variant="titleLarge">{location.description}</Text>
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
                    fetchPhotoOptions(result.place_id);
                  }}
                />
              </TouchableRipple>
            ))}
          </View>
        )}
        {errors.location && <Text>This is required.</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text>Trip Title</Text>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => <TextInput onBlur={onBlur} onChangeText={onChange} value={value} label={"Trip Title (Optional)"} mode={"outlined"} />}
          name="title"
        />
      </View>

      {location && photoOptions.length > 0 && (
        <View style={styles.inputGroup}>
          <Text>Photo</Text>
          <View style={styles.imagesContainer}>
            <RadioButton.Group onValueChange={(image: string) => setSelectedPhoto(image)} value={selectedPhoto}>
              <View style={styles.imagesContainer}>
                {photoOptions.slice(0, 3).map((photo: string, index: number) => (
                  <TouchableOpacity key={index} onPress={() => setSelectedPhoto(photo)}>
                    <Image source={{ uri: photo }} style={[styles.imageOption, photo == selectedPhoto && styles.activeImageOption]} />
                    <RadioButton value={photo} color="transparent" />
                  </TouchableOpacity>
                ))}
              </View>
            </RadioButton.Group>
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text>Trip Dates</Text>
        <View style={styles.datesContainer}>
          <Button>
            <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />
          </Button>
          <Text> - </Text>
          <Button>
            <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />
          </Button>
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
