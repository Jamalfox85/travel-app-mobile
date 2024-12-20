import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trip, Activity, Accommodation } from "@/types";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import call from "react-native-phone-call";
import { Button } from "react-native-paper";
import AddAccommodationDrawer from "@/components/drawers/AddAccommodationDrawer";

interface TripTab {
  name: string;
  date?: string;
  activities?: any[];
  accommodations?: Accommodation[];
}

const triggerCall = (phoneNumber: string) => {
  const args = {
    number: phoneNumber,
    prompt: true,
  };

  call(args).catch(console.error);
};

const openLink = (url: string) => {
  Linking.openURL("https://" + url).catch((err) =>
    console.error("Failed to open URL:", err)
  );
};

const openAddress = (address: string) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${encodeURIComponent(address)}`,
    android: `geo:0,0?q=${encodeURIComponent(address)}`,
  });

  if (!url) {
    return;
  }
  Linking.openURL(url).catch((err: any) =>
    console.error("An error occurred", err)
  );
};

export default function Itinerary({ trip }: { trip: Trip }) {
  const [addAccommodationDrawer, setAddAccommodationDrawer] = useState(false);

  const start = moment(trip.Start_date);
  const end = moment(trip.End_date);
  const numTripDays = end.diff(start, "days") + 1;

  const tripDates: TripTab[] = [];
  for (let i = 0; i < numTripDays; i++) {
    let momentDate = moment(start).add(i, "day");
    let name = momentDate.format("MMM D");
    let date = momentDate.format("dddd MMMM D, YYYY");
    let activities: Activity[] = trip.Activities
      ? trip.Activities.filter((activity) => {
          return (
            moment(activity.Date).format("YYYY-MM-DD") ===
            momentDate.format("YYYY-MM-DD")
          );
        })
      : [];
    let accommodations: Accommodation[] =
      (trip.Accommodations &&
        trip.Accommodations.filter((accommodation) => {
          return (
            moment(accommodation.StartDate).isSameOrBefore(momentDate) &&
            moment(accommodation.EndDate).isSameOrAfter(momentDate)
          );
        })) ||
      [];

    tripDates.push({
      name,
      date,
      activities,
      accommodations,
    });
  }

  // Add Unassigned Tab
  let unscheduledActivities =
    trip.Activities &&
    trip.Activities.filter((activity) => {
      return (
        activity.Date === "0001-01-01" ||
        activity.Date === null ||
        activity.Date === ""
      );
    });

  tripDates.unshift({
    name: "Unscheduled",
    activities: unscheduledActivities,
  });

  const [activeDay, setActiveDay] = React.useState(tripDates[1].name);

  return (
    <View>
      <Tabs
        value={activeDay}
        onValueChange={setActiveDay}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row mb-4">
          <ScrollView horizontal>
            {tripDates.map((date, index) => (
              <TabsTrigger
                key={index}
                value={date.name}
                className={`px-4 ${
                  date.name === activeDay && "border-b-2 border-purple-700"
                }`}
              >
                <Text
                  className={`text-center mb-2 ${
                    date.name == activeDay
                      ? "text-purple-700 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {date.name}
                </Text>
              </TabsTrigger>
            ))}
          </ScrollView>
        </TabsList>

        {tripDates.map((date, index) => (
          <TabsContent key={index} value={date.name}>
            {date.date && (
              <View>
                <View className="bg-purple-100 p-4 border-y-2 border-purple-700 mb-2">
                  <Text className="text-center font-bold text-xl">
                    {date.date}
                  </Text>
                </View>
                <View className=" mb-8">
                  {date.accommodations && date.accommodations.length > 0 ? (
                    date.accommodations.map((accommodation, index) => (
                      <View
                        className="flex-1 flex-row flex-wrap items-center mb-2 bg-orange-200 p-2 rounded-md"
                        key={index}
                      >
                        <Ionicons size={24} name="bed" className="mr-2" />
                        <Text>{accommodation.Title}</Text>
                        <Ionicons
                          size={24}
                          name="information-circle-outline"
                          className="ml-auto"
                        />
                      </View>
                    ))
                  ) : (
                    <View className="flex-1 flex-row flex-wrap items-center">
                      <Ionicons size={24} name="alert-outline" />
                      <Text className="text-red-500 font-bold">
                        You haven't added a stay for this day yet!
                      </Text>
                      <Ionicons
                        size={24}
                        name="add-circle-outline"
                        className="ml-auto"
                        onPress={() => setAddAccommodationDrawer(true)}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
            {date.activities &&
              date.activities.map((activity, index) => (
                <Collapsible key={index} className="mb-4">
                  <CollapsibleTrigger>
                    <View className="flex-row mb-2">
                      <Text className="mr-4 text-xl">#{index + 1}</Text>
                      <Text className="font-bold text-xl">
                        {activity.Title}
                      </Text>
                    </View>
                    <View className="flex-row mb-2 pl-8">
                      <View className="flex-row items-center">
                        <Ionicons size={16} name="star" className="mr-1" />
                        <Text>{activity.Rating}</Text>
                      </View>
                      <Text className="mx-2">•</Text>
                      <View className="flex-row items-center">
                        <Text className="mr-1">Price:</Text>
                        {Array(activity.Price)
                          .fill("$")
                          .map((dollar, index) => (
                            <Text
                              key={`active-${index}`}
                              style={{ color: "green" }}
                            >
                              {dollar}
                            </Text>
                          ))}
                        {Array(5 - activity.Price)
                          .fill("$")
                          .map((dollar, index) => (
                            <Text
                              key={`gray-${index}`}
                              style={{ color: "#D3D3D3" }}
                            >
                              {dollar}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <View className="pl-8 mt-2">
                      {activity.Url && (
                        <TouchableOpacity
                          className="flex-row items-center mb-2"
                          onPress={() => {
                            openLink(activity.Url);
                          }}
                        >
                          <Ionicons size={16} name="link" className="mr-1" />
                          <Text>{activity.Url}</Text>
                        </TouchableOpacity>
                      )}
                      {activity.Address && (
                        <TouchableOpacity
                          className="flex-row items-center mb-2"
                          onPress={() => {
                            openAddress(activity.Address);
                          }}
                        >
                          <Ionicons
                            size={16}
                            name="navigate"
                            className="mr-1"
                          />
                          <Text>{activity.Address}</Text>
                        </TouchableOpacity>
                      )}
                      {activity.Phone && (
                        <TouchableOpacity
                          className="flex-row items-center mb-2"
                          onPress={() => {
                            triggerCall(activity.Phone);
                          }}
                        >
                          <Ionicons size={16} name="call" className="mr-1" />
                          <Text>{activity.Phone}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      <AddAccommodationDrawer
        isOpen={addAccommodationDrawer}
        updateVisibility={(state) => setAddAccommodationDrawer(state)}
        trip={trip}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
