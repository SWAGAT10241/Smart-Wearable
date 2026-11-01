import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { useAppTheme } from "../theme/theme";
import { useHistoryData } from "../hooks/useHistoryData";
import { formatReadingValue } from "../utils/formatters";
import {
  HeartIcon,
  OxygenIcon,
  ThermometerIcon,
  DropletIcon,
  PressureIcon,
} from "../components/Icons";

const TIME_RANGES = [
  { label: "1h", hours: 1 },
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
];

/**
 * Historical telemetry viewer with range filtering and summary metrics.
 */
export default function HistoryScreen({ navigation }) {
  const theme = useAppTheme();
  const { user } = useAuth();
  const { selectedDeviceId } = useDevices();
  const [selectedHours, setSelectedHours] = useState(24);
  const { vitals, environment, loading, error, refresh } = useHistoryData(selectedHours);

  // Compute summary averages
  const summary = useMemo(() => {
    const validHR = vitals
      .map((r) => Number(r.heartRate ?? r.hr))
      .filter((n) => Number.isFinite(n) && n > 0);
    const validSpO2 = vitals
      .map((r) => Number(r.spo2 ?? r.oxygen))
      .filter((n) => Number.isFinite(n) && n > 0);
    const validTemp = environment
      .map((r) => Number(r.temperature))
      .filter((n) => Number.isFinite(n));

    const avg = (arr) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : "--";

    return {
      avgHR: avg(validHR),
      avgSpO2: avg(validSpO2),
      avgTemp: validTemp.length
        ? (validTemp.reduce((a, b) => a + b, 0) / validTemp.length).toFixed(1)
        : "--",
    };
  }, [vitals, environment]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader
        title="History"
        subtitle={`Past ${selectedHours}h telemetry logs`}
        onNotification={() => navigation.navigate("Alerts")}
        onProfile={() => navigation.navigate("Profile")}
        user={user}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {/* Time Range Filter Pills */}
        <View style={styles.rangeBar}>
          {TIME_RANGES.map((item) => {
            const active = selectedHours === item.hours;
            return (
              <TouchableOpacity
                key={item.hours}
                style={[
                  styles.rangePill,
                  {
                    backgroundColor: active ? theme.primary : theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedHours(item.hours)}
              >
                <Text
                  style={[
                    styles.rangeText,
                    {
                      color: active ? "#fff" : theme.secondaryText,
                      fontWeight: active ? "700" : "500",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Summary Strip */}
        <View style={styles.summaryGrid}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>
              Avg Heart Rate
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {summary.avgHR} <Text style={styles.summaryUnit}>BPM</Text>
            </Text>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>
              Avg Blood Oxygen
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {summary.avgSpO2} <Text style={styles.summaryUnit}>%</Text>
            </Text>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>
              Avg Temp
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {summary.avgTemp} <Text style={styles.summaryUnit}>°C</Text>
            </Text>
          </View>
        </View>

        {loading && <ActivityIndicator color={theme.primary} size="large" style={{ marginVertical: 16 }} />}

        {error && (
          <Text style={[styles.errorText, { color: theme.danger || "#EF4444" }]}>
            {error}
          </Text>
        )}

        {!selectedDeviceId && (
          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
            Pair a TrailGuard device in Settings to view history.
          </Text>
        )}

        {/* Vitals Feed */}
        <SectionCard title="Vitals Telemetry">
          {vitals.length === 0 ? (
            <Text style={{ color: theme.secondaryText, paddingVertical: 10 }}>
              No historical vitals recorded in this window.
            </Text>
          ) : (
            vitals
              .slice()
              .reverse()
              .slice(0, 25)
              .map((reading, index) => {
                const date = reading.timestamp
                  ? new Date(reading.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--";

                return (
                  <View
                    key={reading._id || reading.id || index}
                    style={[styles.historyRow, { borderBottomColor: theme.border }]}
                  >
                    <View style={styles.timeTag}>
                      <Text style={[styles.timeText, { color: theme.secondaryText }]}>
                        {date}
                      </Text>
                    </View>

                    <View style={styles.metricsGroup}>
                      <View style={styles.metricBadge}>
                        <HeartIcon size={13} color={theme.danger || "#EF4444"} />
                        <Text style={[styles.metricText, { color: theme.text }]}>
                          {formatReadingValue(reading.heartRate ?? reading.hr, 0)} BPM
                        </Text>
                      </View>

                      <View style={styles.metricBadge}>
                        <OxygenIcon size={13} color={theme.blue || "#3B82F6"} />
                        <Text style={[styles.metricText, { color: theme.text }]}>
                          {formatReadingValue(reading.spo2 ?? reading.oxygen, 0)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
          )}
        </SectionCard>

        {/* Environment Feed */}
        <SectionCard title="Environment Telemetry">
          {environment.length === 0 ? (
            <Text style={{ color: theme.secondaryText, paddingVertical: 10 }}>
              No environment readings recorded in this window.
            </Text>
          ) : (
            environment
              .slice()
              .reverse()
              .slice(0, 25)
              .map((reading, index) => {
                const date = reading.timestamp
                  ? new Date(reading.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--";

                return (
                  <View
                    key={reading._id || reading.id || index}
                    style={[styles.historyRow, { borderBottomColor: theme.border }]}
                  >
                    <View style={styles.timeTag}>
                      <Text style={[styles.timeText, { color: theme.secondaryText }]}>
                        {date}
                      </Text>
                    </View>

                    <View style={styles.metricsGroup}>
                      <View style={styles.metricBadge}>
                        <ThermometerIcon size={13} color={theme.warning || "#F59E0B"} />
                        <Text style={[styles.envText, { color: theme.text }]}>
                          {formatReadingValue(reading.temperature, 1)}°C
                        </Text>
                      </View>

                      <View style={styles.metricBadge}>
                        <DropletIcon size={13} color={theme.primary || "#06B6D4"} />
                        <Text style={[styles.envText, { color: theme.text }]}>
                          {formatReadingValue(reading.humidity, 0)}%
                        </Text>
                      </View>

                      <View style={styles.metricBadge}>
                        <PressureIcon size={13} color={theme.purple || "#8B5CF6"} />
                        <Text style={[styles.envText, { color: theme.text }]}>
                          {formatReadingValue(reading.pressure, 0)} hPa
                        </Text>
                      </View>
                    </View>
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
  rangeBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  rangePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rangeText: {
    fontSize: 13,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: "800",
  },
  summaryUnit: {
    fontSize: 11,
    fontWeight: "500",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  timeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  metricsGroup: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  metricBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 13,
    fontWeight: "700",
  },
  envText: {
    fontSize: 12,
    fontWeight: "600",
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
