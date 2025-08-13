import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";

import HomeScreen from "./HomeScreen";
import HighlightDetailsScreen from "./highlights/HighlightDetailScreen";
import HighlightsListScreen from "./highlights/HighlightsListScreen";
import WebViewScreen from "./rewards/WebViewScreen";
import { store } from "./store/store";

export type RootStackParamList = {
  Home: undefined;
  HighlightsList: undefined;
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
  WebView: {
    title?: string;
    accessToken?: string; // may include leading "Bearer "
    refreshToken?: string; // may include leading "Bearer "
    appId?: string;
    policyNo?: string;
    sourceAppId?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="HighlightsList"
            component={HighlightsListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Highlight" component={HighlightDetailsScreen} />
          <Stack.Screen
            name="WebView"
            component={WebViewScreen}
            options={{ title: "Enjoy" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
