"""
TrailGuard master firmware — main.py
Sections built so far:
  1. Display + WiFi/LoRa telemetry link setup
  2. Boot splash screen ("WELCOME TO TRAILGUARD")
  3. One-time boot health check (sci-fi terminal style)
  4. Bus + component initialization
Main sensor loop (fall detection, buzzer, HTTP/LoRa posting, GPS status)
is not yet added — see bottom of file.
"""

from machine import Pin, SPI, PWM, I2C, UART
from ili9341 import Display, color565
from xglcd_font import XglcdFont
import time
import network
import ujson
import urequests
from machine import WDT

# --- Sensor / peripheral driver imports (files present on device flash) ---
from max30100 import MAX30100
from mpu6050 import MPU6050
from bme280 import BME280
from neo6m import NEO6M
from sx1278 import SX1278


# ============================================================
# 1. DISPLAY INIT (ILI9341, landscape 320x240)
#    Shared SPI bus — also used by the SX1278 LoRa module below.
#    Devices are distinguished by their separate CS pins, not by
#    separate SPI objects (two SPI() instances on the same pins
#    would fight each other).
# ============================================================
shared_spi = SPI(1, baudrate=40000000, sck=Pin(5), mosi=Pin(4), miso=Pin(38))
display = Display(shared_spi, dc=Pin(17), cs=Pin(7), rst=Pin(15),
                   width=320, height=240, rotation=90)

backlight = PWM(Pin(18), freq=1000)
backlight.duty(1023)  # full brightness

splash_font = XglcdFont('Unispace12x24.c', 12, 24)


# ============================================================
# 1b. WIFI / LORA TELEMETRY LINK MANAGEMENT
# ============================================================
WIFI_SSID = "Airtel_HIG-4 Floor 1"
WIFI_PASSWORD = "Ayushman"
WIFI_CONNECT_TIMEOUT = 4          # seconds to wait during splash before falling back
WIFI_RETRY_INTERVAL = 60          # seconds between background retry attempts while on LoRa

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

telemetry_link = "LORA"           # current active path: "WIFI" or "LORA"
_last_wifi_retry = 0# timestamp of last retry attempt, for interval gating

device_Id="TG290820260001"
device_name="TG_MOD01"



def start_wifi_connect():
    """Kick off a non-blocking WiFi connection attempt. Called once during splash."""
    if not wlan.isconnected():
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)


def resolve_initial_link(timeout=WIFI_CONNECT_TIMEOUT):
    """Wait up to `timeout` seconds for WiFi to connect (called during the splash
    delay, replacing a plain time.sleep). Falls back to LoRa if it doesn't connect
    in time. Returns the resolved link ("WIFI" or "LORA")."""
    global telemetry_link
    start = time.time()
    while time.time() - start < timeout:
        if wlan.isconnected():
            telemetry_link = "WIFI"
            return telemetry_link
        time.sleep(0.2)
    telemetry_link = "LORA"
    return telemetry_link


def get_active_link():
    """Call this before every telemetry send. Returns 'WIFI' or 'LORA'.
    Keeps re-evaluating link state continuously:
      - If currently on WIFI but the connection dropped, fails over to LORA immediately.
      - If currently on LORA, periodically retries WIFI in the background
        (non-blocking check, gated by WIFI_RETRY_INTERVAL)."""
    global telemetry_link, _last_wifi_retry

    if telemetry_link == "WIFI":
        if not wlan.isconnected():
            telemetry_link = "LORA"
        return telemetry_link

    # Currently on LORA — periodically check/retry WiFi without blocking
    now = time.time()
    if now - _last_wifi_retry >= WIFI_RETRY_INTERVAL:
        _last_wifi_retry = now
        if wlan.isconnected():
            telemetry_link = "WIFI"
        else:
            wlan.connect(WIFI_SSID, WIFI_PASSWORD)  # fire a fresh attempt; non-blocking

    return telemetry_link


# ============================================================
# 2. BOOT SPLASH SCREEN
# ============================================================
def show_welcome_screen(display, font, duration=5):
    """Display the TrailGuard boot splash for `duration` seconds.
    Also kicks off WiFi connection and resolves WIFI vs LORA during that time."""
    start_wifi_connect()
    display.clear()

    text = "WELCOME TO"
    text2 = "TRAILGUARD"

    x1 = (display.width - len(text) * font.width) // 2
    x2 = (display.width - len(text2) * font.width) // 2

    display.draw_text(x1, 90, text, font, color565(255, 255, 255))
    display.draw_text(x2, 120, text2, font, color565(0, 255, 0))

    resolve_initial_link(timeout=duration)
    display.clear()


# ============================================================
# 3. ONE-TIME BOOT HEALTH CHECK (sci-fi terminal style)
# ============================================================
def run_health_check(display, font, components, get_link_fn):
    """Run once after the splash screen. Initializes each component in `components`
    and prints a boot-log style '<name>, healthy' line for each. Finishes by
    showing the active telemetry link (WiFi/LoRa).

    Args:
        display: Display object
        font: XglcdFont object (monospace font, e.g. splash_font)
        components: list of (name, init_fn) tuples. init_fn() should construct
            and return the sensor object, or None on failure.
        get_link_fn: callable, e.g. get_active_link, returning "WIFI" or "LORA"

    Returns:
        dict of {name: object_or_None} for each component.
    """
    GREEN = color565(0, 255, 70)
    DIM_GREEN = color565(0, 90, 30)
    RED = color565(255, 40, 40)

    display.clear()
    line_height = font.height + 4
    y = 10
    left_margin = 10
    initialized = {}

    def type_line(text, color, delay=0.015):
        """Draw text character by character for a terminal typewriter effect."""
        nonlocal y
        x = left_margin
        for ch in text:
            display.draw_letter(x, y, ch, font, color)
            x += font.width
            time.sleep(delay)
        y += line_height

    # Header
    type_line("TRAILGUARD SYSTEM DIAGNOSTICS", GREEN, delay=0.008)
    type_line("-" * 26, DIM_GREEN, delay=0.003)
    time.sleep(0.3)

    # Run each component init + check
    for name, init_fn in components:
        type_line("INIT: {0}...".format(name), DIM_GREEN, delay=0.01)
        time.sleep(0.2)
        obj = init_fn()
        initialized[name] = obj

        if obj is not None:
            type_line("  > {0}, healthy".format(name), GREEN, delay=0.008)
        else:
            type_line("  > {0}, FAULT".format(name), RED, delay=0.008)
        time.sleep(0.15)

    time.sleep(0.3)
    type_line("-" * 26, DIM_GREEN, delay=0.003)

    # Telemetry link status
    link = get_link_fn()
    link_text = "LINK: WIFI [ONLINE]" if link == "WIFI" else "LINK: LORA MESH [ACTIVE]"
    type_line(link_text, GREEN, delay=0.01)

    time.sleep(1.0)
    display.clear()
    return initialized


# ============================================================
# 4. BUS SETUP + COMPONENT INIT FUNCTIONS
# ============================================================

# Shared I2C(0) bus for MPU6050, BME280, MAX30100 (addresses 0x68, 0x76, 0x57)
i2c0 = I2C(0, scl=Pin(1), sda=Pin(2), freq=400000)

# NEO-6M GPS on UART(1)
uart1 = UART(1, baudrate=9600, tx=Pin(40), rx=Pin(39))
uart1.init(9600, bits=8, parity=None, stop=1)

# SX1278 LoRa — shares `shared_spi` with the display, distinguished by CS/RST
LORA_CS_PIN = 6
LORA_RST_PIN = 16
LORA_DIO0_PIN = 42  # <-- PLACEHOLDER: set your actual DIO0 GPIO number


def check_max30100():
    try:
        obj = MAX30100(i2c0)
        return obj
    except Exception:
        return None


def check_mpu6050():
    try:
        obj = MPU6050(i2c0, addr=0x68)
        return obj
    except Exception:
        return None


def check_bme280():
    try:
        obj = BME280(i2c0, addr=0x76)
        return obj
    except Exception:
        return None


def check_gps():
    try:
        obj = NEO6M(uart1)
        return obj
    except Exception:
        return None


def check_lora():
    try:
        obj = SX1278(shared_spi, cs=Pin(LORA_CS_PIN), rst=Pin(LORA_RST_PIN),
                      dio0=Pin(LORA_DIO0_PIN))
        return obj
    except Exception:
        return None


components = [
    ("MAX30100", check_max30100),
    ("MPU6050", check_mpu6050),
    ("BME280", check_bme280),
    ("NEO-6M GPS", check_gps),
    ("SX1278 LoRa", check_lora),
]




# ============================================================
# BOOT SEQUENCE
# ============================================================
show_welcome_screen(display, splash_font, duration=5)

sensors = run_health_check(display, splash_font, components, get_active_link)

max30100_sensor = sensors["MAX30100"]
mpu6050_sensor = sensors["MPU6050"]
bme280_sensor = sensors["BME280"]
gps = sensors["NEO-6M GPS"]
lora = sensors["SX1278 LoRa"]

# Device is now fully initialized — ready for the main loop.

# --- BME280 periodic environmental readings (every 2s) ---
BME280_READ_INTERVAL = 2  # seconds
_last_bme280_read = 0

# Latest readings, updated in place — read these from anywhere else in the loop
env_data = {"temperature": None, "pressure": None, "humidity": None}


def update_bme280(bme280_sensor):
    """Call this every loop iteration. Internally gated to fire only every
    BME280_READ_INTERVAL seconds. Updates the shared env_data dict."""
    global _last_bme280_read

    if bme280_sensor is None:
        return  # sensor failed health check — skip silently

    now = time.time()
    if now - _last_bme280_read < BME280_READ_INTERVAL:
        return

    _last_bme280_read = now
    try:
        temp, pressure, humidity = bme280_sensor.read_compensated_data()
        env_data["temperature"] = temp
        env_data["pressure"] = pressure
        env_data["humidity"] = humidity
    except Exception:
        pass  # keep last known good values rather than clobbering with garbage
    
# --- MAX30100 heart rate / SpO2 (continuous ~15ms sampling) ---
MAX30100_UPDATE_INTERVAL_MS = 15
_last_max30100_update = time.ticks_ms()

# Latest readings, updated in place — read these from anywhere else in the loop
vitals_data = {"heart_rate": 0.0, "spo2": 0.0, "finger_present": False}


def update_max30100(max30100_sensor):
    """Call this every main loop iteration. Internally gated to actually run
    sensor.update() only every ~15ms, since the beat-detection algorithm needs
    dense sampling to work correctly. Updates the shared vitals_data dict."""
    global _last_max30100_update

    if max30100_sensor is None:
        return  # sensor failed health check — skip silently

    now = time.ticks_ms()
    if time.ticks_diff(now, _last_max30100_update) < MAX30100_UPDATE_INTERVAL_MS:
        return

    _last_max30100_update = now
    try:
        max30100_sensor.update()
        hr, spo2, finger = max30100_sensor.get_readings()
        vitals_data["heart_rate"] = hr
        vitals_data["spo2"] = spo2
        vitals_data["finger_present"] = finger
    except Exception as e:
        print("MAX30100 update error:", e)  # <-- TEMP DEBUG: remove once fixed
        pass  # keep last known good values rather than clobbering with garbage
    
# --- MPU6050 motion monitoring + buzzer alert (accel + gyro combined) ---
buzzer = Pin(37, Pin.OUT)

# Tune these to your actual fall/impact test data
ACCEL_THRESHOLD_G = 2.5      # total acceleration magnitude, in g
GYRO_THRESHOLD_DPS = 200   # total gyroscopic magnitude, in deg/s

MOTION_UPDATE_INTERVAL_MS = 50  # how often to poll MPU6050
_last_motion_update = time.ticks_ms()

# Latest readings, updated in place — read these from anywhere else in the loop
motion_data = {"accel_magnitude": 0.0, "gyro_magnitude": 0.0, "alert_active": False}


def update_mpu6050(mpu6050_sensor):
    """Call this every main loop iteration. Internally gated to poll every
    MOTION_UPDATE_INTERVAL_MS. Computes total acceleration and gyroscopic
    magnitude, and sounds the buzzer if BOTH exceed their safe thresholds
    at the same time."""
    global _last_motion_update

    if mpu6050_sensor is None:
        return  # sensor failed health check — skip silently

    now = time.ticks_ms()
    if time.ticks_diff(now, _last_motion_update) < MOTION_UPDATE_INTERVAL_MS:
        return

    _last_motion_update = now
    try:
        accel_mag = mpu6050_sensor.read_accel_magnitude()
        gx, gy, gz = mpu6050_sensor.read_gyro()
        gyro_mag = (gx ** 2 + gy ** 2 + gz ** 2) ** 0.5

        motion_data["accel_magnitude"] = accel_mag
        motion_data["gyro_magnitude"] = gyro_mag

        if accel_mag > ACCEL_THRESHOLD_G and gyro_mag > GYRO_THRESHOLD_DPS:
            motion_data["alert_active"] = True
            buzzer.value(1)
        else:
            motion_data["alert_active"] = False
            buzzer.value(0)
    except Exception:
        pass  # keep last known good values rather than clobbering with garbage

# --- NEO-6M GPS location tracking (called every loop iteration, non-blocking) ---
# Latest readings, updated in place — read these from anywhere else in the loop

# <-- TESTING FALLBACK: GPS won't get a fix indoors, so these default coordinates
#     are used until a real fix comes in. Remove/replace before actual field deployment.
DEFAULT_LATITUDE = 20.250209353236624
DEFAULT_LONGITUDE = 85.80011605767179

gps_data = {"latitude": DEFAULT_LATITUDE, "longitude": DEFAULT_LONGITUDE, "has_fix": False,
            "altitude": None, "speed_kmh": None, "satellites": 0}


def update_gps(gps):
    """Call this every main loop iteration — no internal timer gate needed,
    since gps.update() is already non-blocking and just drains whatever
    NMEA data has arrived on UART since the last call."""
    if gps is None:
        return  # sensor failed health check — skip silently

    try:
        gps.update()

        if gps.has_fix():
            lat, lon = gps.get_location()
            gps_data["latitude"] = lat
            gps_data["longitude"] = lon
            gps_data["has_fix"] = True
            gps_data["altitude"] = gps.altitude
            gps_data["speed_kmh"] = gps.speed_kmh
            gps_data["satellites"] = gps.satellites
        else:
            gps_data["has_fix"] = False
    except Exception:
        pass  # keep last known good values rather than clobbering with garbage
    
# --- Telemetry sending: WiFi POST or LoRa, JSON payload, periodic + fall-triggered ---


SERVER_URL = "https://trailguard-backend.onrender.com/api/device/readings"  # <-- fill in your endpoint

TELEMETRY_INTERVAL_MS = 120000  # 2 minutes
_last_telemetry_send = time.ticks_ms()
_prev_alert_state = False  # tracks buzzer alert edge, so fall alert fires once per event


def build_telemetry_payload(alert=False):
    """Assembles the current sensor readings into a JSON-ready dict with Device ID."""
    return {
        "deviceId": device_Id,  # <-- Injects your global device_id variable
        "heartRate": vitals_data["heart_rate"],
        "spo2": vitals_data["spo2"],
        "temperature": env_data["temperature"],
        "pressure": env_data["pressure"],
        "humidity": env_data["humidity"],
        "latitude": gps_data["latitude"],
        "longitude": gps_data["longitude"],
        "fallDetected": alert,
    }

def send_telemetry(payload):
    """Sends `payload` as JSON over WiFi (HTTP POST) or LoRa, depending on
    the currently active link. Returns True/False for success."""
    link = get_active_link()
    json_str = ujson.dumps(payload)

    if link == "WIFI":
        try:
            response = urequests.post(SERVER_URL, data=json_str,
                                       headers={"Content-Type": "application/json"})
            response.close()
            return True
        except Exception:
            return False
        finally:
            # Known FIFO overflow issue: blocking urequests.post() calls can
            # cause MAX30100's FIFO to overflow while the send is in progress.
            if max30100_sensor is not None:
                max30100_sensor.clear_fifo()
    else:  # LORA
        try:
            return lora.send(json_str.encode(), timeout_ms=2000)
        except Exception:
            return False


def update_telemetry():
    global _last_telemetry_send, _prev_alert_state

    now = time.ticks_ms()

    # Immediate send on fall alert (rising edge only)
    if motion_data["alert_active"] and not _prev_alert_state:
        payload = build_telemetry_payload(alert=True)
        success = send_telemetry(payload)
        if success:
            set_alert_message(display, splash_font, "FALL ALERT SENT", RED, SOS_DISPLAY_MS)
    _prev_alert_state = motion_data["alert_active"]

    # Independent periodic send every 2 minutes
    if time.ticks_diff(now, _last_telemetry_send) >= TELEMETRY_INTERVAL_MS:
        _last_telemetry_send = now
        payload = build_telemetry_payload(alert=False)
        send_telemetry(payload)
    
# --- Incoming message polling (WiFi or LoRa, whichever link is active) ---
MESSAGE_POLL_URL = "https://YOUR_SERVER_URL_HERE/messages"  # <-- fill in your endpoint

INCOMING_POLL_INTERVAL_MS = 15000  # check every 15 seconds
BANNER_DISPLAY_MS = 10000          # message stays visible in the alerts box for 10 seconds
SOS_DISPLAY_MS = 15000             # SOS/cancel text stays visible for 15 seconds
LORA_RX_TIMEOUT_MS = 100           # keep short — receive() blocks the whole loop

_last_incoming_poll = time.ticks_ms()


def check_wifi_messages():
    try:
        response = urequests.get(MESSAGE_POLL_URL)
        data = response.json()
        response.close()
        if data and data.get("message"):
            return data["message"]
    except Exception:
        pass
    return None


def check_lora_messages():
    try:
        packet = lora.receive(timeout_ms=LORA_RX_TIMEOUT_MS)
        if packet:
            return packet.decode("utf-8", "ignore")
    except Exception:
        pass
    return None


def update_incoming_messages(display, font):
    """Call this every main loop iteration. Internally gated to actually poll
    only every INCOMING_POLL_INTERVAL_MS. Shows any new message in the
    MESSAGES/ALERTS box (amber), auto-clearing via update_alert_box()."""
    global _last_incoming_poll

    now = time.ticks_ms()
    if time.ticks_diff(now, _last_incoming_poll) >= INCOMING_POLL_INTERVAL_MS:
        _last_incoming_poll = now
        link = get_active_link()
        message = check_wifi_messages() if link == "WIFI" else check_lora_messages()

        if message:
            set_alert_message(display, font, message[:25], AMBER, BANNER_DISPLAY_MS)


# ============================================================
# MAIN SCREEN — sci-fi HUD layout
# Header, two side-by-side panels (HR / ENV), a LOCATION panel,
# a MESSAGES/ALERTS panel (replaces the battery bar from the
# original reference image).
# ============================================================
WHITE = color565(255, 255, 255)
GREEN = color565(0, 255, 70)
DIM_GREEN = color565(0, 90, 30)
MAGENTA = color565(255, 0, 180)
DIM_MAGENTA = color565(110, 0, 80)
AMBER = color565(255, 180, 0)
DIM_AMBER = color565(110, 80, 0)
RED = color565(255, 40, 40)
BLACK = color565(0, 0, 0)
GRID_DIM = color565(0, 40, 20)

# Box geometry (320x240 landscape)
HEADER_Y = 4
HEADER_DIVIDER_Y = 28

BOX_HR = (4, 32, 156, 124)     # x0, y0, x1, y1 — 3 lines: label, value, secondary
BOX_ENV = (164, 32, 316, 124)
BOX_LOC = (4, 128, 316, 184)   # 2 lines: label, lat/lon
BOX_ALERT = (4, 188, 316, 224) # 1 line, compact

_box_cache = {}  # tracks last-drawn text per value line, to avoid needless redraws

# Shared alert-box state (drives the MESSAGES/ALERTS panel)
_alert_text = None
_alert_color = None
_alert_shown_at = None
_alert_duration_ms = None


def _draw_value(display, font, x, y, width, text, color, key, bg=BLACK):
    """Only clears+redraws this value region if its text actually changed."""
    if _box_cache.get(key) == text:
        return
    _box_cache[key] = text
    display.fill_hrect(x, y, width, font.height + 2, bg)
    display.draw_text(x, y, text, font, color, background=bg)


def _draw_value_bold(display, font, x, y, width, text, color, key, bg=BLACK):
    """Same as _draw_value, but draws the text twice with a 1px x-offset for
    a faux-bold look — used for the headline HR/temperature numbers, since
    we don't have a larger font file to make them literally bigger."""
    if _box_cache.get(key) == text:
        return
    _box_cache[key] = text
    display.fill_hrect(x, y, width, font.height + 2, bg)
    display.draw_text(x, y, text, font, color, background=bg)
    display.draw_text(x + 1, y, text, font, color, background=bg)


def _draw_grid_background(display):
    """Sparse dim grid lines, drawn once as a static backdrop."""
    for x in range(0, display.width, 40):
        display.draw_vline(x, 0, display.height, GRID_DIM)
    for y in range(0, display.height, 40):
        display.draw_hline(0, y, display.width, GRID_DIM)


def _draw_box(display, box, color):
    x0, y0, x1, y1 = box
    display.draw_rectangle(x0, y0, x1 - x0, y1 - y0, color)


def set_alert_message(display, font, text, color, duration_ms):
    """Shows `text` in the MESSAGES/ALERTS box. Used for incoming messages,
    fall alerts, and manual SOS send/cancel — whichever fires most recently
    wins (last-write-wins, no queue)."""
    global _alert_text, _alert_color, _alert_shown_at, _alert_duration_ms
    _alert_text = text
    _alert_color = color
    _alert_shown_at = time.ticks_ms()
    _alert_duration_ms = duration_ms

    x0, y0, x1, y1 = BOX_ALERT
    _draw_value(display, font, x0 + 6, y0 + (y1 - y0 - font.height) // 2,
                (x1 - x0) - 12, text, color, key="alert")


def update_alert_box(display, font):
    """Call every main loop iteration. Auto-clears the alerts box back to
    STANDBY after the current message's duration elapses."""
    global _alert_text, _alert_shown_at
    if _alert_text is not None and _alert_shown_at is not None:
        if time.ticks_diff(time.ticks_ms(), _alert_shown_at) >= _alert_duration_ms:
            x0, y0, x1, y1 = BOX_ALERT
            _draw_value(display, font, x0 + 6, y0 + (y1 - y0 - font.height) // 2,
                        (x1 - x0) - 12, "STANDBY", DIM_AMBER, key="alert")
            _alert_text = None
            _alert_shown_at = None


def show_main_screen(display, font):
    """Call once, right after the health check. Draws the static grid
    background, header, box borders, and panel labels — everything that
    doesn't change loop-to-loop."""
    display.clear()
    _box_cache.clear()

    _draw_grid_background(display)

    display.draw_text(8, HEADER_Y, "TRAILGUARD", font, GREEN, background=BLACK)
    display.draw_text(9, HEADER_Y, "TRAILGUARD", font, GREEN, background=BLACK)  # faux-bold
    display.draw_hline(0, HEADER_DIVIDER_Y, display.width, DIM_GREEN)

    _draw_box(display, BOX_HR, GREEN)
    _draw_box(display, BOX_ENV, GREEN)
    _draw_box(display, BOX_LOC, MAGENTA)
    _draw_box(display, BOX_ALERT, AMBER)

    hx0, hy0, _, _ = BOX_HR
    display.draw_text(hx0 + 6, hy0 + 4, "HEART RATE", font, DIM_GREEN, background=BLACK)

    ex0, ey0, _, _ = BOX_ENV
    display.draw_text(ex0 + 6, ey0 + 4, "ENVIRONMENT", font, DIM_GREEN, background=BLACK)

    lx0, ly0, _, _ = BOX_LOC
    display.draw_text(lx0 + 6, ly0 + 4, "LOCATION", font, DIM_MAGENTA, background=BLACK)

    ax0, ay0, ax1, ay1 = BOX_ALERT
    _draw_value(display, font, ax0 + 6, ay0 + (ay1 - ay0 - font.height) // 2,
                (ax1 - ax0) - 12, "STANDBY", DIM_AMBER, key="alert")


def update_main_screen(display, font):
    """Call every main loop iteration. Redraws only the value lines whose
    underlying data has actually changed."""
    # --- Header: link status, right-aligned ---
    link = get_active_link()
    link_text = "WIFI LINK" if link == "WIFI" else "LORA LINK"
    lx = display.width - len(link_text) * font.width - 8
    _draw_value(display, font, lx, HEADER_Y, len(link_text) * font.width, link_text,
                GREEN if link == "WIFI" else AMBER, key="header_link")

    # --- HR (bold headline) / SpO2 (magenta accent, matches reference image) ---
    hr = vitals_data["heart_rate"]
    spo2 = vitals_data["spo2"]
    hr_text = "{0} bpm".format(int(hr) if hr else "--")
    spo2_text = "SpO2 {0}%".format(int(spo2) if spo2 else "--")
    hx0, hy0, _, _ = BOX_HR
    _draw_value_bold(display, font, hx0 + 6, hy0 + 28, 140, hr_text, GREEN, key="hr")
    _draw_value(display, font, hx0 + 6, hy0 + 56, 140, spo2_text, MAGENTA, key="spo2")

    # --- Environment: bold temperature headline, humidity + pressure secondary ---
    temp = env_data["temperature"]
    hum = env_data["humidity"]
    pres = env_data["pressure"]
    temp_text = "{0}C".format("{:.1f}".format(temp) if temp is not None else "--")
    env_secondary = "H:{0} P:{1}".format(
        int(hum) if hum is not None else "--",
        int(pres) if pres is not None else "--")
    ex0, ey0, _, _ = BOX_ENV
    _draw_value_bold(display, font, ex0 + 6, ey0 + 28, 140, temp_text, GREEN, key="temp")
    _draw_value(display, font, ex0 + 6, ey0 + 56, 140, env_secondary, GREEN, key="env_secondary")

    # --- Location ---
    lat = gps_data["latitude"]
    lon = gps_data["longitude"]
    if lat is not None and lon is not None:
        gps_text = "LAT:{0:.4f} LON:{1:.4f}".format(lat, lon)
    else:
        gps_text = "NO FIX"
    lx0, ly0, _, _ = BOX_LOC
    _draw_value(display, font, lx0 + 6, ly0 + 28, 300, gps_text, MAGENTA, key="gps")


WATCHDOG_ENABLED = True
WATCHDOG_TIMEOUT_MS = 30000  # 30 seconds — must cover worst-case blocking calls
                              # (urequests.post with no explicit timeout, LoRa receive, etc.)

wdt = None
if WATCHDOG_ENABLED:
    wdt = WDT(timeout=WATCHDOG_TIMEOUT_MS)


def feed_watchdog():
    """Call this once per main loop iteration. If the loop stalls for longer
    than WATCHDOG_TIMEOUT_MS (a hung sensor read, a stuck network call, etc.),
    the watchdog is not fed in time and the device hard-resets itself."""
    if wdt is not None:
        wdt.feed()

# --- Manual SOS button (toggle: press to send, press to cancel) ---
# NOTE: confirm this is actually GPIO20 as earlier agreed, or GPIO21 as
# currently wired below — these were inconsistent in the file as received.
sos_button = Pin(21, Pin.IN, Pin.PULL_UP)

SOS_DEBOUNCE_MS = 50  # ignore bounce noise within this window after a press

manual_sos_active = False
_sos_button_prev_state = 1   # idle = HIGH due to pull-up
_last_sos_button_change = 0

def build_sos_payload(cancelled=False):
    """Same sensor snapshot as regular telemetry, tagged as a manual SOS."""
    return {
        "deviceId": device_Id,  # <-- Injects your global device_id variable
        "heartRate": vitals_data["heart_rate"],
        "spo2": vitals_data["spo2"],
        "temperature": env_data["temperature"],
        "pressure": env_data["pressure"],
        "humidity": env_data["humidity"],
        "latitude": gps_data["latitude"],
        "longitude": gps_data["longitude"],
        "manual_sos": True,
        "cancelled": cancelled,
    }


def update_sos_button(display, font):
    global manual_sos_active, _sos_button_prev_state, _last_sos_button_change

    now = time.ticks_ms()
    current_state = sos_button.value()

    if current_state == 0 and _sos_button_prev_state == 1:
        if time.ticks_diff(now, _last_sos_button_change) > SOS_DEBOUNCE_MS:
            _last_sos_button_change = now

            if not manual_sos_active:
                payload = build_sos_payload(cancelled=False)
                success = send_telemetry(payload)
                if success:
                    manual_sos_active = True
                    set_alert_message(display, font, "SOS SENT", RED, SOS_DISPLAY_MS)
            else:
                payload = build_sos_payload(cancelled=True)
                send_telemetry(payload)
                manual_sos_active = False
                set_alert_message(display, font, "SOS CANCELLED", AMBER, SOS_DISPLAY_MS)

    _sos_button_prev_state = current_state


# ============================================================
# MAIN LOOP
# ============================================================
show_main_screen(display, splash_font)  # draw static grid, header, box borders, labels


while True:
    feed_watchdog()  # first, so a slow iteration never causes a false reset

    update_bme280(bme280_sensor)
    update_max30100(max30100_sensor)
    update_mpu6050(mpu6050_sensor)
    update_gps(gps)

    update_telemetry()
    update_incoming_messages(display, splash_font)
    update_alert_box(display, splash_font)

    update_main_screen(display, splash_font)
    update_sos_button(display, splash_font)