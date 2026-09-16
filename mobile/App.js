import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import { DeviceProvider } from "./src/context/DeviceContext";
import { LiveDataProvider } from "./src/context/LiveDataContext";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DeviceProvider>
          <LiveDataProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </LiveDataProvider>
        </DeviceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
