import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React from "react";
import HighlightsSection from "./highlights/HighlightsSection";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Explore our services at the top */}
        <View style={styles.servicesSection}>
          <Text style={styles.title2}>Explore our services</Text>
          <View style={styles.servicesRow}>
            <Pressable
              onPress={() =>
                navigation.navigate("WebView", {
                  title: "Enjoy",
                })
              }
              style={styles.serviceItem}
            >
              <View style={styles.serviceIcon}>
                <AntDesign name="gift" size={24} color="black" />
              </View>
              <Text style={styles.serviceLabel}>Enjoy</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.highlightsContainer}>
          <Pressable
            onPress={() => navigation.navigate("HighlightsList")}
            style={styles.titleContainer}
          >
            <View style={styles.titleRow}>
              <Text style={styles.title}>Highlights</Text>
              <Entypo name="chevron-right" size={18} color="black" />
            </View>
          </Pressable>

          <HighlightsSection />
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  // Explore services styles
  servicesSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  servicesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 20,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: "#FFF4CC",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  serviceEmoji: {
    fontSize: 28,
  },
  serviceLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  title2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
    marginBottom: 12,
  },
  spacer: {
    flex: 1,
  },
  highlightsContainer: {
    paddingBottom: 10,
  },
});
