import React from "react";
import {
  Platform,
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
import {
  HeartIcon,
  OxygenIcon,
  ThermometerIcon,
  DropletIcon,
  PressureIcon,
  ShieldIcon,
  PulseWave,
  PinIcon,
} from "../components/Icons";

import { useDashboardData } from "../hooks/useDashboardData";
import { useAppTheme } from "../theme/theme";

/**
 * Main dashboard screen on mobile companion app.
 * Displays live wearable status, health metrics, environment stats, and recent safety alerts.
 */
export default function DashboardScreen({ navigation }) {
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
        badgeCount={recentFalls?.length || 0}
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
        <View
          style={[
            styles.connection,
            {
              backgroundColor: connected ? theme.primaryLight : theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
                fontSize: 12,
              }}
            >
              {connected ? "Live BLE connection" : "Using latest data"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <ShieldIcon
              size={13}
              color={connected ? theme.success : theme.secondaryText}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: connected ? theme.success : theme.secondaryText,
              }}
            >
              Background Shield
            </Text>
          </View>
        </View>

        <DeviceCard device={selectedDevice} />

        <Text style={[styles.heading, { color: theme.text }]}>
          Heart & Vital Signs
        </Text>

        <View style={styles.grid}>
          <StatCard
            title="Heart Rate"
            value={heartRate}
            unit="BPM"
            icon={<HeartIcon size={20} color={theme.danger || "#EF4444"} />}
            status={statuses.heartRate}
          />

          <StatCard
            title="Blood Oxygen"
            value={spo2}
            unit="%"
            icon={<OxygenIcon size={20} color={theme.blue || "#3B82F6"} />}
            status={statuses.spo2}
          />
        </View>

        {/* Pulse Rhythm & Conditioning Strip */}
        <View
          style={[
            styles.pulseCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.pulseHeader}>
            <Text style={[styles.pulseTitle, { color: theme.secondaryText }]}>
              Rhythm & Baseline
            </Text>
            <Text style={[styles.pulseSubtitle, { color: theme.text }]}>
              Resting ~64 · Peak today 112 BPM
            </Text>
          </View>
          <PulseWave color={theme.danger || "#EF4444"} height={22} />
        </View>

        <Text style={[styles.heading, { color: theme.text }]}>
          Trail Climate & Conditions
        </Text>

        <View style={styles.envGrid}>
          <StatCard
            title="Temperature"
            value={temperature}
            unit="°C"
            icon={<ThermometerIcon size={20} color={theme.warning || "#F59E0B"} />}
            style={styles.envCard}
          />

          <StatCard
            title="Humidity"
            value={humidity}
            unit="%"
            icon={<DropletIcon size={20} color={theme.primary || "#06B6D4"} />}
            style={styles.envCard}
          />

          <StatCard
            title="Pressure"
            value={pressure}
            unit="hPa"
            icon={<PressureIcon size={20} color={theme.purple || "#8B5CF6"} />}
            style={styles.envCard}
          />
        </View>

        <Text style={[styles.heading, { color: theme.text }]}>
          Current Trail Position
        </Text>

        <SectionCard
          title="Current Position"
          right={
            <TouchableOpacity
              onPress={() => navigation.navigate("LiveMap")}
              style={[
                styles.mapButton,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
              ]}
              activeOpacity={0.7}
            >
              <PinIcon size={12} color={theme.primary} />
              <Text style={[styles.mapButtonText, { color: theme.primary }]}>
                Live Map
              </Text>
            </TouchableOpacity>
          }
        >
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
              {location?.altitude != null ? `${location.altitude} m` : "--"}
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
    justifyContent: "space-between",
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
    fontSize: 17,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  envGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  envCard: {
    width: "31.5%",
    padding: 11,
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
  pulseCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 4,
    gap: 8,
  },
  pulseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pulseTitle: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pulseSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  mapButtonText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
});
