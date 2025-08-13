import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Linking,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { RouteProp } from "@react-navigation/native";

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

type HighlightDetailsScreenProps = {
  route: RouteProp<RootStackParamList, "Highlight">;
};

const HighlightDetailsScreen: React.FC<HighlightDetailsScreenProps> = ({
  route,
}) => {
  // console.log("HighlightDetailScreen rendered with params:", route.params);

  const { id, title, description, image, date, subtitle, summary, measures } =
    route.params;

  const { width } = useWindowDimensions();

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>

        {/* Render HTML content with proper formatting */}
        <RenderHtml
          contentWidth={width - 32} // Account for padding
          source={{ html: description }}
          tagsStyles={{
            p: { fontSize: 14, lineHeight: 20, color: "#555" },
            strong: { fontWeight: "bold", color: "#727372" },
            em: { fontStyle: "italic" },
            li: { fontSize: 14, color: "#555", marginBottom: 4 },
            ul: { paddingLeft: 16 },
            ol: { paddingLeft: 16 },
            h1: {
              fontSize: 18,
              fontWeight: "bold",
              color: "#222",
              marginBottom: 8,
            },
            h2: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#222",
              marginBottom: 6,
            },
            h3: {
              fontSize: 15,
              fontWeight: "bold",
              color: "#222",
              marginBottom: 4,
            },
            table: { marginBottom: 12 },
            th: {
              fontWeight: "bold",
              padding: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            },
            td: { padding: 8, borderWidth: 1, borderColor: "#ddd" },
            a: {
              color: "#0A84FF",
              textDecorationLine: "underline",
              fontStyle: "italic",
            },
          }}
          renderersProps={{
            a: {
              onPress: (_event: any, href?: string) => {
                if (!href) return;
                const normalized = href.startsWith("http")
                  ? href
                  : `https://${href.replace(/^\/\//, "")}`;
                Linking.openURL(normalized).catch(() => {});
              },
            },
          }}
        />

        {measures && measures.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Preventive Measures:</Text>
            {measures.map((item: string, index: number) => (
              <Text key={index} style={styles.measure}>
                {index + 1}. {item}
              </Text>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginVertical: 6,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#222",
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  measure: {
    fontSize: 14,
    marginTop: 2,
    color: "#444",
  },
});

export default HighlightDetailsScreen;
