import React from 'react';
import { SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// Load the existing web app to mirror exact UI & design.
// Change this URL if you want to point to a local dev server or hosted build.
const WEB_URL = Platform.select({
  android: 'https://localhost:53000',
  ios: 'https://localhost:53000',
  default: 'https://localhost:53000'
});

export default function WebApp() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: WEB_URL! }}
        originWhitelist={["*"]}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        injectedJavaScriptBeforeContentLoaded={"window.isNativeApp = true; true;"}
      />
    </SafeAreaView>
  );
}
