import React, { useState } from "react";

import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import SectionCard from "../components/SectionCard";

import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { useAppTheme } from "../theme/theme";
import { isProfileComplete } from "../lib/profileCompletion";
import { CheckIcon, WarningIcon, UserIcon } from "../components/Icons";

export default function SettingsScreen({ navigation }) {
  const theme = useAppTheme();

  const { user, logout, completeProfile } = useAuth();

  const {
    devices,
    selectedDevice,
    registerDevice,
    renameDevice,
    removeDevice,
  } = useDevices();

  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [renameBusy, setRenameBusy] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    height: "",
    weight: "",
  });

  function openEditProfile() {
    setProfileForm({
      phoneNumber: user?.phoneNumber || "",
      emergencyContactName: user?.emergencyContactName || "",
      emergencyContactPhone: user?.emergencyContactPhone || "",
      height: user?.height != null ? String(user.height) : "",
      weight: user?.weight != null ? String(user.weight) : "",
    });
    setEditProfileVisible(true);
  }

  async function handleSaveProfile() {
    try {
      setProfileBusy(true);
      await completeProfile({
        ...profileForm,
        height: profileForm.height ? Number(profileForm.height) : undefined,
        weight: profileForm.weight ? Number(profileForm.weight) : undefined,
      });
      setEditProfileVisible(false);
      Alert.alert("Success", "Safety profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setProfileBusy(false);
    }
  }

  async function pair() {
    if (!deviceId.trim()) {
      Alert.alert("Device ID required", "Enter your TrailGuard device ID.");
      return;
    }

    try {
      await registerDevice(deviceId, deviceName || "TrailGuard Wearable");

      setDeviceId("");
      setDeviceName("");

      Alert.alert("Success", "TrailGuard device paired.");
    } catch (error) {
      Alert.alert("Pairing failed", error.message);
    }
  }

  function unpair() {
    if (!selectedDevice) {
      return;
    }

    Alert.alert(
      "Unpair device",
      `Unpair ${selectedDevice.deviceName || "TrailGuard"}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unpair",
          style: "destructive",
          onPress: async () => {
            try {
              await removeDevice(selectedDevice.deviceId);
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  }

  function openRenameModal() {
    if (!selectedDevice) {
      return;
    }
    setNewDeviceName(selectedDevice.deviceName || selectedDevice.name || "");
    setRenameModalVisible(true);
  }

  async function handleSaveRename() {
    if (!selectedDevice || !newDeviceName.trim()) {
      return;
    }

    try {
      setRenameBusy(true);
      await renameDevice(selectedDevice.deviceId, newDeviceName.trim());
      setRenameModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to rename device");
    } finally {
      setRenameBusy(false);
    }
  }

  const verified = isProfileComplete(user);
  const heightM = user?.height ? user.height / 100 : null;
  const bmi = heightM && user?.weight ? (user.weight / (heightM * heightM)).toFixed(1) : "--";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Profile & Settings"
        subtitle="Safety identity & device controls"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* User Identity Header Card */}
        <SectionCard title="Explorer Profile">
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.profileAvatar,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.profileAvatarText, { color: theme.primary }]}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.profileUsername, { color: theme.text }]}>
                {user?.username || "--"}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.secondaryText }]}>
                {user?.email || "--"}
              </Text>

              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: verified
                        ? "rgba(22, 163, 74, 0.15)"
                        : "rgba(217, 119, 6, 0.15)",
                    },
                  ]}
                >
                  {verified ? (
                    <CheckIcon size={11} color={theme.success} />
                  ) : (
                    <WarningIcon size={11} color={theme.warning} />
                  )}
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: verified ? theme.success : theme.warning },
                    ]}
                  >
                    {verified ? "Safety Profile Active" : "Action Needed: Incomplete"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SectionCard>

        {/* Emergency Contacts & Protocol Card */}
        <SectionCard title="Emergency Safety Contacts">
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
              Emergency Contact
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {user?.emergencyContactName || "Not configured"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
              Emergency Phone
            </Text>
            <Text style={[styles.infoValue, { color: theme.primary, fontWeight: "700" }]}>
              {user?.emergencyContactPhone || "Not configured"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
              Personal Phone
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {user?.phoneNumber || "Not configured"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.border, marginTop: 12 }]}
            onPress={openEditProfile}
          >
            <Text style={{ color: theme.text, fontWeight: "700" }}>
              Edit Safety Information
            </Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Physical Health & Metrics Card */}
        <SectionCard title="Physical Safety Specs">
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <Text style={[styles.statBoxLabel, { color: theme.secondaryText }]}>
                Height
              </Text>
              <Text style={[styles.statBoxValue, { color: theme.text }]}>
                {user?.height ? `${user.height} cm` : "--"}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statBoxLabel, { color: theme.secondaryText }]}>
                Weight
              </Text>
              <Text style={[styles.statBoxValue, { color: theme.text }]}>
                {user?.weight ? `${user.weight} kg` : "--"}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statBoxLabel, { color: theme.secondaryText }]}>
                Body Mass Index
              </Text>
              <Text style={[styles.statBoxValue, { color: theme.primary }]}>
                {bmi}
              </Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard title="TrailGuard Device">
          {selectedDevice ? (
            <>
              <View style={styles.deviceRow}>
                <View>
                  <Text style={[styles.value, { color: theme.text }]}>
                    {selectedDevice.deviceName || "TrailGuard Wearable"}
                  </Text>

                  <Text
                    style={[
                      styles.id,
                      {
                        color: theme.secondaryText,
                      },
                    ]}
                  >
                    {selectedDevice.deviceId}
                  </Text>
                </View>

                <Text
                  style={{
                    color: theme.success,
                    fontWeight: "800",
                  }}
                >
                  ACTIVE
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: theme.border,
                  },
                ]}
                onPress={openRenameModal}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                  }}
                >
                  Rename Device
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  {
                    borderColor: theme.danger,
                  },
                ]}
                onPress={unpair}
              >
                <Text
                  style={{
                    color: theme.danger,
                    fontWeight: "700",
                  }}
                >
                  Unpair Device
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.info,
                  {
                    color: theme.secondaryText,
                  },
                ]}
              >
                Pair your TrailGuard wearable using its device ID.
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Device ID"
                placeholderTextColor={theme.secondaryText}
                value={deviceId}
                onChangeText={setDeviceId}
                autoCapitalize="characters"
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Device name"
                placeholderTextColor={theme.secondaryText}
                value={deviceName}
                onChangeText={setDeviceName}
              />

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
                onPress={pair}
              >
                <Text style={styles.primaryText}>Pair TrailGuard</Text>
              </TouchableOpacity>
            </>
          )}
        </SectionCard>

        <SectionCard title="Paired Devices">
          {devices.length === 0 ? (
            <Text
              style={{
                color: theme.secondaryText,
              }}
            >
              No devices.
            </Text>
          ) : (
            devices.map((device) => (
              <View key={device.deviceId} style={styles.deviceListRow}>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                  }}
                >
                  {device.deviceName || "TrailGuard Wearable"}
                </Text>

                <Text
                  style={{
                    color: theme.secondaryText,
                    fontSize: 11,
                  }}
                >
                  {device.deviceId}
                </Text>
              </View>
            ))
          )}
        </SectionCard>

        <TouchableOpacity
          style={[styles.logout, { borderColor: theme.danger }]}
          onPress={() =>
            Alert.alert("Sign out", "Are you sure?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Sign out",
                style: "destructive",
                onPress: logout,
              },
            ])
          }
        >
          <Text
            style={{
              color: theme.danger,
              fontWeight: "800",
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Cross-platform Device Rename Modal */}
      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Rename Device
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.secondaryText }]}>
              Enter a friendly nickname for your TrailGuard wearable.
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                  marginTop: 14,
                  marginBottom: 16,
                },
              ]}
              value={newDeviceName}
              onChangeText={setNewDeviceName}
              placeholder="e.g. Mountain Wristband"
              placeholderTextColor={theme.secondaryText}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { borderColor: theme.border }]}
                onPress={() => setRenameModalVisible(false)}
                disabled={renameBusy}
              >
                <Text style={{ color: theme.secondaryText, fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleSaveRename}
                disabled={renameBusy || !newDeviceName.trim()}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {renameBusy ? "Saving…" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Safety Profile Modal */}
      <Modal
        visible={editProfileVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                maxHeight: "90%",
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Safety Profile
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.secondaryText }]}>
              Update your emergency contacts and physical specifications for medical dispatch.
            </Text>

            <ScrollView style={{ marginTop: 14, marginBottom: 16 }}>
              <Text style={[styles.modalFieldLabel, { color: theme.secondaryText }]}>
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
                value={profileForm.phoneNumber}
                onChangeText={(text) =>
                  setProfileForm((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={theme.secondaryText}
                keyboardType="phone-pad"
              />

              <Text style={[styles.modalFieldLabel, { color: theme.secondaryText }]}>
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
                value={profileForm.emergencyContactName}
                onChangeText={(text) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    emergencyContactName: text,
                  }))
                }
                placeholder="e.g. Jane Doe"
                placeholderTextColor={theme.secondaryText}
              />

              <Text style={[styles.modalFieldLabel, { color: theme.secondaryText }]}>
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
                value={profileForm.emergencyContactPhone}
                onChangeText={(text) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    emergencyContactPhone: text,
                  }))
                }
                placeholder="+1 (555) 999-9999"
                placeholderTextColor={theme.secondaryText}
                keyboardType="phone-pad"
              />

              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalFieldLabel, { color: theme.secondaryText }]}>
                    Height (cm)
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
                    value={profileForm.height}
                    onChangeText={(text) =>
                      setProfileForm((prev) => ({ ...prev, height: text }))
                    }
                    placeholder="175"
                    placeholderTextColor={theme.secondaryText}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalFieldLabel, { color: theme.secondaryText }]}>
                    Weight (kg)
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
                    value={profileForm.weight}
                    onChangeText={(text) =>
                      setProfileForm((prev) => ({ ...prev, weight: text }))
                    }
                    placeholder="70"
                    placeholderTextColor={theme.secondaryText}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { borderColor: theme.border }]}
                onPress={() => setEditProfileVisible(false)}
                disabled={profileBusy}
              >
                <Text style={{ color: theme.secondaryText, fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleSaveProfile}
                disabled={profileBusy}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {profileBusy ? "Saving…" : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 4,
  },

  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  profileAvatarText: {
    fontSize: 24,
    fontWeight: "800",
  },

  profileUsername: {
    fontSize: 18,
    fontWeight: "800",
  },

  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.12)",
  },

  infoLabel: {
    fontSize: 13,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  statsStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },

  statBoxLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  statBoxValue: {
    fontSize: 16,
    fontWeight: "800",
  },

  modalFieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },

  twoColumnRow: {
    flexDirection: "row",
    gap: 12,
  },

  label: {
    fontSize: 11,
    marginTop: 7,
  },

  value: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },

  id: {
    fontSize: 11,
    marginTop: 4,
  },

  info: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    fontSize: 14,
  },

  primaryButton: {
    height: 52,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "800",
  },

  secondaryButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  dangerButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deviceListRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logout: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  modalCancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  modalSaveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
