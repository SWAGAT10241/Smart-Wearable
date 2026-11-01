import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme/theme";

export default function CompleteProfileScreen() {
  const theme = useAppTheme();
  const { completeProfile, logout } = useAuth();
  const [form, setForm] = useState({
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    height: "",
    weight: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async () => {
    setError("");
    setBusy(true);
    try {
      await completeProfile({
        ...form,
        height: form.height ? Number(form.height) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
      });
    } catch (err) {
      setError(err.message || "Failed to complete profile");
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    { key: "phoneNumber", label: "Phone number", placeholder: "+1 (555) 000-0000", kbType: "phone-pad" },
    { key: "emergencyContactName", label: "Emergency contact name", placeholder: "e.g. Jane Doe", kbType: "default" },
    { key: "emergencyContactPhone", label: "Emergency contact phone", placeholder: "+1 (555) 111-2222", kbType: "phone-pad" },
    { key: "height", label: "Height (cm)", placeholder: "e.g. 175", kbType: "numeric" },
    { key: "weight", label: "Weight (kg)", placeholder: "e.g. 70", kbType: "numeric" },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              ONE LAST STEP
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Finish your safety profile
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            TrailGuard uses this safety information to dispatch help to your emergency contacts during active falls or SOS events.
          </Text>

          {error ? (
            <View style={[styles.errorContainer, { borderColor: theme.danger }]}>
              <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
            </View>
          ) : null}

          {fields.map(({ key, label, placeholder, kbType }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>{label}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.secondaryText}
                keyboardType={kbType}
                value={form[key]}
                onChangeText={set(key)}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onSubmit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Safety Profile</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            disabled={busy}
          >
            <Text style={[styles.logoutText, { color: theme.secondaryText }]}>
              Sign out / Use another account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
  },
  error: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  button: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
