import React, { useState } from "react";

import {
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

  const [loading, setLoading] = useState(false);

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submit() {
    if (!form.username || !form.email || !form.password) {
      Alert.alert(
        "Required fields",
        "Username, email and password are required.",
      );
      return;
    }

    try {
      setLoading(true);
      await register(form);

      Alert.alert(
        "Registration successful",
        "Your TrailGuard account has been created.",
      );
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  function Input({ name, placeholder, secure, keyboardType }) {
    return (
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
        value={form[name]}
        onChangeText={(value) => update(name, value)}
        secureTextEntry={secure}
        keyboardType={keyboardType}
      />
    );
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
          <Text style={[styles.title, { color: theme.text }]}>
            Create account
          </Text>

          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Set up your TrailGuard account.
          </Text>

          <Input name="username" placeholder="Username" />

          <Input
            name="email"
            placeholder="Email"
            keyboardType="email-address"
          />

          <Input name="password" placeholder="Password" secure />

          <Text style={[styles.section, { color: theme.text }]}>
            Contact information
          </Text>

          <Input
            name="phoneNumber"
            placeholder="+91 Phone number"
            keyboardType="phone-pad"
          />

          <Input
            name="emergencyContactName"
            placeholder="Emergency contact name"
          />

          <Input
            name="emergencyContactPhone"
            placeholder="+91 Emergency contact phone"
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={submit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.login, { color: theme.primary }]}>
              Already have an account? Sign in
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
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 15,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 7,
    marginBottom: 25,
  },

  section: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 12,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  button: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  login: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
  },
});
