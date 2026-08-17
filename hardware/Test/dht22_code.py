import dht
import machine
import time

# 1. Initialize the sensor on your chosen GPIO pin
# Replacing 13 with the GPIO pin you are using
sensor = dht.DHT22(machine.Pin(4))

while True:
    try:
        # 2. Trigger the measurement
        sensor.measure()
        
        # 3. Retrieve values (Celsius and relative humidity %)
        temp = sensor.temperature()
        hum = sensor.humidity()

        print("Temperature: {:.1f}°C".format(temp))
        print("Humidity: {:.1f}%".format(hum))
        
    except OSError as e:
        print("Failed to read sensor.")

    # 4. Wait at least 2 seconds between readings for accuracy
    time.sleep(2)
