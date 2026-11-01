import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useLiveData } from "../context/LiveDataContext";
import { fallsApi } from "../lib/apiClient";
import { useAppTheme } from "../theme/theme";
import { WarningIcon } from "./Icons";

const COUNTDOWN_SECONDS = 30;

export default function FallAlertModal() {
  const theme = useAppTheme();
  const { activeFall, dismissFall } = useLiveData();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!activeFall) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      return undefined;
    }

    // Trigger alert vibration pattern
    try {
      Vibration.vibrate([0, 500, 200, 500]);
    } catch {
      // Ignore vibration error on unsupported platforms
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoEscalation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeFall]);

  if (!activeFall) return null;

  const handle = async (status) => {
    try {
      await fallsApi.updateStatus(activeFall._id, status);
    } catch {
      // ignore network errors, still dismiss locally
    }
    dismissFall();
  };

  const handleAutoEscalation = async () => {
    try {
      await fallsApi.updateStatus(activeFall._id, "escalated_sos");
    } catch {
      // ignore network errors
    }
    dismissFall();
  };

  const severity = (activeFall.severity || "moderate").toUpperCase();

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.danger,
            },
          ]}
        >
          {/* Pulsing Emergency Header Badge */}
          <View
            style={[
              styles.badge,
              {
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              },
            ]}
          >
            <WarningIcon size={14} color={theme.danger} />
            <Text style={[styles.badgeText, { color: theme.danger }]}>
              {severity} SEVERITY FALL DETECTED
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Are you okay?
          </Text>

          <Text style={[styles.body, { color: theme.secondaryText }]}>
            {activeFall.latitude && activeFall.longitude
              ? `Coordinates: ${Number(activeFall.latitude).toFixed(4)}, ${Number(
                  activeFall.longitude,
                ).toFixed(4)}.\n`
              : ""}
            {activeFall.tiltAngle
              ? `Impact tilt angle: ${activeFall.tiltAngle}°.`
              : "Sudden impact detected."}
          </Text>

          {/* Countdown Indicator */}
          <View
            style={[
              styles.countdownBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.countdownLabel, { color: theme.secondaryText }]}>
              Auto-escalating to Emergency Contacts in:
            </Text>
            <Text
              style={[
                styles.countdownTimer,
                {
                  color: secondsLeft <= 10 ? theme.danger : theme.warning,
                },
              ]}
            >
              {secondsLeft}s
            </Text>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(secondsLeft / COUNTDOWN_SECONDS) * 100}%`,
                  backgroundColor:
                    secondsLeft <= 10 ? theme.danger : theme.warning,
                },
              ]}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.okButton, { backgroundColor: theme.primary }]}
              onPress={() => handle("confirmed_false_alarm")}
            >
              <Text style={styles.okText}>I'm OK (False Alarm)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: theme.danger }]}
              onPress={() => handle("escalated_sos")}
            >
              <Text style={styles.alertText}>SOS Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  countdownBox: {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  countdownLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  countdownTimer: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  okButton: {
    flex: 1.2,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  okText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  alertButton: {
    flex: 0.9,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});
