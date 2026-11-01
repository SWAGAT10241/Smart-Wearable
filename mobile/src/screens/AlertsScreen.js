import React from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import AlertCard from "../components/AlertCard";

import { useLiveData } from "../context/LiveDataContext";
import { useAppTheme } from "../theme/theme";

export default function AlertsScreen({ navigation }) {
  const theme = useAppTheme();

  const { falls, refresh, loading } = useLiveData();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Safety Alerts"
        subtitle="Active incidents & falls"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {falls?.length === 0 ? (
          <Text style={[styles.empty, { color: theme.secondaryText }]}>
            No alerts recorded.
          </Text>
        ) : (
          falls.map((fall, index) => (
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

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 14,
  },
});
