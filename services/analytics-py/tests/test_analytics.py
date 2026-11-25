import unittest
from analytics.kinematics import KinematicFallDetector
from analytics.biometrics import BiometricAnalyzer
from analytics.kalman import GPSKalmanFilter
from analytics.engine import AnomalyEngine

class TestAnalytics(unittest.TestCase):
    def setUp(self):
        self.fall_detector = KinematicFallDetector()
        self.biometrics = BiometricAnalyzer()
        self.engine = AnomalyEngine()

    def test_kinematic_fall_verification(self):
        # 1. Normal walking (no fall)
        pre = [(0.1, 0.2, 0.98), (0.12, 0.18, 1.02)]
        impact = (0.3, 0.4, 1.1)
        post = [(0.1, 0.2, 1.0), (0.15, 0.22, 0.95)]
        res = self.fall_detector.verify_fall_sequence(pre, impact, post)
        self.assertFalse(res["verified_fall"])

        # 2. Freefall dip + violent shock (>2.5g) + immobility
        pre_fall = [(0.05, 0.05, 0.2)]  # Freefall (<0.6g)
        impact_shock = (1.8, 1.2, 2.6)  # High impact (>3g magnitude)
        post_immobile = [(0.01, 0.02, 0.98), (0.01, 0.02, 0.98), (0.01, 0.02, 0.98)]
        fall_res = self.fall_detector.verify_fall_sequence(pre_fall, impact_shock, post_immobile)
        self.assertTrue(fall_res["verified_fall"])
        self.assertGreaterEqual(fall_res["confidence"], 0.75)

    def test_biometric_anomaly_detection(self):
        # Normal
        normal = self.biometrics.analyze_vitals(heart_rate=72, spo2=98, temperature_c=36.6)
        self.assertEqual(normal["severity"], "NORMAL")
        self.assertEqual(normal["alerts"], [])

        # Critical Hypoxia + Extreme Tachycardia
        critical = self.biometrics.analyze_vitals(heart_rate=175, spo2=82, temperature_c=39.8)
        self.assertEqual(critical["severity"], "CRITICAL")
        self.assertIn("CRITICAL_HYPOXIA", critical["alerts"])
        self.assertIn("EXTREME_TACHYCARDIA", critical["alerts"])
        self.assertIn("HYPERTHERMIA_HEATSTROKE", critical["alerts"])
        self.assertGreaterEqual(critical["risk_score"], 0.8)

    def test_kalman_filter_convergence(self):
        kf = GPSKalmanFilter()
        # Feed noisy measurements around (45.0, 12.0, 1000)
        measurements = [
            (45.0005, 12.0004, 1005.0),
            (45.0002, 12.0001, 998.0),
            (44.9998, 11.9997, 1002.0),
            (45.0001, 12.0000, 1000.0),
        ]
        smoothed = []
        for lat, lon, alt in measurements:
            smoothed.append(kf.update(lat, lon, alt))
        
        last_lat, last_lon, last_alt = smoothed[-1]
        self.assertAlmostEqual(last_lat, 45.0, delta=0.001)
        self.assertAlmostEqual(last_lon, 12.0, delta=0.001)
        self.assertAlmostEqual(last_alt, 1000.0, delta=5.0)

    def test_unified_engine_pipeline(self):
        telemetry = {
            "device_id": "TRAILGUARD-TEST-001",
            "heart_rate": 150,
            "spo2": 88,
            "temperature_c": 37.0,
            "latitude": 45.1234,
            "longitude": 6.8901,
            "altitude_m": 2400,
            "fall_detected": True,
            "sos_active": False,
        }
        result = self.engine.process_telemetry(telemetry)
        self.assertEqual(result["device_id"], "TRAILGUARD-TEST-001")
        self.assertTrue(result["emergency_escalation_required"])
        self.assertGreaterEqual(result["overall_risk_score"], 0.70)

if __name__ == "__main__":
    unittest.main()
