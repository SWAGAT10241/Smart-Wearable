import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { useLiveData } from "../context/LiveDataContext";
import { useAppTheme } from "../theme/theme";
import { PinIcon, MountainIcon } from "../components/Icons";

export default function LiveMapScreen({ navigation }) {
  const theme = useAppTheme();
  const { user } = useAuth();
  const mapRef = useRef(null);
  const { location } = useLiveData();
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  const altitude = location?.altitude;
  const valid = Number.isFinite(latitude) && Number.isFinite(longitude);
  const [initialRegionSet, setInitialRegionSet] = useState(false);

  useEffect(() => {
    if (valid && !initialRegionSet) {
      setInitialRegionSet(true);
    }
  }, [valid, initialRegionSet]);

  const recenter = () => {
    if (!valid || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800,
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Live Map"
        subtitle="TrailGuard GPS telemetry"
        onNotification={() => navigation.navigate("Alerts")}
        onProfile={() => navigation.navigate("Profile")}
        user={user}
      />

      <View style={styles.mapContainer}>
        {valid ? (
          <>
            <MapView
              ref={mapRef}
              provider={PROVIDER_DEFAULT}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsCompass
              showsScale
            >
              <Marker
                coordinate={{
                  latitude,
                  longitude,
                }}
                title="TrailGuard Wearable"
                description="Live Wearer Position"
              />
            </MapView>

            {/* Recenter Button */}
            <TouchableOpacity
              style={[
                styles.recenterButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={recenter}
              activeOpacity={0.8}
            >
              <PinIcon size={14} color={theme.primary} />
              <Text style={[styles.recenterText, { color: theme.text }]}>
                Re-center
              </Text>
            </TouchableOpacity>

            {/* Bottom Floating Telemetry Card */}
            <View
              style={[
                styles.locationCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.liveIndicator}>
                  <View
                    style={[
                      styles.liveDot,
                      { backgroundColor: theme.success },
                    ]}
                  />
                  <Text style={[styles.locationTitle, { color: theme.text }]}>
                    Active Coordinates
                  </Text>
                </View>
                {altitude != null && (
                  <View style={styles.altitudeContainer}>
                    <MountainIcon size={14} color={theme.primary} />
                    <Text
                      style={[styles.altitudeBadge, { color: theme.primary }]}
                    >
                      {altitude}m
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[styles.coordinates, { color: theme.secondaryText }]}
              >
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          </>
        ) : (
          <View style={[styles.empty, { backgroundColor: theme.background }]}>
            <View style={{ marginBottom: 15 }}>
              <PinIcon size={46} color={theme.secondaryText} />
            </View>

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Acquiring GPS Signal
            </Text>

            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              Waiting for live GPS coordinates from your TrailGuard wearable...
            </Text>

            <ActivityIndicator
              style={{ marginTop: 24 }}
              color={theme.primary}
              size="large"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
    position: "relative",
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 14,
  },

  recenterButton: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  recenterText: {
    fontSize: 13,
    fontWeight: "700",
  },

  altitudeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  locationCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  altitudeBadge: {
    fontSize: 12,
    fontWeight: "700",
  },

  coordinates: {
    fontSize: 13,
    marginTop: 6,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
