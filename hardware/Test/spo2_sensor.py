
# test_max30100.py — standalone test for the merged max30100.py driver
from machine import Pin, I2C
import time
from max30100 import MAX30100
 
# Adjust pins to match your wiring
i2c = I2C(1, scl=Pin(9), sda=Pin(8), freq=400000)
 
print("Initializing MAX30100...")
sensor = MAX30100(i2c)
print("Sensor ready. Place your finger on it.\n")
 
last_print = time.ticks_ms()
 
try:
    while True:
        # Poll fast (~15ms) so the 16-sample FIFO never overflows
        sensor.update()
 
        # Only print on a slower interval, independent of poll rate
        now = time.ticks_ms()
        if time.ticks_diff(now, last_print) >= 500:
            hr, spo2, finger_present = sensor.get_readings()
 
            if finger_present:
                print("Pulse Rate: {:.1f} BPM | SpO2: {:.1f}% | Signal Amp: {:.1f}".format(
                    hr, spo2, sensor.signal_peak))
            else:
                print("Finger status: Please place finger gently on sensor.")
 
            last_print = now
 
        time.sleep_ms(15)
 
except KeyboardInterrupt:
    print("Test stopped.")