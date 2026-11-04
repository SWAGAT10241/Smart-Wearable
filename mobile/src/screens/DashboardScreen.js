import React from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  MountainIcon,
} from "../components/Icons";

import { useDashboardData } from "../hooks/useDashboardData";
import { useAppTheme } from "../theme/theme";

/**
 * Main dashboard screen on mobile companion app.
 * Incorporates premier outdoor & athletic wearable UX (Garmin Connect, Whoop, Apple Health, AllTrails):
 * - Garmin-style Incident Detection & Safety Armed hero banner
 * - Whoop-style On-Device Edge Safety & Fall Risk index
 * - Apple Health-style biometric range indicators and baseline brackets
 * - AllTrails-style outdoor climate strip & GPS altitude profile
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
        {/* Garmin-style Incident Detection & Safety Armed Hero Banner */}
        <View
          style={[
            styles.safetyHero,
            {
              backgroundColor: connected
                ? `${theme.primary}12`
                : `${theme.card}`,
              borderColor: connected ? theme.primary : theme.border,
            },
          ]}
        >
          <View style={styles.safetyHeroTop}>
            <View style={styles.safetyHeroTitleRow}>
              <View
                style={[
                  styles.shieldIconBox,
                  { backgroundColor: `${theme.success}1F` },
                ]}
              >
                <ShieldIcon size={16} color={theme.success} />
              </View>

              <View>
                <Text style={[styles.safetyHeroTitle, { color: theme.text }]}>
                  Incident Detection Armed
                </Text>
                <Text
                  style={[
                    styles.safetyHeroSubtitle,
                    { color: theme.secondaryText },
                  ]}
                >
                  6-Axis IMU Active · Fall Guardian Online
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.armedBadge,
                {
                  backgroundColor: `${theme.success}1A`,
                  borderColor: theme.success,
                },
              ]}
            >
              <View
                style={[
                  styles.pulseDot,
                  { backgroundColor: theme.success },
                ]}
              />
              <Text style={[styles.armedBadgeText, { color: theme.success }]}>
                ARMED
              </Text>
            </View>
          </View>

          {/* Whoop-style Edge Safety Score */}
          <View
            style={[
              styles.safetyMetricRow,
              { borderTopColor: `${theme.border}80` },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.safetyMetricLabel, { color: theme.secondaryText }]}
              >
                On-Device Safety Index
              </Text>
              <Text style={[styles.safetyMetricValue, { color: theme.text }]}>
                98% · Optimal Baseline
              </Text>
            </View>
            <Text
              style={[
                styles.safetyMetricTag,
                { color: theme.success },
              ]}
            >
              0 Fall Hazards
            </Text>
          </View>
        </View>

        {/* Wearable Device Hardware Telemetry */}
        <DeviceCard device={selectedDevice} />

        {/* Biometrics & Vitals (Apple Health & Whoop style) */}
        <Text style={[styles.heading, { color: theme.text }]}>
          Heart & Vital Signs
        </Text>

        <View style={styles.grid}>
          <StatCard
            title="Heart Rate"
            value={heartRate}
            unit="BPM"
            icon={<HeartIcon size={20} color="#F43F5E" />}
            iconBg="rgba(244, 63, 94, 0.12)"
            status={statuses.heartRate}
            tag="NORMAL"
            tagColor="#10B981"
            subtitle="Resting 64 · Target 60–100"
            barPercent={68}
            barColor="#F43F5E"
          />

          <StatCard
            title="Blood Oxygen"
            value={spo2}
            unit="%"
            icon={<OxygenIcon size={20} color="#06B6D4" />}
            iconBg="rgba(6, 182, 212, 0.12)"
            status={statuses.spo2}
            tag="OPTIMAL"
            tagColor="#10B981"
            subtitle="Target 95–100% · Sat OK"
            barPercent={95}
            barColor="#06B6D4"
          />
        </View>

        {/* Pulse Rhythm & Baseline Conditioning Strip */}
        <View
          style={[
            styles.pulseCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.pulseHeader}>
            <View>
              <Text style={[styles.pulseTitle, { color: theme.secondaryText }]}>
                Real-Time Pulse Rhythm
              </Text>
              <Text style={[styles.pulseSubtitle, { color: theme.text }]}>
                Resting ~64 · Peak today 112 BPM
              </Text>
            </View>
            <View style={styles.ecgLivePill}>
              <View style={[styles.pulseDot, { backgroundColor: "#F43F5E" }]} />
              <Text style={styles.ecgLiveText}>LIVE</Text>
            </View>
          </View>
          <PulseWave color="#F43F5E" height={22} />
        </View>

        {/* Trail Climate & Weather Conditions (AllTrails style) */}
        <Text style={[styles.heading, { color: theme.text }]}>
          Trail Climate & Conditions
        </Text>

        <View style={styles.envGrid}>
          <StatCard
            title="Temperature"
            value={temperature}
            unit="°C"
            icon={<ThermometerIcon size={19} color="#F59E0B" />}
            iconBg="rgba(245, 158, 11, 0.12)"
            subtitle="Mild & Clear"
            style={styles.envCard}
          />

          <StatCard
            title="Humidity"
            value={humidity}
            unit="%"
            icon={<DropletIcon size={19} color="#3B82F6" />}
            iconBg="rgba(59, 130, 246, 0.12)"
            subtitle="Comfortable"
            style={styles.envCard}
          />

          <StatCard
            title="Pressure"
            value={pressure}
            unit="hPa"
            icon={<PressureIcon size={19} color="#8B5CF6" />}
            iconBg="rgba(139, 92, 246, 0.12)"
            subtitle="Baro Steady"
            style={styles.envCard}
          />
        </View>

        {/* Current Trail Position & Elevation Profile (Garmin & AllTrails style) */}
        <Text style={[styles.heading, { color: theme.text }]}>
          Current Trail Position
        </Text>

        <SectionCard
          title="Trailhead Coordinates"
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
          {/* GPS Satellite Lock Status */}
          <View
            style={[
              styles.gpsFixBar,
              { backgroundColor: `${theme.background}80`, borderColor: theme.border },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={[styles.pulseDot, { backgroundColor: theme.success }]} />
              <Text style={[styles.gpsFixText, { color: theme.text }]}>
                3D GPS Fix Locked · 12 Satellites
              </Text>
            </View>
            <Text style={[styles.accuracyText, { color: theme.secondaryText }]}>
              ±3m Precision
            </Text>
          </View>

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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MountainIcon size={14} color={theme.primary} />
              <Text style={{ color: theme.secondaryText }}>Altitude Profile</Text>
            </View>
            <Text style={[styles.locationValue, { color: theme.text }]}>
              {location?.altitude != null ? `${location.altitude} m` : "--"}
              <Text style={{ color: theme.success, fontSize: 11 }}> (+85m ascent)</Text>
            </Text>
          </View>
        </SectionCard>

        {/* Recent Safety Alerts */}
        <Text style={[styles.heading, { color: theme.text }]}>
          Recent Safety Alerts
        </Text>

        {recentFalls.length === 0 ? (
          <View
            style={[
              styles.emptyBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <ShieldIcon size={24} color={theme.success} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              All Clear & Safe
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.secondaryText }]}>
              No falls or SOS trigger events recorded today.
            </Text>
          </View>
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
    paddingBottom: 36,
  },

  // Garmin-style Incident Detection & Safety Armed Hero Banner
  safetyHero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  safetyHeroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  safetyHeroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  shieldIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  safetyHeroTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  safetyHeroSubtitle: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    marginTop: 1,
  },
  armedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  armedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    letterSpacing: 0.5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  safetyMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    marginTop: 10,
    paddingTop: 8,
  },
  safetyMetricLabel: {
    fontSize: 10.5,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  safetyMetricValue: {
    fontSize: 12.5,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    marginTop: 1,
  },
  safetyMetricTag: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    marginTop: 18,
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
    alignItems: "center",
    paddingVertical: 6,
  },
  locationValue: {
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    fontSize: 13,
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
    fontSize: 10.5,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pulseSubtitle: {
    fontSize: 11.5,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    marginTop: 1,
  },
  ecgLivePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(244, 63, 94, 0.12)",
  },
  ecgLiveText: {
    color: "#F43F5E",
    fontSize: 9.5,
    fontWeight: "700",
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

  gpsFixBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    marginBottom: 8,
  },
  gpsFixText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  accuracyText: {
    fontSize: 10,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },

  emptyBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginVertical: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    textAlign: "center",
  },
});
