import { CabDetailsModal } from "@/components/ui/CabDetailsModal";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CabDataType, CabTypeModal } from "../../components/ui/CabSelectionModal";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedCab, setSelectedCab] = useState<CabDataType>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f4f7" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f4f7" />

      <View style={styles.introContainer}>
        <LottieView
          source={require("../../assets/animations/Service.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.introTitle}>Wondering, if I’m the right fit for your team?</Text>
        <Text style={styles.introSub}>
          Let me show you some smart thinking with this intuitive ride-booking flow.
        </Text>

        <View style={styles.ctaGroup}>
          <Pressable style={styles.ctaButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.ctaText}>Explore Cabs</Text>
          </Pressable>

          <Pressable
            style={[styles.ctaButton, styles.hireButton]}
            // onPress={() => Alert.alert("Hire Me", "Let's talk! 📬")}
            onPress={() =>
              Alert.alert("Thanks 😁", "Still Check out the assignment — I put in the work!")
            }
          >
            <Text style={[styles.ctaText, { color: "#fff" }]}>Hire Me Now</Text>
          </Pressable>
        </View>
      </View>

      <CabTypeModal
        visible={modalVisible}
        onSelect={(cab) => {
          setModalVisible(false);
          if (cab) {
            setSelectedCab(cab);
            setBookingModalVisible(true);
          }
        }}
      />
      <CabDetailsModal
        visible={bookingModalVisible}
        cab={selectedCab}
        onClose={() => setBookingModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
    textAlign: "center",
  },
  introSub: {
    fontSize: 16,
    color: "#5c6b73",
    textAlign: "center",
    marginBottom: 30,
  },
  ctaGroup: {
    flexDirection: "row",
    gap: 12,
  },
  ctaButton: {
    backgroundColor: "#FFB300",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  hireButton: {
    backgroundColor: "#2c3e50",
  },
  ctaText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#121212",
  },
});
