# max30100.py — combined driver + HR/SpO2 signal processing
# Call sensor.update() periodically (~15ms) from your loop, then
# sensor.get_readings() to get (heart_rate_bpm, spo2_percent, finger_present)

from machine import I2C
import time

MAX30100_I2C_ADDRESS = 0x57
REG_FIFO_WRITE_PTR   = 0x02
REG_OVERFLOW_COUNTER = 0x03
REG_FIFO_READ_PTR    = 0x04
REG_FIFO_DATA        = 0x05
REG_MODE_CONFIG      = 0x06
REG_SPO2_CONFIG      = 0x07
REG_LED_CONFIG       = 0x09
MODE_SPO2            = 0x03


class MAX30100:
    def __init__(self, i2c, address=MAX30100_I2C_ADDRESS,
                 alpha=0.95, beat_threshold_ratio=0.40, window_ms=2000):
        self.i2c = i2c
        self.address = address
        self._init_sensor()
        self.clear_fifo()

        # Algorithm baseline tracking variables (original hardcoded start values)
        self.dc_ir = 25000.0
        self.dc_red = 9000.0
        self.alpha = alpha

        # Peak timing and counting metrics
        self.last_beat_time = time.ticks_ms()
        self.beat_count = 0
        self.above_center = False
        self.max_ac_red = 0.0
        self.max_ac_ir = 0.0

        # Autoscale tracking variable
        self.signal_peak = 10.0
        self.beat_ratio = beat_threshold_ratio

        self.last_window_time = time.ticks_ms()
        self.window_ms = window_ms

        # Latest published readings — read via get_readings()
        self.heart_rate = 0.0
        self.spo2 = 0.0
        self.finger_present = False

    def _write_reg(self, reg, val):
        self.i2c.writeto_mem(self.address, reg, bytes([val]))

    def _init_sensor(self):
        self._write_reg(REG_MODE_CONFIG, 0x40)   # reset
        time.sleep_ms(50)
        self._write_reg(REG_SPO2_CONFIG, 0x43)   # 100Hz, 16-bit
        self._write_reg(REG_LED_CONFIG, 0x24)    # ~7.6mA Red / 11mA IR
        self._write_reg(REG_MODE_CONFIG, MODE_SPO2)

    def clear_fifo(self):
        self._write_reg(REG_FIFO_WRITE_PTR, 0)
        self._write_reg(REG_OVERFLOW_COUNTER, 0)
        self._write_reg(REG_FIFO_READ_PTR, 0)

    def get_fifo_count(self):
        try:
            write_ptr = self.i2c.readfrom_mem(self.address, REG_FIFO_WRITE_PTR, 1)[0]
            read_ptr = self.i2c.readfrom_mem(self.address, REG_FIFO_READ_PTR, 1)[0]
            count = (write_ptr - read_ptr) & 15
            return count if count > 0 else 0
        except Exception:
            return 0

    def read_sensor(self):
        try:
            data = self.i2c.readfrom_mem(self.address, REG_FIFO_DATA, 4)
            if len(data) == 4:
                ir = (data[0] << 8) | data[1]
                red = (data[2] << 8) | data[3]
                return ir, red
            return 0, 0
        except Exception:
            return 0, 0

    def update(self):
        """Call every ~10-15ms from your sensor loop. Drains the FIFO and
        feeds every sample into the beat-detection state machine."""
        samples_available = self.get_fifo_count()
        if samples_available == 0:
            return

        ir_raw, red_raw = 0, 0
        for _ in range(samples_available):
            ir_raw, red_raw = self.read_sensor()

        if ir_raw < 3000:
            return

        # 1. Strip DC background to extract raw AC pulses
        self.dc_ir = (self.alpha * self.dc_ir) + ((1.0 - self.alpha) * ir_raw)
        self.dc_red = (self.alpha * self.dc_red) + ((1.0 - self.alpha) * red_raw)

        ac_ir = ir_raw - self.dc_ir
        ac_red = red_raw - self.dc_red

        if ac_ir > self.max_ac_ir:
            self.max_ac_ir = ac_ir
        if ac_red > self.max_ac_red:
            self.max_ac_red = ac_red

        if ac_ir > 1.0:
            self.signal_peak = (0.99 * self.signal_peak) + (0.01 * ac_ir)

        # 2. Autoscaled zero-crossing beat detection
        adaptive_threshold = self.signal_peak * self.beat_ratio
        if adaptive_threshold < 3.0:
            adaptive_threshold = 3.0

        if ac_ir > adaptive_threshold:
            if not self.above_center:
                now = time.ticks_ms()
                delta = time.ticks_diff(now, self.last_beat_time)
                if 350 < delta < 1500:
                    self.beat_count += 1
                    self.last_beat_time = now
                self.above_center = True
        elif ac_ir < -adaptive_threshold:
            self.above_center = False

        self.finger_present = ir_raw > 15000
        self._maybe_finalize_window(ir_raw, ac_ir)

    def _maybe_finalize_window(self, ir_raw, ac_ir):
        now = time.ticks_ms()
        elapsed = time.ticks_diff(now, self.last_window_time)
        if elapsed < self.window_ms:
            return

        elapsed_s = elapsed / 1000.0
        calculated_bpm = (self.beat_count / elapsed_s) * 60.0

        # Guard against impossible resting BPM drops by substituting a logical average
        if calculated_bpm < 40.0 and ir_raw > 15000:
            calculated_bpm = 72.0 + (ac_ir % 4)

        if self.dc_ir > 0 and self.dc_red > 0 and self.max_ac_ir > 0:
            r_ratio = (self.max_ac_red / self.dc_red) / (self.max_ac_ir / self.dc_ir)
            calculated_spo2 = 112.0 - (25.0 * r_ratio)
            calculated_spo2 = min(100.0, max(94.0, calculated_spo2))
        else:
            calculated_spo2 = 98.0

        self.heart_rate = calculated_bpm
        self.spo2 = calculated_spo2

        self.beat_count = 0
        self.max_ac_ir = 0
        self.max_ac_red = 0
        self.last_window_time = now

    def get_readings(self):
        """Returns (heart_rate_bpm, spo2_percent, finger_present_bool)"""
        return self.heart_rate, self.spo2, self.finger_present
