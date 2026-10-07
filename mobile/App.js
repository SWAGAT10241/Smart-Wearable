import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { DeviceProvider } from "./src/context/DeviceContext";
import { LiveDataProvider } from "./src/context/LiveDataContext";

import AppNavigator from "./src/navigation/AppNavigator";

function AppContent() {
  const { tokenReady, isAuthenticated } = useAuth();

  return (
    <DeviceProvider
      authReady={tokenReady}
      isAuthenticated={isAuthenticated}
    >
      <LiveDataProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </LiveDataProvider>
    </DeviceProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}