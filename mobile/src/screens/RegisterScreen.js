import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { ShieldIcon, EyeIcon, EyeOffIcon } from "../components/Icons";

export default function RegisterScreen({ navigation }) {
  const theme = useAppTheme();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submit() {
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      Alert.alert(
        "Required Fields",
        "Username, email, and password are required.",
      );
      return;
    }

    try {
      setLoading(true);
      await register(form);

      Alert.alert(
        "Welcome to TrailGuard",
        "Your safety account has been created successfully.",
      );
    } catch (error) {
      Alert.alert("Registration Failed", error.message || "Could not register account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Back Navigation Bar */}
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.backCircle,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.backArrow, { color: theme.text }]}>←</Text>
            </View>
            <Text style={[styles.backLabel, { color: theme.secondaryText }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>

          {/* Screen Title */}
          <View style={styles.titleArea}>
            <View
              style={[
                styles.miniLogo,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
              ]}
            >
              <ShieldIcon size={20} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Create Safety Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Provision your profile for autonomous emergency incident response.
            </Text>
          </View>

          {/* Section 1: Account Credentials Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              Account Credentials
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                Explorer Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="e.g. John Doe"
                placeholderTextColor={theme.secondaryText}
                value={form.username}
                onChangeText={(val) => update("username", val)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="name@trailguard.org"
                placeholderTextColor={theme.secondaryText}
                value={form.email}
                onChangeText={(val) => update("email", val)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                Password
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor={theme.secondaryText}
                  value={form.password}
                  onChangeText={(val) => update("password", val)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} color={theme.secondaryText} />
                  ) : (
                    <EyeIcon size={18} color={theme.secondaryText} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section 2: Emergency Contacts Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border, marginTop: 14 },
            ]}
          >
            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              Emergency Contacts
            </Text>
            <Text style={[styles.sectionSub, { color: theme.secondaryText }]}>
              Notified automatically if an uncancelled fall occurs.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                Personal Phone Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={theme.secondaryText}
                value={form.phoneNumber}
                onChangeText={(val) => update("phoneNumber", val)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                Emergency Contact Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="e.g. Jane Doe"
                placeholderTextColor={theme.secondaryText}
                value={form.emergencyContactName}
                onChangeText={(val) => update("emergencyContactName", val)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                Emergency Contact Phone
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="+1 (555) 911-2024"
                placeholderTextColor={theme.secondaryText}
                value={form.emergencyContactPhone}
                onChangeText={(val) => update("emergencyContactPhone", val)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.primary, opacity: loading ? 0.8 : 1 },
            ]}
            onPress={submit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Registration</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.signInLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.signInText, { color: theme.secondaryText }]}>
              Already registered?{" "}
              <Text style={{ color: theme.primary, fontWeight: "700" }}>
                Sign in to dashboard
              </Text>
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

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingVertical: 4,
  },

  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    fontSize: 16,
    fontWeight: "700",
  },

  backLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  titleArea: {
    marginBottom: 18,
  },

  miniLogo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  sectionSub: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },

  fieldGroup: {
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 5,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
  },

  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  passwordInput: {
    paddingRight: 40,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  signInLink: {
    marginTop: 20,
    alignItems: "center",
  },

  signInText: {
    fontSize: 13,
  },
});