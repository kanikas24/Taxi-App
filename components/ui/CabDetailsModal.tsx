import React from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CabDataType } from "./CabSelectionModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  cab?: CabDataType;
}

export const CabDetailsModal = ({ visible, onClose, cab }: Props) => {
  if (!cab) return null;
  console.log("visible", visible, onClose,cab );
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Image */}
          {cab.imageUrl && (
            <Image source={{ uri: cab.imageUrl }} style={styles.image} />
          )}

          <Text style={styles.title}>{cab.title}</Text>
          <Text style={styles.desc}>{cab.description}</Text>

          <Text style={styles.meta}>👥 Capacity: {cab.capacity}</Text>
          <Text style={styles.meta}>🧳 Luggage: {cab.luggage}</Text>
          <Text style={styles.meta}>⚡ Fuel: {cab.fuelType}</Text>
          <Text style={styles.meta}>🕒 ETA: {cab.estimatedArrival}</Text>
          <Text style={styles.meta}>💰 Price: {cab.price}</Text>

          <Pressable style={styles.bookButton} onPress={() => {
            // Handle actual booking logic
            onClose();
            alert("Ride booked!");
          }}>
            <Text style={styles.bookText}>Book Ride</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: "#FFB300",
    fontWeight: "bold",
  },
  desc: {
    color: "#ccc",
    marginBottom: 10,
    textAlign: "center",
  },
  meta: {
    color: "#aaa",
    marginVertical: 2,
    fontSize: 14,
  },
  bookButton: {
    marginTop: 20,
    backgroundColor: "#FFB300",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  bookText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
  },
  closeText: {
    color: "#999",
    fontSize: 14,
  },
});
