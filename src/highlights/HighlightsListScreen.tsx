import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchActiveAnnouncements } from "../store/slices/announcementsSlice";
import {
  selectActiveAnnouncements,
  selectAnnouncementsLoading,
} from "../store/selectors/announcementsSelectors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HighlightsListScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const activeAnnouncements = useAppSelector(selectActiveAnnouncements);
  const loading = useAppSelector(selectAnnouncementsLoading);

  useEffect(() => {
    dispatch(fetchActiveAnnouncements());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const renderHighlightItem = ({ item }: any) => {
    // Extract content from first <p> tag only
    const getFirstParagraph = (html: string) => {
      const pTagMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
      if (pTagMatch && pTagMatch[1]) {
        // Remove any remaining HTML tags from the paragraph content
        return pTagMatch[1].replace(/<[^>]*>/g, "").trim();
      }
      // Fallback: if no <p> tag found, clean the entire text and take first sentence
      return (
        html
          .replace(/<[^>]*>/g, "")
          .split(".")[0]
          .trim() + (html.includes(".") ? "." : "")
      );
    };

    return (
      <Pressable
        style={styles.highlightItem}
        onPress={() =>
          navigation.navigate("Highlight", {
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
            date: formatDate(item.createdAt),
            subtitle: item.title,
            summary: item.description,
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.highlightImage} />
        <View style={styles.highlightContent}>
          <View style={styles.titleRow}>
            <Text
              style={styles.highlightTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text style={styles.highlightDate}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <Text
            style={styles.highlightDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {getFirstParagraph(item.description)}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>Highlights</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Highlights</Text>
      </View>

      <FlatList
        data={activeAnnouncements}
        renderItem={renderHighlightItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Offset for back button to center the title
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  highlightItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  highlightImage: {
    width: 100,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: "cover",
  },
  highlightContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  highlightDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    flex: 1,
  },
  highlightDate: {
    fontSize: 12,
    color: "#999",
    fontWeight: "400",
  },
});
