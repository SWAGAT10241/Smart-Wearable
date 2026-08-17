from machine import Pin, I2C
import time
from max30100 import MAX30100

i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
sensor = MAX30100(i2c)

while True:
    ir, red = sensor.read_sensor()
    print(f"DIAGNOSTIC -> IR Raw: {ir} | Red Raw: {red}")
    time.sleep_ms(200)
