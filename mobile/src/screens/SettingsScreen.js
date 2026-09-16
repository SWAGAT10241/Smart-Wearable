import React, { useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import SectionCard from "../components/SectionCard";

import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { useAppTheme } from "../theme/theme";

export default function SettingsScreen() {
  const theme = useAppTheme();

  const { user, logout } = useAuth();

  const {
    devices,
    selectedDevice,
    registerDevice,
    renameDevice,
    removeDevice,
  } = useDevices();

  const [deviceId, setDeviceId] = useState("");

  const [deviceName, setDeviceName] = useState("");

  async function pair() {
    if (!deviceId.trim()) {
      Alert.alert("Device ID required", "Enter your TrailGuard device ID.");
      return;
    }

    try {
      await registerDevice(deviceId, deviceName || "TrailGuard Wearable");

      setDeviceId("");
      setDeviceName("");

      Alert.alert("Success", "TrailGuard device paired.");
    } catch (error) {
      Alert.alert("Pairing failed", error.message);
    }
  }

  function unpair() {
    if (!selectedDevice) {
      return;
    }

    Alert.alert(
      "Unpair device",
      `Unpair ${selectedDevice.deviceName || "TrailGuard"}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unpair",
          style: "destructive",
          onPress: async () => {
            try {
              await removeDevice(selectedDevice.deviceId);
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  }

  function rename() {
    if (!selectedDevice) {
      return;
    }

    Alert.prompt("Rename device", "Enter a new device name.", async (name) => {
      if (!name?.trim()) {
        return;
      }

      try {
        await renameDevice(selectedDevice.deviceId, name);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader title="Settings" subtitle="Account & devices" />

      <ScrollView contentContainerStyle={styles.container}>
        <SectionCard title="Profile">
          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Username
          </Text>

          <Text style={[styles.value, { color: theme.text }]}>
            {user?.username || "--"}
          </Text>

          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Email
          </Text>

          <Text style={[styles.value, { color: theme.text }]}>
            {user?.email || "--"}
          </Text>
        </SectionCard>

        <SectionCard title="TrailGuard Device">
          {selectedDevice ? (
            <>
              <View style={styles.deviceRow}>
                <View>
                  <Text style={[styles.value, { color: theme.text }]}>
                    {selectedDevice.deviceName || "TrailGuard Wearable"}
                  </Text>

                  <Text
                    style={[
                      styles.id,
                      {
                        color: theme.secondaryText,
                      },
                    ]}
                  >
                    {selectedDevice.deviceId}
                  </Text>
                </View>

                <Text
                  style={{
                    color: theme.success,
                    fontWeight: "800",
                  }}
                >
                  ACTIVE
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: theme.border,
                  },
                ]}
                onPress={rename}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                  }}
                >
                  Rename Device
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  {
                    borderColor: theme.danger,
                  },
                ]}
                onPress={unpair}
              >
                <Text
                  style={{
                    color: theme.danger,
                    fontWeight: "700",
                  }}
                >
                  Unpair Device
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.info,
                  {
                    color: theme.secondaryText,
                  },
                ]}
              >
                Pair your TrailGuard wearable using its device ID.
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Device ID"
                placeholderTextColor={theme.secondaryText}
                value={deviceId}
                onChangeText={setDeviceId}
                autoCapitalize="characters"
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Device name"
                placeholderTextColor={theme.secondaryText}
                value={deviceName}
                onChangeText={setDeviceName}
              />

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
                onPress={pair}
              >
                <Text style={styles.primaryText}>Pair TrailGuard</Text>
              </TouchableOpacity>
            </>
          )}
        </SectionCard>

        <SectionCard title="Paired Devices">
          {devices.length === 0 ? (
            <Text
              style={{
                color: theme.secondaryText,
              }}
            >
              No devices.
            </Text>
          ) : (
            devices.map((device) => (
              <View key={device.deviceId} style={styles.deviceListRow}>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                  }}
                >
                  {device.deviceName || "TrailGuard Wearable"}
                </Text>

                <Text
                  style={{
                    color: theme.secondaryText,
                    fontSize: 11,
                  }}
                >
                  {device.deviceId}
                </Text>
              </View>
            ))
          )}
        </SectionCard>

        <TouchableOpacity
          style={[styles.logout, { borderColor: theme.danger }]}
          onPress={() =>
            Alert.alert("Sign out", "Are you sure?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Sign out",
                style: "destructive",
                onPress: logout,
              },
            ])
          }
        >
          <Text
            style={{
              color: theme.danger,
              fontWeight: "800",
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  label: {
    fontSize: 11,
    marginTop: 7,
  },

  value: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },

  id: {
    fontSize: 11,
    marginTop: 4,
  },

  info: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  primaryButton: {
    height: 52,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "800",
  },

  secondaryButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  dangerButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deviceListRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logout: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
