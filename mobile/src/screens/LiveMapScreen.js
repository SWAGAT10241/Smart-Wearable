import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import AppHeader from "../components/AppHeader";
import { useLiveData } from "../context/LiveDataContext";
import { useAppTheme } from "../theme/theme";

export default function LiveMapScreen() {
  const theme = useAppTheme();
  const { location } = useLiveData();
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  const valid = Number.isFinite(latitude) && Number.isFinite(longitude);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (valid) {
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [latitude, longitude, valid]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader title="Live Map" subtitle="TrailGuard location" />

      {valid && region ? (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          region={region}
          showsUserLocation={false}
          showsCompass
          showsScale
          showsMyLocationButton
        >
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
            title="TrailGuard"
            description="Current wearable location"
          />
        </MapView>
      ) : (
        <View style={[styles.empty, { backgroundColor: theme.background }]}>
          <Text style={styles.emptyIcon}>📍</Text>

          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Location unavailable
          </Text>

          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
            Waiting for GPS coordinates from your TrailGuard wearable.
          </Text>

          <ActivityIndicator style={{ marginTop: 20 }} color={theme.primary} />
        </View>
      )}

      {valid && (
        <View
          style={[
            styles.locationCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.locationTitle, { color: theme.text }]}>
            Current position
          </Text>

          <Text style={[styles.coordinates, { color: theme.secondaryText }]}>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
    fontWeight: "900",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  locationCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  coordinates: {
    fontSize: 12,
    marginTop: 4,
  },
});
