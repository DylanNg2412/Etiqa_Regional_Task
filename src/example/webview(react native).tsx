import React, { FC, useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import CustomText from "../../../../../../components/CustomText";
import Colors from "../../../../../../utils/Colors";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  BackHandler,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  WebViewNavigation,
  WebViewProgressEvent,
} from "react-native-webview/lib/WebViewTypes";
import * as policySelectors from "../../../../../../redux/selectors-MY/policySelector";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/store";
import * as selectors from "../../../../../../redux/selectors-MY";
import * as userDetailsSelector from "../../../../../../redux/selectors-MY/userDetailsSelector";
import Constants from "../../../../../../utils/Constants";
import { clsClientDetailRequest } from "../../../../../../redux/slice/LifePolicyServicingSlice";
import AuthManager from "../../../../../../utils/AuthManager";

export const PolicyLifeUpdateContact: FC = function PolicyLifeUpdateContact(
  _props
) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const webviewRef = useRef();
  const { navigation, route } = _props;

  const authToken = useAppSelector((store) => selectors.getAuthToken(store));
  const refreshToken = useAppSelector((store) =>
    selectors.getRefreshToken(store)
  );
  const userProfile = useAppSelector((store) =>
    selectors.getUserDetailsData(store)
  );
  const identityNo: string =
    userDetailsSelector.getUserDetailsIdNo(userProfile);

  // Get selected policy from navigation params
  const summaryInquiryData = route?.params?.summaryInquiryData;
  const policyNumber = policySelectors.getPolicyNum(summaryInquiryData);

  const baseUrl = "https://smile-uat.etiqa.com.my/enjoy";

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to go back? Your progress will be lost.",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => navigation.goBack() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Handle WebView Load Start
  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  // Handle WebView Load Progress
  const handleLoadProgress = (event: WebViewProgressEvent) => {
    const progressValue = event.nativeEvent.progress;
    setProgress(progressValue);
    // Ensure progress reaches 100%
    if (progressValue >= 1) {
      setLoading(false);
    }
  };

  const handleLoadEnd = () => {
    setProgress(1);
    setTimeout(() => setLoading(false), 500);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setError(nativeEvent.description || "An error occurred while loading");
    setLoading(false);
    setProgress(1);
  };

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    // console.log('navigationStateChange', navState);
    // webviewRef.current?.injectJavaScript(injectedJavaScript());

    // Listen for specific path changes
    if (url.includes("/completed")) {
      const postBody = {
        policyNo: policyNumber,
      };
      dispatch(clsClientDetailRequest(postBody));
      navigation.goBack();
    } else if (url.includes("/close")) {
      navigation.goBack();
    }

    return true;
  };

  // important
  const injectedJavaScript = () => {
    const authToken =
      "accessToken";
    const refreshToken =
      "refreshToken";

    const jsonValue = JSON.stringify({
      accessToken: authToken || "",
      refreshToken: refreshToken || "",
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {(loading || error) && (
          <View style={styles.loadingContainer}>
            {loading && (
              <>
                <ActivityIndicator size="large" color={Colors.lightGrey} />
                <CustomText>Loading {Math.round(progress * 100)}%</CustomText>
              </>
            )}
            {error && <CustomText style={styles.errorText}>{error}</CustomText>}
          </View>
        )}
        <WebView
          originWhitelist={["*"]}
          source={{ uri: baseUrl }}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScript()}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onNavigationStateChange={onNavigationStateChange}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
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
    backgroundColor: Colors.whiteColor,
  },
});

export default PolicyLifeUpdateContact;
