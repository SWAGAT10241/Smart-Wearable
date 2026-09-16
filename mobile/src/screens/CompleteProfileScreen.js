import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfileScreen() {
  const { completeProfile } = useAuth();
  const [form, setForm] = useState({
    phoneNumber: "", emergencyContactName: "", emergencyContactPhone: "", height: "", weight: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async () => {
    setError("");
    setBusy(true);
    try {
      // Success flips profileComplete in AuthContext; App.js swaps to the main tabs automatically.
      await completeProfile(form);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.badge}>ONE LAST STEP</Text>
      <Text style={styles.title}>Finish your safety profile</Text>
      <Text style={styles.subtitle}>
        We need this so TrailGuard knows who to alert, and where, if something goes wrong.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {[
        ["phoneNumber", "Phone number", "phone-pad"],
        ["emergencyContactName", "Emergency contact name", "default"],
        ["emergencyContactPhone", "Emergency contact phone", "phone-pad"],
        ["height", "Height (cm)", "numeric"],
        ["weight", "Weight (kg)", "numeric"],
      ].map(([key, placeholder, kbType]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={placeholder}
          keyboardType={kbType}
          value={form[key]}
          onChangeText={set(key)}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={busy}>
        {busy ? <ActivityIndicator color="#102A43" /> : <Text style={styles.buttonText}>Complete profile</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#F4F9FA", flexGrow: 1, justifyContent: "center" },
  badge: {
    alignSelf: "flex-start", backgroundColor: "#CCFBF1", color: "#0369A1", fontWeight: "700",
    fontSize: 11, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#102A43", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#5C7086", marginBottom: 16 },
  error: { color: "#D64545", marginBottom: 12 },
  input: {
    height: 52, borderRadius: 12, borderWidth: 1, borderColor: "#D9E4E8",
    backgroundColor: "#fff", paddingHorizontal: 16, marginBottom: 12, fontSize: 15,
  },
  button: {
    height: 52, borderRadius: 12, backgroundColor: "#2DD4BF",
    alignItems: "center", justifyContent: "center", marginTop: 8,
  },
  buttonText: { color: "#102A43", fontWeight: "700", fontSize: 16 },
});
