from typing import Dict, Any

class BiometricAnalyzer:
    """
    Real-time physiological risk analyzer for SWAAS / TrailGuard wearables.
    Detects acute hypoxia, cardiac arrhythmia alerts, and extreme thermal distress.
    """

    @staticmethod
    def analyze_vitals(
        heart_rate: int,
        spo2: int,
        temperature_c: float,
    ) -> Dict[str, Any]:
        alerts = []
        severity = "NORMAL"
        risk_score = 0.0

        # 1. SpO2 Hypoxemia Analysis
        if spo2 > 0:
            if spo2 < 85:
                alerts.append("CRITICAL_HYPOXIA")
                severity = "CRITICAL"
                risk_score += 0.50
            elif spo2 < 90:
                alerts.append("SEVERE_OXYGEN_DESATURATION")
                severity = max(severity, "HIGH")
                risk_score += 0.35
            elif spo2 < 94:
                alerts.append("MILD_HYPOXEMIA")
                severity = max(severity, "MODERATE")
                risk_score += 0.15

        # 2. Heart Rate Arrhythmia / Stress Analysis
        if heart_rate > 0:
            if heart_rate < 40:
                alerts.append("SEVERE_BRADYCARDIA")
                severity = "CRITICAL"
                risk_score += 0.45
            elif heart_rate < 50:
                alerts.append("BRADYCARDIA_WARNING")
                severity = max(severity, "MODERATE")
                risk_score += 0.20
            elif heart_rate > 165:
                alerts.append("EXTREME_TACHYCARDIA")
                severity = "CRITICAL"
                risk_score += 0.45
            elif heart_rate > 140:
                alerts.append("HIGH_CARDIAC_STRAIN")
                severity = max(severity, "HIGH")
                risk_score += 0.25

        # 3. Core Temperature Analysis
        if temperature_c > 0:
            if temperature_c < 35.0:
                alerts.append("HYPOTHERMIA_DANGER")
                severity = "CRITICAL"
                risk_score += 0.40
            elif temperature_c > 39.5:
                alerts.append("HYPERTHERMIA_HEATSTROKE")
                severity = "CRITICAL"
                risk_score += 0.40

        risk_score = min(1.0, round(risk_score, 2))

        return {
            "severity": severity,
            "risk_score": risk_score,
            "alerts": alerts,
            "metrics": {
                "heart_rate": heart_rate,
                "spo2": spo2,
                "temperature_c": round(temperature_c, 1),
            },
        }
