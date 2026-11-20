class GPSKalmanFilter:
    """
    Kalman filter for 2D/3D GPS positioning in mountainous terrain.
    Smooths GPS multipath reflection jitter and altitude drift.
    """

    def __init__(
        self,
        process_noise: float = 1e-5,
        measurement_noise: float = 1e-4,
        initial_error: float = 1.0,
    ):
        self.q = process_noise  # Process covariance
        self.r = measurement_noise  # Measurement covariance
        
        # State estimates
        self.lat = 0.0
        self.lon = 0.0
        self.alt = 0.0

        # Covariance matrices
        self.p_lat = initial_error
        self.p_lon = initial_error
        self.p_alt = initial_error
        self.initialized = False

    def update(self, lat: float, lon: float, alt: float) -> tuple:
        if not self.initialized:
            self.lat = lat
            self.lon = lon
            self.alt = alt
            self.initialized = True
            return self.lat, self.lon, self.alt

        # 1. Prediction step
        self.p_lat += self.q
        self.p_lon += self.q
        self.p_alt += self.q

        # 2. Kalman gain
        k_lat = self.p_lat / (self.p_lat + self.r)
        k_lon = self.p_lon / (self.p_lon + self.r)
        k_alt = self.p_alt / (self.p_alt + self.r)

        # 3. Update estimate with measurement
        self.lat = self.lat + k_lat * (lat - self.lat)
        self.lon = self.lon + k_lon * (lon - self.lon)
        self.alt = self.alt + k_alt * (alt - self.alt)

        # 4. Update error covariance
        self.p_lat = (1.0 - k_lat) * self.p_lat
        self.p_lon = (1.0 - k_lon) * self.p_lon
        self.p_alt = (1.0 - k_alt) * self.p_alt

        return round(self.lat, 7), round(self.lon, 7), round(self.alt, 1)
