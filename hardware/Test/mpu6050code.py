import time
import machine
from mpu6050 import MPU6050

# 1. Initialize Hardware I2C on ESP32-S3
# Default pins for many S3 boards are SDA=11, SCL=12. Adjust if your board differs.
i2c = machine.I2C(0, sda=machine.Pin(2), scl=machine.Pin(1), freq=400000)

# 2. Initialize the Sensor
try:
    sensor = MPU6050(i2c)
    print("MPU6050 detected successfully!")
except Exception as e:
    print("Failed to find MPU6050. Check your wiring!", e)
    machine.reset()

# 3. Create or Clear the log file header at boot
with open("sensor_log.txt", "w") as f:
    f.write("Timestamp(ms),AccX(g),AccY(g),AccZ(g),GyroX(d/s),GyroY(d/s),GyroZ(d/s)\n")

print("Logging started. Press Ctrl+C in Thonny to stop.")

# 4. Data Logging Loop
while True:
    try:
        # Get reading timestamp
        timestamp = time.ticks_ms()
        
        # Read data from driver
        data = sensor.get_values()
        
        # Format data as a CSV row string
        log_entry = f"{timestamp},{data['AcX']:.2f},{data['AcY']:.2f},{data['AcZ']:.2f},{data['GyX']:.2f},{data['GyY']:.2f},{data['GyZ']:.2f}\n"
        
        # Append data entry straight into flash storage
        with open("sensor_log.txt", "a") as f:
            f.write(log_entry)
            
        # Optional: Print to Thonny shell so you can watch live
        print(f"Logged at {timestamp}ms -> AccX: {data['AcX']:.2f}g, GyroX: {data['GyX']:.2f}°/s")
        
        # Log interval (e.g., 500 milliseconds)
        time.sleep(0.5)
        
    except KeyboardInterrupt:
        print("\nLogging stopped by user.")
        break
    except Exception as e:
        print("Logging error occurred:", e)
        time.sleep(1)
