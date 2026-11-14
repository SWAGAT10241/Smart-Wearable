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
import SectionCard from "../components/SectionCard";
import AlertCard from "../components/AlertCard";

import { useLiveData } from "../context/LiveDataContext";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme/theme";

export default function DashboardScreen() {
  const theme = useAppTheme();
  const { user } = useAuth();
  const { vitals, environment, location, falls, connected, loading, refresh } = useLiveData();
  const heartRate = vitals?.heartRate ?? vitals?.hr ?? vitals?.heart_rate;
  const spo2 = vitals?.spo2 ?? vitals?.oxygenSaturation ?? vitals?.oxygen;
  const temperature = environment?.temperature ?? vitals?.temperature ?? vitals?.temp;
  const humidity = environment?.humidity ?? vitals?.humidity;
  const pressure = environment?.pressure ?? vitals?.pressure;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader
        title={`Welcome back, ${user?.username || "Explorer"}!`}
        subtitle="Your safety overview is up to date"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <View style={[styles.connection, { backgroundColor: connected ? theme.primaryLight : theme.card, borderColor: theme.border }]}>
          <View style={[styles.connectionDot, { backgroundColor: connected ? theme.success : theme.warning }]} />
          <View style={styles.connectionCopy}>
            <Text style={[styles.connectionTitle, { color: theme.text }]}>
              {connected ? "Live safety monitoring" : "Latest safety snapshot"}
            </Text>
            <Text style={[styles.connectionSub, { color: theme.secondaryText }]}>
              {connected ? "Your wearable is connected" : "Reconnect your wearable for live updates"}
            </Text>
          </View>
          <Text style={[styles.connectionStatus, { color: connected ? theme.primary : theme.warning }]}>
            {connected ? "LIVE" : "PAUSED"}
          </Text>
        </View>

        <Text style={[styles.sectionKicker, { color: theme.secondaryText }]}>LIVE VITALS</Text>

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
          <StatCard title="Pressure" value={pressure} unit="hPa" icon="◌" />
        </View>

        <SectionCard
          title="Live location"
          right={<Text style={[styles.updated, { color: theme.primary }]}>{location?.latitude ? "● Updated now" : "Waiting"}</Text>}
        >
          <View style={[styles.mapPlaceholder, { backgroundColor: theme.primaryLight }]}>
            <Text style={styles.mapIcon}>⌖</Text>
            <Text style={[styles.mapTitle, { color: theme.text }]}>
              {location?.latitude ? "Wearable location active" : "Searching for GPS signal"}
            </Text>
            <Text style={[styles.mapSub, { color: theme.secondaryText }]}>TrailGuard location is shared only during an active safety session.</Text>
          </View>
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
    paddingBottom: 34,
  },

  connection: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  connectionDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  connectionCopy: { flex: 1 },

  connectionTitle: { fontSize: 14, fontWeight: "800" },

  connectionSub: { marginTop: 2, fontSize: 11 },

  connectionStatus: { fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },

  sectionKicker: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  coordinate: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "800",
  },

  muted: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },

  updated: { fontSize: 10, fontWeight: "800" },

  mapPlaceholder: {
    minHeight: 122,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  mapIcon: { fontSize: 30, color: "#0E9C8C", marginBottom: 5 },
  mapTitle: { fontSize: 14, fontWeight: "800" },
  mapSub: { textAlign: "center", fontSize: 11, lineHeight: 16, marginTop: 4 },
});
