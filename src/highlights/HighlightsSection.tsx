import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HighlightCard from "./HighlightCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchActiveAnnouncements,
  clearError,
} from "../store/slices/announcementsSlice";
import {
  selectActiveAnnouncements,
  selectAnnouncementsLoading,
  selectAnnouncementsError,
} from "../store/selectors/announcementsSelectors";

export type RootStackParamList = {
  Home: undefined;
  Highlight: {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    subtitle: string;
    summary: string;
    measures?: string[];
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const HighlightsSection = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  // Get state from Redux store using selectors
  const activeAnnouncements = useAppSelector(selectActiveAnnouncements);
  const loading = useAppSelector(selectAnnouncementsLoading);
  const error = useAppSelector(selectAnnouncementsError);

  useEffect(() => {
    // Dispatch async thunk to fetch active announcements
    dispatch(fetchActiveAnnouncements());

    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 8, color: "#666" }}>
          Loading highlights...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ color: "#ff0000", textAlign: "center" }}>
          Error loading highlights: {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
    >
      {activeAnnouncements.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => {
            // console.log("Highlight card pressed:", item.title);
            // console.log("Navigation object:", navigation);
            // console.log("Navigating to Highlight with params:", {
            //   id: item.id,
            //   title: item.title,
            //   description: item.description,
            //   image: item.image,
            // });
            navigation.navigate("Highlight", {
              id: item.id,
              title: item.title,
              description: item.description,
              image: item.image,
              date: new Date(item.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              subtitle: item.title,
              summary: item.description,
            });
          }}
        >
          <HighlightCard imageSource={{ uri: item.image }} title={item.title} />
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default HighlightsSection;
