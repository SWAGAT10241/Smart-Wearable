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

export default function LoginScreen({ navigation }) {
  const theme = useAppTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert("Sign In Failed", error.message || "Invalid credentials");
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
          {/* Brand Emblem */}
          <View style={styles.brandContainer}>
            <View
              style={[
                styles.logo,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.border,
                },
              ]}
            >
              <ShieldIcon size={34} color={theme.primary} />
            </View>

            <Text style={[styles.appName, { color: theme.text }]}>
              TrailGuard
            </Text>
            <Text style={[styles.tagline, { color: theme.secondaryText }]}>
              Smart Wearable Assistance & Alert System
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Explorer Sign In
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.secondaryText }]}>
              Connect with your wearable and access telemetry.
            </Text>

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
                value={email}
                onChangeText={setEmail}
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
                  placeholder="••••••••"
                  placeholderTextColor={theme.secondaryText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} color={theme.secondaryText} />
                  ) : (
                    <EyeIcon size={20} color={theme.secondaryText} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.primary, opacity: loading ? 0.8 : 1 },
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.registerLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.registerText, { color: theme.secondaryText }]}>
              New explorer?{" "}
              <Text style={{ color: theme.primary, fontWeight: "700" }}>
                Create safety account
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingVertical: 32,
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  appName: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  tagline: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  cardSubtitle: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 18,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    fontSize: 14,
  },

  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  passwordInput: {
    paddingRight: 44,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    height: 50,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  registerLink: {
    marginTop: 22,
    alignItems: "center",
  },

  registerText: {
    fontSize: 13,
  },
});
