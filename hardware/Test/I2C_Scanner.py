from machine import Pin, I2C
import time

# Initialize the I2C bus once (Change pins to match your board)
# Example for Raspberry Pi Pico / ESP32 standard pins
i2c = I2C(0, scl=Pin(37), sda=Pin(20), freq=400000)

print("Scanning I2C bus...")
devices = i2c.scan()

if len(devices) == 0:
    print("No I2C devices found! Check your wiring and power lines.")
else:
    print(f"Found {len(devices)} device(s):")
    for device in devices:
        print(f"  - Decimal: {device} | Hex Address: {hex(device)}")
