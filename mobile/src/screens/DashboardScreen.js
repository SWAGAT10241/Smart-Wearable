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

import { useDevices } from "../context/DeviceContext";
import { useLiveData } from "../context/LiveDataContext";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme/theme";

export default function DashboardScreen() {
  const theme = useAppTheme();
  const { user } = useAuth();
  const { selectedDevice } = useDevices();
  const { vitals, environment, location, falls, connected, loading, refresh } = useLiveData();
  const heartRate = vitals?.heartRate ?? vitals?.hr ?? vitals?.heart_rate;
  const spo2 = vitals?.spo2 ?? vitals?.oxygenSaturation ?? vitals?.oxygen;
  const temperature = environment?.temperature ?? vitals?.temperature ?? vitals?.temp;
  const humidity = environment?.humidity ?? vitals?.humidity;
  const pressure = environment?.pressure ?? vitals?.pressure;

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
            status={
              heartRate && (heartRate < 50 || heartRate > 120)
                ? "danger"
                : "success"
            }
          />

          <StatCard
            title="Blood Oxygen"
            value={spo2}
            unit="%"
            icon="🫁"
            status={spo2 && spo2 < 94 ? "danger" : "success"}
          />

          <StatCard
            title="Temperature"
            value={temperature}
            unit="°C"
            icon="🌡️"
          />

          <StatCard title="Humidity" value={humidity} unit="%" icon="💧" />
          <StatCard title="Pressure" value={pressure} unit="hPa" icon="⛰️" />

          <StatCard
            title="GPS"
            value={location?.latitude ? "Active" : "Offline"}
            icon="📍"
          />
        </View>

        <SectionCard title="Current Location">
          <Text style={[styles.coordinate, { color: theme.text }]}>
            {location?.latitude
              ? `${Number(location.latitude).toFixed(5)}, ${Number(
                  location.longitude,
                ).toFixed(5)}`
              : "Location unavailable"}
          </Text>

          <Text style={[styles.muted, { color: theme.secondaryText }]}>
            GPS position from your TrailGuard wearable.
          </Text>
        </SectionCard>

        {falls?.length > 0 && (
          <SectionCard title="Recent Alerts">
            {falls.slice(0, 3).map((fall, index) => (
              <AlertCard key={fall._id || fall.id || index} alert={fall} />
            ))}
          </SectionCard>
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
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 14,
  },

  connectionDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  heading: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 5,
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  coordinate: {
    fontSize: 17,
    fontWeight: "800",
  },

  muted: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },
});
