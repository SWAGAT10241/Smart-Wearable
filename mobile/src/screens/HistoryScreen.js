import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import SectionCard from "../components/SectionCard";
import { useDevices } from "../context/DeviceContext";
import { useAppTheme } from "../theme/theme";
import { useHistoryData } from "../hooks/useHistoryData";
import { formatReadingValue } from "../utils/formatters";

/**
 * 24-hour historical telemetry viewer for Mobile.
 */
export default function HistoryScreen() {
  const theme = useAppTheme();
  const { selectedDeviceId } = useDevices();
  const { vitals, environment, loading, error, refresh } = useHistoryData(24);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader title="History" subtitle="Last 24 hours" />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {loading && <ActivityIndicator color={theme.primary} size="large" />}

        {error && (
          <Text style={[styles.errorText, { color: theme.danger || "#EF4444" }]}>
            {error}
          </Text>
        )}

        {!selectedDeviceId && (
          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
            Pair a TrailGuard device first.
          </Text>
        )}

        <SectionCard title="Vitals">
          {vitals.length === 0 ? (
            <Text style={{ color: theme.secondaryText }}>
              No historical vitals available.
            </Text>
          ) : (
            vitals
              .slice()
              .reverse()
              .slice(0, 20)
              .map((reading, index) => {
                const date = reading.timestamp
                  ? new Date(reading.timestamp).toLocaleTimeString()
                  : "--";

                return (
                  <View
                    key={reading._id || reading.id || index}
                    style={styles.historyRow}
                  >
                    <Text style={{ color: theme.secondaryText }}>{date}</Text>

                    <Text style={{ color: theme.text, fontWeight: "600" }}>
                      HR: {formatReadingValue(reading.heartRate ?? reading.hr, 0)} BPM | SpO2:{" "}
                      {formatReadingValue(reading.spo2 ?? reading.oxygen, 0)}%
                    </Text>
                  </View>
                );
              })
          )}
        </SectionCard>

        <SectionCard title="Environment">
          {environment.length === 0 ? (
            <Text style={{ color: theme.secondaryText }}>
              No historical environment readings available.
            </Text>
          ) : (
            environment
              .slice()
              .reverse()
              .slice(0, 20)
              .map((reading, index) => {
                const date = reading.timestamp
                  ? new Date(reading.timestamp).toLocaleTimeString()
                  : "--";

                return (
                  <View
                    key={reading._id || reading.id || index}
                    style={styles.historyRow}
                  >
                    <Text style={{ color: theme.secondaryText }}>{date}</Text>

                    <Text style={{ color: theme.text, fontWeight: "600" }}>
                      {formatReadingValue(reading.temperature, 1)}°C |{" "}
                      {formatReadingValue(reading.humidity, 0)}% |{" "}
                      {formatReadingValue(reading.pressure, 0)} hPa
                    </Text>
                  </View>
                );
              })
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
    paddingBottom: 40,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 13,
  },
});
