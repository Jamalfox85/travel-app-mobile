import React from "react";
import { StyleSheet, Modal, View } from "react-native";
import { Button } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { Trip } from "@/types";

import AddAccommodation from "@/components/forms/AddAccommodation";

export default function AddAccommodationDrawer({
  isOpen,
  updateVisibility,
  trip,
}: {
  isOpen: boolean;
  updateVisibility: (state: boolean) => void;
  trip: Trip;
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => updateVisibility(false)}
    >
      <View style={styles.drawerContainer}>
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <ThemedText style={styles.header}>
              Add A New Accommodation
            </ThemedText>
            <Button mode="contained" onPress={() => updateVisibility(false)}>
              Close
            </Button>
          </View>
          <AddAccommodation
            trip={trip}
            activityAdded={() => updateVisibility(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  drawer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "75%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
