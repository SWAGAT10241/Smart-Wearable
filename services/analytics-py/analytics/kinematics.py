import math
from typing import List, Dict, Any, Tuple

class KinematicFallDetector:
    """
    3-Stage Kinematic Fall Verification Engine:
    Stage 1: Freefall Detection (vector magnitude < 0.6g)
    Stage 2: Impact / Shock Spike (vector magnitude > 2.5g)
    Stage 3: Post-Shock Immobility Verification (> 10s low variance)
    """

    def __init__(
        self,
        freefall_threshold_g: float = 0.6,
        impact_threshold_g: float = 2.5,
        immobility_variance_threshold_g: float = 0.15,
    ):
        self.freefall_threshold_g = freefall_threshold_g
        self.impact_threshold_g = impact_threshold_g
        self.immobility_variance_threshold_g = immobility_variance_threshold_g

    @staticmethod
    def vector_magnitude(ax: float, ay: float, az: float) -> float:
        return math.sqrt(ax * ax + ay * ay + az * az)

    def verify_fall_sequence(
        self,
        pre_impact_samples: List[Tuple[float, float, float]],
        impact_sample: Tuple[float, float, float],
        post_impact_samples: List[Tuple[float, float, float]],
    ) -> Dict[str, Any]:
        """
        Evaluates a sequence of 3-axis accelerometer readings around an impact event.
        """
        # 1. Verify impact shock
        impact_mag = self.vector_magnitude(*impact_sample)
        has_impact_spike = impact_mag >= self.impact_threshold_g

        # 2. Check for pre-impact freefall dip if samples provided
        has_freefall = False
        if pre_impact_samples:
            min_pre_mag = min(self.vector_magnitude(*s) for s in pre_impact_samples)
            has_freefall = min_pre_mag <= self.freefall_threshold_g

        # 3. Check for post-impact immobility
        is_immobile = False
        post_variance = 0.0
        if post_impact_samples:
            mags = [self.vector_magnitude(*s) for s in post_impact_samples]
            mean_mag = sum(mags) / len(mags)
            post_variance = sum((m - mean_mag) ** 2 for m in mags) / len(mags)
            is_immobile = post_variance <= (self.immobility_variance_threshold_g ** 2)

        # Confidence calculation
        confidence = 0.0
        if has_impact_spike:
            confidence += 0.50
        if has_freefall:
            confidence += 0.25
        if is_immobile:
            confidence += 0.25

        verified_fall = has_impact_spike and (is_immobile or has_freefall)

        return {
            "verified_fall": verified_fall,
            "confidence": round(confidence, 2),
            "impact_magnitude_g": round(impact_mag, 2),
            "has_freefall_dip": has_freefall,
            "post_impact_immobility": is_immobile,
            "post_impact_variance": round(post_variance, 4),
        }
