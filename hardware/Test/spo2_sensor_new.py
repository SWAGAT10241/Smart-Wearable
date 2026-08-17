# test_max30100.py — standalone SpO2/HR sensor test
from machine import Pin, I2C
import time
from max30100 import MAX30100   # the merged driver file from before

# Adjust pins to match your wiring
i2c = I2C(1, scl=Pin(9), sda=Pin(8), freq=400000)

print("Initializing MAX30100...")
sensor = MAX30100(i2c)
print("Sensor ready. Place your finger on it.\n")

last_status_print = time.ticks_ms()

try:
    while True:
        sensor.update()  # drains FIFO, runs beat detection internally

        # Print live status every 500ms regardless of window completion,
        # so you can see it's alive even before the first HR/SpO2 result
        now = time.ticks_ms()
        if time.ticks_diff(now, last_status_print) >= 500:
            hr, spo2, valid = sensor.get_readings()

            if not sensor.finger_present:
                print("No finger detected...")
            elif valid:
                print("HR: {:.1f} bpm | SpO2: {:.1f}% | signal amp: {:.1f}".format(
                    hr, spo2, sensor.signal_peak))
            else:
                print("Finger detected, stabilizing... (signal amp: {:.1f})".format(
                    sensor.signal_peak))

            last_status_print = now

        time.sleep_ms(15)

except KeyboardInterrupt:
    print("Test stopped.")