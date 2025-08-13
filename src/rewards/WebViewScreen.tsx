import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";
import { ACCESS_TOKEN, REFRESH_TOKEN, UAT_URL, REG_URL } from "./rewardToken";

const WebViewScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const baseUrl = UAT_URL; // UAT Smile URL
  const baseUrl_reg = REG_URL; // Regional Etiqa+ URL

  const injectedJavaScript = () => {
    const jsonValue = JSON.stringify({
      accessToken: ACCESS_TOKEN || "",
      refreshToken: REFRESH_TOKEN || "",
    });

    const escapedValue = jsonValue
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");

    return `(function() {
    try {
      localStorage.setItem('session', '${escapedValue}');
      sessionStorage.setItem('session', '${escapedValue}');
    } catch (e) {
      window.ReactNativeWebView?.postMessage("Injection error: " + e.message);
    }
    return true;
  })();`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        // Attach Authorization header if the entry page is protected
        source={{ uri: baseUrl }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript()}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        useWebKit={false}
        automaticallyAdjustContentInsets={true}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        // CORS and Security Settings >>
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility" // Allow mixed content
        allowsFullscreenVideo={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  webview: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default WebViewScreen;
