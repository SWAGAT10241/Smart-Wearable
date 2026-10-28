import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import StatCard from "../components/StatCard";
import DeviceCard from "../components/DeviceCard";
import SectionCard from "../components/SectionCard";
import AlertCard from "../components/AlertCard";

import { useDashboardData } from "../hooks/useDashboardData";
import { useAppTheme } from "../theme/theme";

/**
 * Main dashboard screen on mobile companion app.
 * Displays live wearable status, health metrics, environment stats, and recent safety alerts.
 */
export default function DashboardScreen() {
  const theme = useAppTheme();
  const {
    user,
    selectedDevice,
    location,
    recentFalls,
    connected,
    loading,
    refresh,
    metrics,
    statuses,
  } = useDashboardData();

  const { heartRate, spo2, temperature, humidity, pressure } = metrics;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader
        title="TrailGuard"
        subtitle={`Hello, ${user?.username || "Explorer"}`}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <View
          style={[
            styles.connection,
            {
              backgroundColor: connected ? theme.primaryLight : theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.connectionDot,
              {
                backgroundColor: connected ? theme.success : theme.warning,
              },
            ]}
          />

          <Text
            style={{
              color: theme.text,
              fontWeight: "700",
            }}
          >
            {connected ? "Live connection active" : "Using latest server data"}
          </Text>
        </View>

        <DeviceCard device={selectedDevice} />

        <Text style={[styles.heading, { color: theme.text }]}>
          Health & Environment
        </Text>

        <View style={styles.grid}>
          <StatCard
            title="Heart Rate"
            value={heartRate}
            unit="BPM"
            icon="❤️"
            status={statuses.heartRate}
          />

          <StatCard
            title="Blood Oxygen"
            value={spo2}
            unit="%"
            icon="🫁"
            status={statuses.spo2}
          />

          <StatCard
            title="Temperature"
            value={temperature}
            unit="°C"
            icon="🌡️"
          />

          <StatCard
            title="Humidity"
            value={humidity}
            unit="%"
            icon="💧"
          />

          <StatCard
            title="Pressure"
            value={pressure}
            unit="hPa"
            icon="🧭"
          />
        </View>

        <Text style={[styles.heading, { color: theme.text }]}>Location</Text>

        <SectionCard title="Current Position">
          <View style={styles.locationRow}>
            <Text style={{ color: theme.secondaryText }}>Latitude</Text>
            <Text style={[styles.locationValue, { color: theme.text }]}>
              {location?.latitude ?? "--"}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <Text style={{ color: theme.secondaryText }}>Longitude</Text>
            <Text style={[styles.locationValue, { color: theme.text }]}>
              {location?.longitude ?? "--"}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <Text style={{ color: theme.secondaryText }}>Altitude</Text>
            <Text style={[styles.locationValue, { color: theme.text }]}>
              {location?.altitude ? `${location.altitude} m` : "--"}
            </Text>
          </View>
        </SectionCard>

        <Text style={[styles.heading, { color: theme.text }]}>
          Recent Safety Alerts
        </Text>

        {recentFalls.length === 0 ? (
          <Text style={[styles.empty, { color: theme.secondaryText }]}>
            No recent falls or SOS events.
          </Text>
        ) : (
          recentFalls.map((fall, index) => (
            <AlertCard key={fall._id || fall.id || index} alert={fall} />
          ))
        )}
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
  connection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  locationValue: {
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
  },
});
