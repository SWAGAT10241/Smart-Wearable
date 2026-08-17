# test_gps_bytes.py — checks for raw byte activity on UART, no decoding
from machine import UART, Pin
import time

gps_uart = UART(1, baudrate=9600, rx=Pin(16), tx=Pin(17))

print("Checking for any byte activity on UART1 (rx=16, tx=17)...")
print("If nothing prints for 10+ seconds, it's a wiring/pin issue, not a GPS fix issue.\n")

byte_count = 0
start = time.ticks_ms()

try:
    while True:
        if gps_uart.any():
            n = gps_uart.any()
            data = gps_uart.read(n)
            byte_count += len(data)
            print("Got {} bytes: {}".format(len(data), data))

        # Print a heartbeat every 2s so you know the loop itself is alive
        if time.ticks_diff(time.ticks_ms(), start) >= 2000:
            print("...still listening, total bytes so far: {}".format(byte_count))
            start = time.ticks_ms()

        time.sleep_ms(50)

except KeyboardInterrupt:
    print("Stopped. Total bytes received:", byte_count)