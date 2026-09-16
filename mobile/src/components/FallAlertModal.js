import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useLiveData } from "../context/LiveDataContext";
import { fallsApi } from "../lib/apiClient";

export default function FallAlertModal() {
  const { activeFall, dismissFall } = useLiveData();
  if (!activeFall) return null;

  const handle = async (status) => {
    try {
      await fallsApi.updateStatus(activeFall._id, status);
    } catch {
      // ignore network errors, still dismiss locally
    }
    dismissFall();
  };

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.badge}>{(activeFall.severity || "moderate").toUpperCase()} SEVERITY</Text>
          <Text style={styles.title}>Fall Detected</Text>
          <Text style={styles.body}>
            {activeFall.latitude && activeFall.longitude
              ? `Near ${activeFall.latitude.toFixed(4)}, ${activeFall.longitude.toFixed(4)}. `
              : ""}
            {activeFall.tiltAngle ? `Tilt angle ${activeFall.tiltAngle}°.` : ""}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.okButton} onPress={() => handle("confirmed_false_alarm")}>
              <Text style={styles.okText}>User is OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertButton} onPress={() => handle("resolved")}>
              <Text style={styles.alertText}>Alert Received</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.55)", alignItems: "center", justifyContent: "center", padding: 20 },
  card: {
    width: "100%", backgroundColor: "#fff", borderRadius: 24, padding: 28, alignItems: "center",
    borderWidth: 2, borderColor: "#DC2626",
  },
  badge: {
    backgroundColor: "#FEE2E2", color: "#B91C1C", fontWeight: "700", fontSize: 11,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#102A43", marginBottom: 8 },
  body: { fontSize: 13, color: "#5C7086", textAlign: "center", marginBottom: 20 },
  actions: { flexDirection: "row", gap: 12, width: "100%" },
  okButton: { flex: 1, height: 52, borderRadius: 12, backgroundColor: "#2DD4BF", alignItems: "center", justifyContent: "center" },
  okText: { color: "#102A43", fontWeight: "700" },
  alertButton: { flex: 1, height: 52, borderRadius: 12, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center" },
  alertText: { color: "#fff", fontWeight: "700" },
});
