from typing import Dict, Any
from .kinematics import KinematicFallDetector
from .biometrics import BiometricAnalyzer
from .kalman import GPSKalmanFilter

class AnomalyEngine:
    """
    Unified AI & Biometric Anomaly Detection Engine for SWAAS.
    Coordinates kinematics, biometrics, and GPS Kalman filtering.
    """

    def __init__(self):
        self.fall_detector = KinematicFallDetector()
        self.biometrics = BiometricAnalyzer()
        self.gps_filters: Dict[str, GPSKalmanFilter] = {}

    def process_telemetry(self, data: Dict[str, Any]) -> Dict[str, Any]:
        device_id = data.get("device_id", "UNKNOWN")
        vitals = self.biometrics.analyze_vitals(
            heart_rate=int(data.get("heart_rate", 0)),
            spo2=int(data.get("spo2", 0)),
            temperature_c=float(data.get("temperature_c", 0.0)),
        )

        # GPS Kalman filtering
        lat = float(data.get("latitude", 0.0))
        lon = float(data.get("longitude", 0.0))
        alt = float(data.get("altitude_m", 0.0))

        if device_id not in self.gps_filters:
            self.gps_filters[device_id] = GPSKalmanFilter()
        smooth_lat, smooth_lon, smooth_alt = self.gps_filters[device_id].update(lat, lon, alt)

        # Kinematic status
        fall_detected = bool(data.get("fall_detected", False))
        sos_active = bool(data.get("sos_active", False))

        # Overall incident risk level
        overall_risk = vitals["risk_score"]
        if fall_detected:
            overall_risk = min(1.0, overall_risk + 0.45)
        if sos_active:
            overall_risk = 1.0

        emergency_escalation_required = (overall_risk >= 0.70) or sos_active

        return {
            "device_id": device_id,
            "overall_risk_score": round(overall_risk, 2),
            "emergency_escalation_required": emergency_escalation_required,
            "vitals_assessment": vitals,
            "smoothed_location": {
                "latitude": smooth_lat,
                "longitude": smooth_lon,
                "altitude_m": smooth_alt,
            },
            "status_flags": {
                "fall_detected": fall_detected,
                "sos_active": sos_active,
            },
        }
