from machine import Pin
import time

# Configure GPIO 14 as a standard digital output pin
buzzer = Pin(1, Pin.OUT)

try:
    while True:
        buzzer.value(1)       # Send 3.3V to turn the Goli buzzer ON
        time.sleep(0.2)       # Sound duration (200 milliseconds)
        
        buzzer.value(0)       # Cut voltage to turn the buzzer OFF
        time.sleep(0.2)       # Silent gap duration
        
except KeyboardInterrupt:
    # Safe exit routine to guarantee the buzzer stops sounding when you stop the script
    buzzer.value(0)
    print("Buzzer system deactivated safely.")
