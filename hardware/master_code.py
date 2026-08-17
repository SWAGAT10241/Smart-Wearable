#Master Code
#importing dependencies
from machine import Pin, SPI, PWM, I2C, UART
import ili9341
from xglcd_font import XglcdFont
import dht
import time
from mpu6050 import MPU6050
from max30100 import MAX30100
import uasyncio as asyncio
import ujson
import network
import urequests
import machine
from micropython_gps import MicropythonGPS
from ili9341 import color565
import math

#setup code for state variables
#For dht22
_dht_last_read = 0
_DHT_READ_INTERVAL_MS = 60000  # 1 minute

#For MPU6050
# ---- Fall detection thresholds ----
FREE_FALL_MIN_G = 0.30
FREE_FALL_MAX_G = 0.35
IMPACT_G_THRESHOLD = 2.4
ROTATION_DEG_S_THRESHOLD = 240
IMPACT_WINDOW_MS = 500              # 0.5s window for impact + rotation
POSTURE_CHANGE_MIN_DEG = 45         # lower bound of your 45-60deg range
STILLNESS_WINDOW_MS = 2000          # midpoint of your 1-3s range
STILLNESS_ACC_TOLERANCE_G = 0.2     # |A - 1.0g| must stay under this to count as "still"
STILLNESS_GYRO_TOLERANCE_DEG_S = 15

# ---- Internal state machine ----
_STATE_IDLE = 0
_STATE_WAIT_IMPACT = 1
_STATE_WAIT_STILLNESS = 2

_state = _STATE_IDLE
_possible_fall_time = 0
_impact_confirmed = False
_rotation_confirmed = False
_baseline_vector = (0.0, 0.0, 0.0)
_peak_accel_g = 0.0
_peak_gyro_dps = 0.0
_stillness_start_time = 0

#For buzzer
BUZZER_PIN = 1
BUZZER_DURATION_MS = 10000  # how long it sounds once triggered

#For Neo6M
_GPS_PUBLISH_INTERVAL_MS = 120000  # 2 minutes
_gps_last_publish = 0

#For display
# ---- Colors ----
COLOR_WHITE   = ili9341.color565(255, 255, 255)
COLOR_BLACK   = ili9341.color565(0, 0, 0)
COLOR_RED     = ili9341.color565(255, 0, 0)
COLOR_YELLOW  = ili9341.color565(255, 255, 0)
COLOR_GREEN   = ili9341.color565(0, 255, 0)
COLOR_GRAY    = ili9341.color565(150, 150, 150)

# ---- Layout (matches your confirmed 320x240 landscape rotation) ----
TITLE_Y   = 10
ROW1_Y    = 60    # HR / SpO2
ROW2_Y    = 100   # Temp / Humidity
ROW3_Y    = 160   # Lat / Lon
ROW_HEIGHT = 30   # tall enough to fully clear one line at this font size
LEFT_MARGIN = 10

# ---- Default location (shown with red 'D' when no real fix has ever
# been obtained — e.g. device started up indoors) ----
DEFAULT_LAT, DEFAULT_LON = 20.2961, 85.8245  # replace with your actual default/base location

#WIFI setup
WIFI_SSID = "Airtel_HIG-4 Floor 1"
WIFI_PASSWORD = "Ayushman"

#json setup
_json_last_send = 0
_JSON_SEND_INTERVAL_MS = 60000 


#setting up pins
try:
    dht_sensor = dht.DHT22(Pin(4))  #DHT22 Pin set
except Exception as e:
    print("DHT22 init failed:", e)
    dht_sensor = None


try:
    i2c_mpu = I2C(0, sda=machine.Pin(11), scl=machine.Pin(12), freq=400000)
    mpu_sensor = MPU6050(i2c_mpu)   #mpu6050 Pin set
except Exception as e:
    print("MPU6050 init failed:", e)
    mpu_sensor=None
    


try:
    i2c_max30100 = I2C(1, scl=Pin(9), sda=Pin(8), freq=400000)
    max30100_sensor = MAX30100(i2c_max30100)         #max30100 Pin set
except Exception as e:
    print("MAX30100 init failed:", e)
    max30100_sensor = None
    
_buzzer = machine.Pin(BUZZER_PIN, machine.Pin.OUT)
_buzzer.value(0)

_buzzer_active = False
_buzzer_start_time = 0
_last_known_lat = None
_last_known_lon = None
_has_ever_had_fix = False

try:
    # Internal pull-up on RX needed — confirmed necessary during testing
    # to stabilize the line and get clean NMEA output
    gps_rx_pin = Pin(16, Pin.IN, Pin.PULL_UP)
    gps_uart = UART(1, baudrate=9600, rx=Pin(16), tx=Pin(17))
    gps = MicropythonGPS()
except Exception as e:
    print("NEO-6M init failed:", e)
    gps_uart = None
    gps = None



#declaring functions

def poll_max30100(sensor, sensor_data):
    """Call every loop iteration (~15ms). Drains the sensor FIFO and
    stores the latest readings into sensor_data. No printing."""
    if sensor is None:
        sensor_data["heart_rate"] = None
        sensor_data["spo2"] = None
        sensor_data["finger_present"] = False
        return
    sensor.update()
    hr, spo2, finger_present = sensor.get_readings()
 
    sensor_data["heart_rate"] = hr
    sensor_data["spo2"] = spo2
    sensor_data["finger_present"] = finger_present




def poll_dht22(dht_sensor, sensor_data, interval_ms=_DHT_READ_INTERVAL_MS):
    """Call every loop iteration (~15ms is fine). Internally rate-limited —
    only actually reads the sensor once per interval_ms. Stores readings
    into sensor_data. No printing."""
    global _dht_last_read

    if dht_sensor is None:
        sensor_data["temperature"] = None
        sensor_data["humidity"] = None
        return

    now = time.ticks_ms()
    if time.ticks_diff(now, _dht_last_read) < interval_ms:
        return  # not time yet, leave existing stored values as-is

    try:
        dht_sensor.measure()
        sensor_data["temperature"] = dht_sensor.temperature()
        sensor_data["humidity"] = dht_sensor.humidity()
    except Exception as e:
        # DHT22 reads occasionally fail (timing/checksum) — keep last
        # known good values rather than overwriting with garbage
        print("DHT22 read failed:", e)

    _dht_last_read = now



def _accel_magnitude(ax, ay, az):
    return math.sqrt(ax * ax + ay * ay + az * az)

def _gyro_magnitude(gx, gy, gz):
    return math.sqrt(gx * gx + gy * gy + gz * gz)

def _vector_angle_deg(v1, v2):
    """Angle in degrees between two 3D accel vectors (orientation change)."""
    dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
    mag1 = math.sqrt(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2)
    mag2 = math.sqrt(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2)
    if mag1 == 0 or mag2 == 0:
        return 0.0
    cos_theta = dot / (mag1 * mag2)
    cos_theta = max(-1.0, min(1.0, cos_theta))  # clamp for float rounding
    return math.degrees(math.acos(cos_theta))


def poll_fall_detection(mpu, sensor_data, trigger_buzzer, send_fall_alert):
    """Call every loop iteration — no internal throttling, this is the
    high-priority sensor. Temperature is intentionally ignored.

    mpu             : MPU6050 driver instance
    sensor_data     : shared dict, only used to read lat/lon for the alert
    trigger_buzzer  : callable, no args — sounds the buzzer
    send_fall_alert : callable, takes one dict arg — fall event details
    """
    global _state, _possible_fall_time, _impact_confirmed, _rotation_confirmed
    global _baseline_vector, _peak_accel_g, _peak_gyro_dps, _stillness_start_time

    if mpu is None:
        return

    try:
        vals = mpu.get_values()
    except Exception as e:
        print("MPU6050 read failed:", e)
        return

    ax, ay, az = vals["AcX"], vals["AcY"], vals["AcZ"]
    gx, gy, gz = vals["GyX"], vals["GyY"], vals["GyZ"]

    accel_mag = _accel_magnitude(ax, ay, az)
    gyro_mag = _gyro_magnitude(gx, gy, gz)
    now = time.ticks_ms()

    if _state == _STATE_IDLE:
        # Stage 1: possible fall — brief near-freefall dip
        if FREE_FALL_MIN_G <= accel_mag <= FREE_FALL_MAX_G:
            _state = _STATE_WAIT_IMPACT
            _possible_fall_time = now
            _impact_confirmed = False
            _rotation_confirmed = False
            _baseline_vector = (ax, ay, az)  # orientation just before the fall
            _peak_accel_g = accel_mag
            _peak_gyro_dps = gyro_mag

    elif _state == _STATE_WAIT_IMPACT:
        elapsed = time.ticks_diff(now, _possible_fall_time)

        if accel_mag > _peak_accel_g:
            _peak_accel_g = accel_mag
        if gyro_mag > _peak_gyro_dps:
            _peak_gyro_dps = gyro_mag

        if accel_mag >= IMPACT_G_THRESHOLD:
            _impact_confirmed = True
        if gyro_mag >= ROTATION_DEG_S_THRESHOLD:
            _rotation_confirmed = True

        if _impact_confirmed and _rotation_confirmed:
            # Stages 2+3 confirmed — check posture change now (stage 4)
            posture_change = _vector_angle_deg(_baseline_vector, (ax, ay, az))
            if posture_change >= POSTURE_CHANGE_MIN_DEG:
                _state = _STATE_WAIT_STILLNESS
                _stillness_start_time = now
            else:
                # Impact + rotation happened but no real orientation change
                # — likely a knock/vibration on the device, not a fall
                _state = _STATE_IDLE

        elif elapsed > IMPACT_WINDOW_MS:
            # Window expired without both confirmations — false alarm
            _state = _STATE_IDLE

    elif _state == _STATE_WAIT_STILLNESS:
        # Stage 5: must stay still for the full window, reset on movement
        moving = (abs(accel_mag - 1.0) > STILLNESS_ACC_TOLERANCE_G or
                  gyro_mag > STILLNESS_GYRO_TOLERANCE_DEG_S)

        if moving:
            _stillness_start_time = now
        else:
            still_duration = time.ticks_diff(now, _stillness_start_time)
            if still_duration >= STILLNESS_WINDOW_MS:
                # All five stages confirmed — real fall
                posture_change = _vector_angle_deg(_baseline_vector, (ax, ay, az))

                lat, lon, loc_stale = get_current_location()

                fall_details = {
                    "event": "fall_detected",
                    "timestamp_ms": now,
                    "peak_accel_g": _peak_accel_g,
                    "peak_gyro_dps": _peak_gyro_dps,
                    "posture_change_deg": posture_change,
                    "latitude": lat,
                    "longitude": lon,
                    "location_stale": loc_stale,
                }
                trigger_buzzer()
                send_fall_alert(fall_details)

                _state = _STATE_IDLE

def trigger_buzzer():
    """Call this once when a fall is confirmed. Non-blocking —
    just sets the pin high and starts a timer."""
    global _buzzer_active, _buzzer_start_time
    _buzzer.value(1)
    _buzzer_active = True
    _buzzer_start_time = time.ticks_ms()
    
def service_buzzer():
    """Call every loop iteration. Turns the buzzer off once
    BUZZER_DURATION_MS has elapsed since it was triggered."""
    global _buzzer_active
    if _buzzer_active:
        elapsed = time.ticks_diff(time.ticks_ms(), _buzzer_start_time)
        if elapsed >= BUZZER_DURATION_MS:
            _buzzer.value(0)
            _buzzer_active = False
            
def poll_gps(gps, gps_uart, sensor_data):
    """Call every loop iteration (cheap — just drains UART bytes into the
    parser). NMEA sentences arrive continuously and must be fed in
    regardless of how often we publish, or sentences get lost/desynced.

    gps         : MicropythonGPS driver instance
    gps_uart    : UART object wired to the GPS module
    sensor_data : shared dict, updated only every _GPS_PUBLISH_INTERVAL_MS
    """
    global _gps_last_publish, _last_known_lat, _last_known_lon, _has_ever_had_fix

    if gps is None or gps_uart is None:
        sensor_data["latitude"] = None
        sensor_data["longitude"] = None
        sensor_data["location_stale"] = True
        return

    # Drain whatever bytes are waiting — cheap, must run every iteration
    if gps_uart.any():
        data = gps_uart.read()
        if data:
            for byte in data:
                gps.update(chr(byte))

    # The moment we get a genuinely valid fix, remember it immediately —
    # not gated by the publish timer, so a fall alert always has the
    # freshest possible location available
    if gps.valid:
        _last_known_lat = gps.latitude
        _last_known_lon = gps.longitude
        _has_ever_had_fix = True

    # Only write into sensor_data (used by JSON/TFT) on the slow interval
    now = time.ticks_ms()
    if time.ticks_diff(now, _gps_last_publish) < _GPS_PUBLISH_INTERVAL_MS:
        return

    if _has_ever_had_fix:
        sensor_data["latitude"] = _last_known_lat
        sensor_data["longitude"] = _last_known_lon
        # True live fix right now vs. a cached outdoor fix (e.g. moved indoors)
        sensor_data["location_stale"] = not gps.valid
    else:
        # Never had a real fix yet — do not send/display fabricated
        # coordinates like 0.0, 0.0
        sensor_data["latitude"] = None
        sensor_data["longitude"] = None
        sensor_data["location_stale"] = True

    _gps_last_publish = now


def get_current_location():
    """Call this directly when building a fall alert — bypasses the
    2-minute publish timer entirely, since a fall needs the freshest
    location immediately regardless of the normal reporting schedule.

    Returns (latitude, longitude, is_stale) — lat/lon are None if no
    fix has ever been obtained, never fabricated placeholder values.
    """
    if not _has_ever_had_fix:
        return None, None, True
    return _last_known_lat, _last_known_lon, True

def center_text(display, font, text, y_pos, color):
    text_width = font.measure_text(text)
    x_pos = (display.width - text_width) // 2
    display.draw_text(x_pos, y_pos, text, font, color)


def draw_static_title(display, font):
    """Call once at boot. 'TrailGuard' never changes, so it's never
    cleared/redrawn again after this."""
    center_text(display, font, "TrailGuard", TITLE_Y, COLOR_YELLOW)


def _clear_row(display, y):
    display.fill_rectangle(0, y, display.width, ROW_HEIGHT, COLOR_BLACK)


def update_display(display, font, sensor_data):
    """Call every ~1s from your master loop's own timer. Clears and
    redraws only the three data rows — title stays untouched."""

    # ---- Row 1: HR / SpO2 (MAX30100) ----
    _clear_row(display, ROW1_Y)
    hr = sensor_data.get("heart_rate")
    spo2 = sensor_data.get("spo2")
    finger_present = sensor_data.get("finger_present")

    if not finger_present:
        line1 = "Place finger on sensor"
    elif hr is None or spo2 is None:
        line1 = "HR: -- BPM | SpO2: --%"
    else:
        line1 = "HR: {:.0f} BPM | SpO2: {:.0f}%".format(hr, spo2)
    display.draw_text(LEFT_MARGIN, ROW1_Y, line1, font, COLOR_RED)

    # ---- Row 2: Temp / Humidity (DHT22) ----
    _clear_row(display, ROW2_Y)
    temp = sensor_data.get("temperature")
    humidity = sensor_data.get("humidity")

    if temp is None or humidity is None:
        line2 = "Temp: -- C | Hum: --%"
    else:
        line2 = "Temp: {:.1f} C | Hum: {:.0f}%".format(temp, humidity)
    display.draw_text(LEFT_MARGIN, ROW2_Y, line2, font, COLOR_GREEN)

    # ---- Row 3: Lat / Lon (NEO-6M) ----
    _clear_row(display, ROW3_Y)
    lat = sensor_data.get("latitude")
    lon = sensor_data.get("longitude")
    stale = sensor_data.get("location_stale")

    # Fall back to default location + red 'D' marker only if no real
    # fix has ever been obtained (lat is None) — otherwise unchanged
    lat, lon, marker = (lat, lon, "LK") if lat is not None else (DEFAULT_LAT, DEFAULT_LON, "D")

    line3 = "Lat: {:.5f}  Lon: {:.5f}".format(lat, lon)
    display.draw_text(LEFT_MARGIN, ROW3_Y, line3, font, COLOR_WHITE)
    if marker == "D" or (marker == "LK" and stale):
        marker_x = LEFT_MARGIN + font.measure_text(line3) + 8
        display.draw_text(marker_x, ROW3_Y, marker, font, COLOR_RED)

def connect_wifi(ssid, password, timeout_ms=15000):
    """Connects the ESP32-S3 to WiFi. Blocks until connected or
    timeout_ms elapses. Returns True on success, False on failure —
    call this once at boot before starting your main loop."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
        print("WiFi already connected:", wlan.ifconfig())
        return True

    print("Connecting to WiFi '{}'...".format(ssid))
    wlan.connect(ssid, password)

    start = time.ticks_ms()
    while not wlan.isconnected():
        if time.ticks_diff(time.ticks_ms(), start) > timeout_ms:
            print("WiFi connection timed out.")
            wlan.active(False)
            return False
        time.sleep_ms(200)

    print("WiFi connected:", wlan.ifconfig())
    return True


def is_wifi_connected():
    """Quick check — safe to call frequently, no blocking."""
    wlan = network.WLAN(network.STA_IF)
    return wlan.isconnected()

def send_periodic_data(sensor_data, server_url, interval_ms=_JSON_SEND_INTERVAL_MS):
    """Call every loop iteration — internally rate-limited to only
    actually send once per interval_ms. Bundles HR/SpO2, temp/humidity,
    and location together in one POST."""
    global _json_last_send

    now = time.ticks_ms()
    if time.ticks_diff(now, _json_last_send) < interval_ms:
        return

    if not is_wifi_connected():
        print("Periodic send skipped — WiFi not connected")
        _json_last_send = now
        return

    payload = {
        "event": "periodic_update",
        "heart_rate": sensor_data.get("heart_rate"),
        "spo2": sensor_data.get("spo2"),
        "temperature": sensor_data.get("temperature"),
        "humidity": sensor_data.get("humidity"),
        "latitude": sensor_data.get("latitude"),
        "longitude": sensor_data.get("longitude"),
        "location_stale": sensor_data.get("location_stale"),
        "timestamp_ms": now,
    }

    try:
        resp = urequests.post(server_url, data=ujson.dumps(payload),
                               headers={"Content-Type": "application/json"})
        resp.close()
    except Exception as e:
        print("Periodic data send failed:", e)

    _json_last_send = now


def send_fall_alert(fall_details, server_url):
    """Call immediately when a fall is confirmed — bypasses the 1-minute
    periodic timer entirely, same server_url as the periodic send.
    fall_details already carries 'event': 'fall_detected' from
    poll_fall_detection, so the server can distinguish it from
    periodic updates by payload content rather than a separate route."""
    if not is_wifi_connected():
        print("Fall alert send failed — WiFi not connected")
        return

    try:
        resp = urequests.post(server_url, data=ujson.dumps(fall_details),
                               headers={"Content-Type": "application/json"})
        resp.close()
        print("Fall alert sent")
    except Exception as e:
        print("Fall alert send failed:", e)
        
# ---- Shared sensor state ----
sensor_data = {
    "heart_rate": None,
    "spo2": None,
    "finger_present": False,
    "temperature": None,
    "humidity": None,
    "latitude": None,
    "longitude": None,
    "location_stale": True,
}

SERVER_URL = "https://webhook.site/3fdbc5cb-a5a6-4210-ac82-884f95b1f080"  # replace with your actual endpoint

# ---- WiFi connect (blocking, once, before the loop) ----
connect_wifi(WIFI_SSID, WIFI_PASSWORD)

# ---- Display init (moved here from earlier in the file — must come
# after draw_static_title() is defined) ----
backlight = PWM(Pin(20), freq=1000, duty_u16=32768)
spi = SPI(1, baudrate=40000000, sck=Pin(38), mosi=Pin(41))
display = ili9341.Display(spi, cs=Pin(10), dc=Pin(39), rst=Pin(40),
                           rotation=90, width=320, height=240)
font = XglcdFont('Unispace12x24.c', 12, 24)

display.clear()
draw_static_title(display, font)

display_timer = time.ticks_ms()

if max30100_sensor is not None:
    max30100_sensor.clear_fifo()

# ---- Main loop ----
while True:
    # High priority — every iteration, no throttling
    poll_fall_detection(
        mpu_sensor,
        sensor_data,
        trigger_buzzer,
        lambda details: send_fall_alert(details, SERVER_URL)
    )
    service_buzzer()

    # Sensor polling — each self-throttles internally where needed
    poll_max30100(max30100_sensor, sensor_data)
    poll_dht22(dht_sensor, sensor_data)
    poll_gps(gps, gps_uart, sensor_data)

    # Periodic JSON send — self-throttled to once a minute
    send_periodic_data(sensor_data, SERVER_URL)

    # Display update — every ~1s
    now = time.ticks_ms()
    if time.ticks_diff(now, display_timer) >= 1000:
        update_display(display, font, sensor_data)
        display_timer = now

    time.sleep_ms(15)  