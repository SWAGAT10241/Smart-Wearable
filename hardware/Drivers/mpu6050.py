"""
MPU6050 driver for MicroPython (ESP32-S3)
Configured for I2C(0) per TrailGuard hardware layout.

Usage:
    from machine import I2C, Pin
    from mpu6050 import MPU6050

    i2c0 = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)  # adjust pins to your wiring
    mpu = MPU6050(i2c0)

    ax, ay, az = mpu.read_accel()   # in g
    gx, gy, gz = mpu.read_gyro()    # in deg/s
    temp = mpu.read_temp()          # in Celsius
    data = mpu.read_all()           # dict with accel, gyro, temp
"""

from machine import I2C
import time
import struct

class MPU6050:
    # Register map
    _PWR_MGMT_1   = 0x6B
    _SMPLRT_DIV   = 0x19
    _CONFIG       = 0x1A
    _GYRO_CONFIG  = 0x1B
    _ACCEL_CONFIG = 0x1C
    _ACCEL_XOUT_H = 0x3B
    _TEMP_OUT_H   = 0x41
    _GYRO_XOUT_H  = 0x43
    _WHO_AM_I     = 0x75

    # Sensitivity scale factors (default full-scale ranges: ±2g, ±250 deg/s)
    _ACCEL_SCALE = 16384.0   # LSB/g
    _GYRO_SCALE  = 131.0     # LSB/(deg/s)

    def __init__(self, i2c: I2C, addr: int = 0x68):
        self.i2c = i2c
        self.addr = addr
        self._init_sensor()

    def _init_sensor(self):
        who = self.i2c.readfrom_mem(self.addr, self._WHO_AM_I, 1)[0]
        if who != 0x68 and who != 0x98:
            raise OSError("MPU6050 not found at address 0x{:02X} (WHO_AM_I=0x{:02X})".format(self.addr, who))

        # Wake up device (clear sleep bit)
        self.i2c.writeto_mem(self.addr, self._PWR_MGMT_1, b'\x00')
        time.sleep_ms(50)

        # Sample rate divider: 1kHz / (1 + 7) = 125Hz
        self.i2c.writeto_mem(self.addr, self._SMPLRT_DIV, b'\x07')

        # DLPF config: ~44Hz bandwidth, reduces noise for fall detection
        self.i2c.writeto_mem(self.addr, self._CONFIG, b'\x03')

        # Gyro full scale: ±250 deg/s
        self.i2c.writeto_mem(self.addr, self._GYRO_CONFIG, b'\x00')

        # Accel full scale: ±2g
        self.i2c.writeto_mem(self.addr, self._ACCEL_CONFIG, b'\x00')

    def _read_word(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        val = struct.unpack('>h', data)[0]  # signed 16-bit, big-endian
        return val

    def read_accel(self):
        """Returns (ax, ay, az) in g."""
        raw = self.i2c.readfrom_mem(self.addr, self._ACCEL_XOUT_H, 6)
        ax, ay, az = struct.unpack('>hhh', raw)
        return (ax / self._ACCEL_SCALE, ay / self._ACCEL_SCALE, az / self._ACCEL_SCALE)

    def read_gyro(self):
        """Returns (gx, gy, gz) in deg/s."""
        raw = self.i2c.readfrom_mem(self.addr, self._GYRO_XOUT_H, 6)
        gx, gy, gz = struct.unpack('>hhh', raw)
        return (gx / self._GYRO_SCALE, gy / self._GYRO_SCALE, gz / self._GYRO_SCALE)

    def read_temp(self):
        """Returns temperature in Celsius."""
        raw = self._read_word(self._TEMP_OUT_H)
        return raw / 340.0 + 36.53

    def read_accel_magnitude(self):
        """Returns total acceleration magnitude in g — useful for fall/impact detection."""
        ax, ay, az = self.read_accel()
        return (ax ** 2 + ay ** 2 + az ** 2) ** 0.5

    def read_all(self):
        """Returns a dict with accel, gyro, and temp in one call."""
        return {
            "accel": self.read_accel(),
            "gyro": self.read_gyro(),
            "temp": self.read_temp(),
        }
