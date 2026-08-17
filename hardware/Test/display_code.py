from machine import Pin, SPI, SoftI2C,PWM
import ili9341
from xglcd_font import XglcdFont
import dht
import time
import machine

backlight = PWM(Pin(20), freq=1000, duty_u16=32768)
# 1. Initialize Display in Landscape
spi = SPI(1, baudrate=40000000, sck=Pin(38), mosi=Pin(41))
display = ili9341.Display(spi, cs=Pin(10), dc=Pin(39), rst=Pin(40), 
                          rotation=90, width=320, height=240)

# 2. Load XGLCD Font (Update path and size for your specific font file)
# Example: Using a font file named 'Unispace12x24.c'
font = XglcdFont('Unispace12x24.c', 12, 24)

# 3. Initialize Sensors
dht_sensor = dht.DHT22(machine.Pin(4))

# MAX30100 initialization depends on your specific library
# i2c = SoftI2C(scl=Pin(9), sda=Pin(8))
# pulse_ox = MAX30100(i2c) 

def center_text(text, y_pos, color):
    text_width = font.measure_text(text)
    x_pos = (320 - text_width) // 2
    display.draw_text(x_pos, y_pos, text, font, color)

while True:
    try:
        # Get DHT22 readings
        dht_sensor.measure()
        temp = dht_sensor.temperature()
        hum = dht_sensor.humidity()
        
        # Dummy MAX30100 readings (replace with actual pulse_ox.read() logic)
        bpm, spo2 = 75, 98 

        display.clear() # Clear screen

        # Line 1: Welcome Message (Top Center)
        center_text("WELCOME", 10, ili9341.color565(255, 255, 0))

        # Line 2: Heart Rate & SpO2
        hr_ox_text = "HR: {} BPM | SpO2: {}%".format(bpm, spo2)
        display.draw_text(10, 60, hr_ox_text, font, ili9341.color565(255, 0, 0))

        # Line 3: Temp & Humidity
        env_text = "Temp: {} C | Hum: {}%".format(temp, hum)
        display.draw_text(10, 100, env_text, font, ili9341.color565(0, 255, 0))

        # Space reserved for GPS (Latitude/Longitude)
        display.draw_text(10, 160, "GPS: Waiting for fix...", font, ili9341.color565(150, 150, 150))

        time.sleep(2)
    except Exception as e:
        print("Sensor error:", e)
