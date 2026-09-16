import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import SectionCard from "../components/SectionCard";
import { vitalsApi, environmentApi } from "../lib/apiClient";
import { useDevices } from "../context/DeviceContext";
import { useAppTheme } from "../theme/theme";

export default function HistoryScreen() {
  const theme = useAppTheme();
  const { selectedDeviceId } = useDevices();
  const [vitals, setVitals] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDeviceId) {
      return;
    }

    load();
  }, [selectedDeviceId]);

  async function load() {
    try {
      setLoading(true);

      const [vitalsResponse, environmentResponse] = await Promise.all([
        vitalsApi.history(selectedDeviceId, 24),
        environmentApi.history(selectedDeviceId, 24),
      ]);

      setVitals(
        Array.isArray(vitalsResponse)
          ? vitalsResponse
          : vitalsResponse?.vitals || vitalsResponse?.data || [],
      );

      setEnvironment(
        Array.isArray(environmentResponse)
          ? environmentResponse
          : environmentResponse?.environment || environmentResponse?.data || [],
      );
    } catch (error) {
      console.log("History error:", error);
    } finally {
      setLoading(false);
    }
  }

  function value(item, ...keys) {
    for (const key of keys) {
      if (item?.[key] !== undefined) {
        return item[key];
      }
    }

    return "--";
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader title="History" subtitle="Last 24 hours" />

      <ScrollView contentContainerStyle={styles.container}>
        {loading && <ActivityIndicator color={theme.primary} size="large" />}

        {!selectedDeviceId && (
          <Text
            style={{
              color: theme.secondaryText,
              textAlign: "center",
            }}
          >
            Pair a TrailGuard device first.
          </Text>
        )}

        <SectionCard title="Vitals">
          {vitals.length === 0 ? (
            <Text
              style={{
                color: theme.secondaryText,
              }}
            >
              No historical vitals available.
            </Text>
          ) : (
            vitals
              .slice()
              .reverse()
              .slice(0, 20)
              .map((item, index) => (
                <View
                  key={item._id || index}
                  style={[
                    styles.row,
                    {
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.time,
                      {
                        color: theme.secondaryText,
                      },
                    ]}
                  >
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--"}
                  </Text>

                  <Text style={[styles.metric, { color: theme.text }]}>
                    ❤️ {value(item, "heartRate", "hr")}
                  </Text>

                  <Text style={[styles.metric, { color: theme.text }]}>
                    🫁 {value(item, "spo2", "oxygenSaturation")}
                  </Text>
                </View>
              ))
          )}
        </SectionCard>

        <SectionCard title="Environment">
          {environment.length === 0 ? (
            <Text
              style={{
                color: theme.secondaryText,
              }}
            >
              No environment history available.
            </Text>
          ) : (
            environment
              .slice()
              .reverse()
              .slice(0, 20)
              .map((item, index) => (
                <View
                  key={item._id || index}
                  style={[
                    styles.row,
                    {
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.time,
                      {
                        color: theme.secondaryText,
                      },
                    ]}
                  >
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--"}
                  </Text>

                  <Text style={[styles.metric, { color: theme.text }]}>
                    🌡️ {value(item, "temperature", "temp")}
                    °C
                  </Text>

                  <Text style={[styles.metric, { color: theme.text }]}>
                    💧 {value(item, "humidity")}%
                  </Text>
                </View>
              ))
          )}
        </SectionCard>
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
    paddingBottom: 30,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  time: {
    width: 60,
    fontSize: 11,
  },

  metric: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
});
